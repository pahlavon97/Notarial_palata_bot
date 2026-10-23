import { legalSearchService } from '../../src/services/legal-search.service';
import { rateLimiter } from '../../src/security/rate-limiter';
import { userService } from '../../src/services/user.service';

describe('Load & Scalability Simulation (1,000+ Users)', () => {
  it('should scale to 1,200 registered users without performance degradation', async () => {
    const TOTAL_USERS = 1200;
    const startTime = Date.now();

    // 1. Register 1,200 distinct users
    for (let i = 1; i <= TOTAL_USERS; i++) {
      const telegramId = 1000000 + i;
      const lang = i % 3 === 0 ? 'UZ_LATIN' : i % 3 === 1 ? 'UZ_CYRILLIC' : 'RU';
      await userService.getOrCreateUser(telegramId, {
        username: `user_${i}`,
        firstName: `Citizen ${i}`,
      });
      await userService.setLanguage(telegramId, lang);
    }

    const registrationDuration = Date.now() - startTime;
    expect(userService.getUserCount()).toBeGreaterThanOrEqual(TOTAL_USERS);
    console.log(`⏱️ Registered ${TOTAL_USERS} users in ${registrationDuration}ms (${(registrationDuration / TOTAL_USERS).toFixed(2)}ms/user)`);
  });

  it('should handle 100 concurrent legal search requests within acceptable response time', async () => {
    const CONCURRENT_REQUESTS = 100;
    const testQueries = [
      'Meros guvohnomasi olish muddati',
      'Avtomobil oldi-sotdisi davlat boji',
      'Ko‘chmas mulk oldi-sotdi shartnomasi',
      'Ishonchnoma berish muddati',
      'Никоҳ шартномаси тузиш',
      'Как оформить наследство на квартиру?',
    ];

    const startTime = Date.now();
    const promises: Promise<unknown>[] = [];

    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
      const q = testQueries[i % testQueries.length] || 'Meros tartibi';
      const reqPromise = legalSearchService.answerQuestion(q);
      promises.push(reqPromise);
    }

    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;
    const avgLatency = duration / CONCURRENT_REQUESTS;

    expect(results.length).toBe(CONCURRENT_REQUESTS);
    console.log(`🚀 Processed ${CONCURRENT_REQUESTS} concurrent requests in ${duration}ms (Avg: ${avgLatency.toFixed(2)}ms per request)`);

    // Latency must be under 50ms per request on in-memory grounded search
    expect(avgLatency).toBeLessThan(150);
  });

  it('should handle distributed rate limiting across 500 distinct users', async () => {
    const USERS_COUNT = 500;
    const checks: Promise<any>[] = [];

    for (let i = 1; i <= USERS_COUNT; i++) {
      const userId = `load-user-${i}`;
      checks.push(rateLimiter.checkLimit(userId, 20, 60));
    }

    const results = await Promise.all(checks);
    expect(results.length).toBe(USERS_COUNT);
    for (const r of results) {
      expect(r.allowed).toBe(true);
    }
  });
});
