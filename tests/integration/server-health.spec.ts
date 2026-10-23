import request from 'supertest';
import { createServer } from '../../src/server/app';

describe('Server & Health API Integration Tests', () => {
  const app = createServer();

  it('GET /health/live should return 200 UP', async () => {
    const res = await request(app).get('/health/live');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /health should return 200 with provider statuses and NO leaked secrets', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('HEALTHY');
    expect(res.body.version).toBeDefined();
    expect(res.body.providers).toBeInstanceOf(Array);
    expect(res.body.providers.length).toBe(3);

    // Verify secrets are NOT leaked
    const jsonStr = JSON.stringify(res.body);
    expect(jsonStr).not.toContain('TELEGRAM_BOT_TOKEN');
    expect(jsonStr).not.toContain('secret');
    expect(jsonStr).not.toContain('password');
  });

  it('should include security headers via Helmet', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    expect(res.headers['x-frame-options']).toBeDefined();
  });

  it('GET /not-found should return 404', async () => {
    const res = await request(app).get('/unknown-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });
});
