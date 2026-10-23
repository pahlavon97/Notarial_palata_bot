import { env } from './config/env';
import { logger } from './core/logger/logger';
import { createBot } from './bot/bot';
import { createServer } from './server/app';
import { queueService } from './services/queue.service';

async function bootstrap() {
  logger.info(`Starting ${env.APP_NAME} v${env.APP_VERSION} in [${env.NODE_ENV}] mode`);

  const bot = createBot();
  const server = createServer(bot);

  // Start HTTP server for health checks & optional webhook
  const httpServer = server.listen(env.PORT, env.HOST, () => {
    logger.info(`HTTP Server listening on http://${env.HOST}:${env.PORT}`);
    logger.info(`Health check available at http://${env.HOST}:${env.PORT}/health`);
  });

  // Start Telegram Bot
  if (env.TELEGRAM_MODE === 'webhook') {
    if (!env.WEBHOOK_DOMAIN) {
      logger.error('WEBHOOK_DOMAIN must be specified when TELEGRAM_MODE=webhook');
      process.exit(1);
    }
    const webhookUrl = `${env.WEBHOOK_DOMAIN}${env.WEBHOOK_PATH}`;
    logger.info(`Setting Telegram webhook: ${webhookUrl}`);
    await bot.telegram.setWebhook(webhookUrl, {
      secret_token: env.WEBHOOK_SECRET_TOKEN,
    });
  } else {
    logger.info('Starting Telegram bot in Long-Polling mode...');
    try {
      const botInfo = await bot.telegram.getMe();
      logger.info(`Bot authenticated successfully as @${botInfo.username} (${botInfo.first_name})`);
      bot.launch({
        dropPendingUpdates: true,
      });
      logger.info('Telegram bot is now actively polling for updates.');
    } catch (authError) {
      logger.error('Failed to authenticate bot with Telegram API. Check TELEGRAM_BOT_TOKEN in .env', authError);
      process.exit(1);
    }
  }

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    try {
      bot.stop(signal);
      await queueService.close();
      httpServer.close(() => {
        logger.info('HTTP server closed. Exiting process.');
        process.exit(0);
      });
    } catch (err) {
      logger.error('Error during shutdown', err);
      process.exit(1);
    }
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error('Fatal initialization error', err);
  process.exit(1);
});
