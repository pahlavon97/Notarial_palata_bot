import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { Telegraf } from 'telegraf';
import { env } from '../config/env';
import { Logger } from '../core/logger/logger';
import { lexUzProvider } from '../providers/lex-uz.provider';
import { adviceUzProvider } from '../providers/advice-uz.provider';
import { eNotariusProvider } from '../providers/e-notarius.provider';

export function createServer(bot?: Telegraf) {
  const app = express();
  const logger = new Logger('HttpServer');

  // Basic security headers
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));

  // Request logger (secrets redacted automatically)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });

  // Liveness Probe
  app.get('/health/live', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  // Readiness Probe & Comprehensive Health Check (never exposes sensitive keys)
  app.get('/health', (_req: Request, res: Response) => {
    const lexHealth = lexUzProvider.getHealth();
    const adviceHealth = adviceUzProvider.getHealth();
    const eNotariusHealth = eNotariusProvider.getHealth();

    const isReady =
      lexHealth.status !== 'DOWN' &&
      adviceHealth.status !== 'DOWN' &&
      eNotariusHealth.status !== 'DOWN';

    const status = isReady ? 200 : 503;

    res.status(status).json({
      status: isReady ? 'HEALTHY' : 'DEGRADED',
      version: env.APP_VERSION,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      providers: [lexHealth, adviceHealth, eNotariusHealth],
    });
  });

  // Telegram Webhook Endpoint
  if (bot && env.TELEGRAM_MODE === 'webhook') {
    app.post(env.WEBHOOK_PATH, async (req: Request, res: Response): Promise<void> => {
      // Validate secret token if configured
      if (env.WEBHOOK_SECRET_TOKEN) {
        const receivedToken = req.headers['x-telegram-bot-api-secret-token'];
        if (receivedToken !== env.WEBHOOK_SECRET_TOKEN) {
          logger.warn('Unauthorized webhook request rejected (secret token mismatch)');
          res.status(403).json({ error: 'Unauthorized webhook' });
          return;
        }
      }

      try {
        await bot.handleUpdate(req.body, res);
      } catch (err) {
        logger.error('Error handling webhook update', err);
        if (!res.headersSent) {
          res.status(500).send('Internal Error');
        }
      }
    });
  }

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
  });

  return app;
}
