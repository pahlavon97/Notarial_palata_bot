import Redis from 'ioredis';
import { env } from '../config/env';

export class UpdateDeduplicator {
  private redisClient: Redis | null = null;
  private inMemoryCache: Map<number, number> = new Map(); // updateId -> expiresAt
  private ttlSeconds: number;

  constructor(redisClient?: Redis | null, ttlSeconds = 120) {
    this.ttlSeconds = ttlSeconds;
    if (redisClient) {
      this.redisClient = redisClient;
    } else if (env.REDIS_URL) {
      try {
        this.redisClient = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 1 });
      } catch {
        // use in-memory
      }
    }
  }

  /**
   * Returns true if this update has NOT been seen yet and records it.
   * Returns false if this update is a duplicate.
   */
  public async isUnique(updateId: number): Promise<boolean> {
    const key = `${env.REDIS_KEY_PREFIX}upd:${updateId}`;

    if (this.redisClient && this.redisClient.status === 'ready') {
      try {
        const result = await this.redisClient.set(key, '1', 'EX', this.ttlSeconds, 'NX');
        return result === 'OK';
      } catch {
        // fallback to memory
      }
    }

    const now = Date.now();
    // In-memory check
    const existing = this.inMemoryCache.get(updateId);
    if (existing && existing > now) {
      return false; // Duplicate
    }

    this.inMemoryCache.set(updateId, now + this.ttlSeconds * 1000);

    // Occasional cleanup
    if (this.inMemoryCache.size > 2000) {
      for (const [id, exp] of this.inMemoryCache.entries()) {
        if (now >= exp) {
          this.inMemoryCache.delete(id);
        }
      }
    }

    return true;
  }

  public clear(): void {
    this.inMemoryCache.clear();
  }
}

export const updateDeduplicator = new UpdateDeduplicator();
