import Redis from 'ioredis';
import { env } from '../config/env';
import { Logger } from '../core/logger/logger';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  reason?: string;
}

export class RateLimiter {
  private redisClient: Redis | null = null;
  private inMemoryStore: Map<string, { count: number; expiresAt: number }> = new Map();
  private logger = new Logger('RateLimiter');

  constructor(redisClient?: Redis | null) {
    if (redisClient) {
      this.redisClient = redisClient;
    } else if (env.REDIS_URL) {
      try {
        this.redisClient = new Redis(env.REDIS_URL, {
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
          connectTimeout: 2000,
        });
        this.redisClient.on('error', (err) => {
          this.logger.warn('Redis connection issue, falling back to in-memory rate limiting', {
            error: err.message,
          });
        });
      } catch (err) {
        this.logger.warn('Failed to initialize Redis client, using in-memory store', { error: String(err) });
      }
    }
  }

  /**
   * Sliding window or fixed window limiter per key (e.g. user ID or IP)
   */
  public async checkLimit(
    key: string,
    limit: number = env.RATE_LIMIT_USER_MAX,
    windowSeconds: number = env.RATE_LIMIT_USER_WINDOW_SECONDS
  ): Promise<RateLimitResult> {
    const prefixedKey = `${env.REDIS_KEY_PREFIX}rl:${key}`;

    if (this.redisClient && this.redisClient.status === 'ready') {
      try {
        const current = await this.redisClient.incr(prefixedKey);
        if (current === 1) {
          await this.redisClient.expire(prefixedKey, windowSeconds);
        }
        const ttl = await this.redisClient.ttl(prefixedKey);
        const resetSeconds = ttl > 0 ? ttl : windowSeconds;

        if (current > limit) {
          return {
            allowed: false,
            remaining: 0,
            resetSeconds,
            reason: `Limit of ${limit} requests per ${windowSeconds}s reached`,
          };
        }

        return {
          allowed: true,
          remaining: Math.max(0, limit - current),
          resetSeconds,
        };
      } catch (err) {
        this.logger.warn('Redis error during rate limit check, using in-memory fallback', { error: String(err) });
      }
    }

    // In-memory fallback
    const now = Date.now();
    const existing = this.inMemoryStore.get(prefixedKey);

    if (!existing || now >= existing.expiresAt) {
      this.inMemoryStore.set(prefixedKey, {
        count: 1,
        expiresAt: now + windowSeconds * 1000,
      });
      return {
        allowed: true,
        remaining: limit - 1,
        resetSeconds: windowSeconds,
      };
    }

    existing.count += 1;
    const resetSeconds = Math.max(1, Math.ceil((existing.expiresAt - now) / 1000));

    if (existing.count > limit) {
      return {
        allowed: false,
        remaining: 0,
        resetSeconds,
        reason: `Limit of ${limit} requests per ${windowSeconds}s reached`,
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, limit - existing.count),
      resetSeconds,
    };
  }

  /**
   * Check burst limits (e.g. 5 requests in 5 seconds to prevent spam clicks)
   */
  public async checkBurst(
    userId: string | number,
    burstMax: number = env.RATE_LIMIT_BURST_MAX,
    burstSeconds: number = env.RATE_LIMIT_BURST_WINDOW_SECONDS
  ): Promise<RateLimitResult> {
    return this.checkLimit(`burst:${userId}`, burstMax, burstSeconds);
  }

  /**
   * Periodic cleanup for in-memory store
   */
  public cleanExpiredInMemory(): void {
    const now = Date.now();
    for (const [key, value] of this.inMemoryStore.entries()) {
      if (now >= value.expiresAt) {
        this.inMemoryStore.delete(key);
      }
    }
  }

  /**
   * Reset key (useful for tests)
   */
  public async resetKey(key: string): Promise<void> {
    const prefixedKey = `${env.REDIS_KEY_PREFIX}rl:${key}`;
    this.inMemoryStore.delete(prefixedKey);
    if (this.redisClient && this.redisClient.status === 'ready') {
      try {
        await this.redisClient.del(prefixedKey);
      } catch {
        // ignore
      }
    }
  }
}

export const rateLimiter = new RateLimiter();
