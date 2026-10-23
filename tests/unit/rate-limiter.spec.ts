import { RateLimiter } from '../../src/security/rate-limiter';

describe('RateLimiter Unit Tests', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(null); // In-memory
  });

  it('should allow requests within limit', async () => {
    const result1 = await rateLimiter.checkLimit('user-123', 5, 60);
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(4);

    const result2 = await rateLimiter.checkLimit('user-123', 5, 60);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(3);
  });

  it('should reject requests exceeding limit', async () => {
    for (let i = 0; i < 3; i++) {
      await rateLimiter.checkLimit('user-test-limit', 3, 60);
    }
    const blocked = await rateLimiter.checkLimit('user-test-limit', 3, 60);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.reason).toContain('Limit of 3 requests');
  });

  it('should enforce burst rate limits', async () => {
    const userId = 999888;
    for (let i = 0; i < 5; i++) {
      const res = await rateLimiter.checkBurst(userId, 5, 5);
      expect(res.allowed).toBe(true);
    }

    const burstBlocked = await rateLimiter.checkBurst(userId, 5, 5);
    expect(burstBlocked.allowed).toBe(false);
  });

  it('should reset limits properly', async () => {
    await rateLimiter.checkLimit('user-reset', 1, 60);
    let check = await rateLimiter.checkLimit('user-reset', 1, 60);
    expect(check.allowed).toBe(false);

    await rateLimiter.resetKey('user-reset');
    check = await rateLimiter.checkLimit('user-reset', 1, 60);
    expect(check.allowed).toBe(true);
  });
});
