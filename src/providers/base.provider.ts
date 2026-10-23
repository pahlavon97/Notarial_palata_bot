import { Logger } from '../core/logger/logger';

export interface ProviderHealth {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  lastChecked: Date;
  consecutiveFailures: number;
}

export abstract class BaseProvider {
  protected providerName: string;
  protected logger: Logger;
  protected timeoutMs: number;
  private consecutiveFailures = 0;
  private circuitOpenUntil = 0;
  private readonly failureThreshold = 3;
  private readonly recoveryTimeoutMs = 30000; // 30s open circuit

  constructor(providerName: string, timeoutMs = 6000) {
    this.providerName = providerName;
    this.logger = new Logger(`Provider:${providerName}`);
    this.timeoutMs = timeoutMs;
  }

  protected isCircuitOpen(): boolean {
    if (this.circuitOpenUntil > 0) {
      if (Date.now() < this.circuitOpenUntil) {
        return true;
      }
      // Circuit is now half-open, attempt one call
      this.circuitOpenUntil = 0;
    }
    return false;
  }

  protected recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.circuitOpenUntil = 0;
  }

  protected recordFailure(): void {
    this.consecutiveFailures += 1;
    if (this.consecutiveFailures >= this.failureThreshold) {
      this.circuitOpenUntil = Date.now() + this.recoveryTimeoutMs;
      this.logger.warn(`Circuit breaker opened for provider [${this.providerName}] due to ${this.consecutiveFailures} consecutive failures`);
    }
  }

  protected async executeWithTimeout<T>(operation: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.isCircuitOpen()) {
      this.logger.warn(`Circuit is OPEN for [${this.providerName}]. Executing safe fallback immediately.`);
      return fallback();
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const result = await operation();
      clearTimeout(timeout);
      this.recordSuccess();
      return result;
    } catch (err: unknown) {
      clearTimeout(timeout);
      this.recordFailure();
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Error executing call on [${this.providerName}]: ${message}. Reverting to fallback.`);
      return fallback();
    }
  }

  public getHealth(): ProviderHealth {
    let status: 'UP' | 'DOWN' | 'DEGRADED' = 'UP';
    if (this.isCircuitOpen()) {
      status = 'DOWN';
    } else if (this.consecutiveFailures > 0) {
      status = 'DEGRADED';
    }

    return {
      name: this.providerName,
      status,
      lastChecked: new Date(),
      consecutiveFailures: this.consecutiveFailures,
    };
  }

  public abstract getFallbackUrl(query?: string): string;
}
