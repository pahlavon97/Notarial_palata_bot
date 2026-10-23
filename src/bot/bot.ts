import { Telegraf, Context } from 'telegraf';
import { env } from '../config/env';
import { Logger } from '../core/logger/logger';
import { updateDeduplicator } from '../security/update-deduplicator';
import { rateLimiter } from '../security/rate-limiter';
import { userService } from '../services/user.service';
import { CommandHandler } from './handlers/command.handler';
import { MenuHandler } from './handlers/menu.handler';
import { NotaryHandler } from './handlers/notary.handler';
import { QuestionHandler } from './handlers/question.handler';
import { KEYBOARD_LABELS } from './keyboards';
import { MESSAGES_UZ_LAT } from './messages/uz-lat';
import { MESSAGES_UZ_CYR } from './messages/uz-cyr';
import { MESSAGES_RU } from './messages/ru';

const logger = new Logger('TelegramBot');

export function createBot(): Telegraf<Context> {
  const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

  // 1. Idempotency & deduplication middleware
  bot.use(async (ctx, next) => {
    const updateId = ctx.update.update_id;
    if (updateId) {
      const isUnique = await updateDeduplicator.isUnique(updateId);
      if (!isUnique) {
        logger.warn(`Duplicate update ignored: ${updateId}`);
        return;
      }
    }
    return next();
  });

  // 2. Security: Rate limiting & spam burst protection middleware
  bot.use(async (ctx, next) => {
    const from = ctx.from;
    if (!from) return next();

    // Burst check
    const burst = await rateLimiter.checkBurst(from.id);
    if (!burst.allowed) {
      logger.warn(`User ${from.id} exceeded burst limit`);
      const lang = await userService.getLanguage(from.id);
      let burstMsg = MESSAGES_UZ_LAT.BURST_WARNING;
      if (lang === 'UZ_CYRILLIC') burstMsg = MESSAGES_UZ_CYR.BURST_WARNING;
      if (lang === 'RU') burstMsg = MESSAGES_RU.BURST_WARNING;
      await ctx.reply(burstMsg);
      return;
    }

    // Window limit check
    const limit = await rateLimiter.checkLimit(`user:${from.id}`);
    if (!limit.allowed) {
      logger.warn(`User ${from.id} rate limited: ${limit.reason}`);
      const lang = await userService.getLanguage(from.id);
      let rlMsg = MESSAGES_UZ_LAT.RATE_LIMIT_WARNING(limit.resetSeconds);
      if (lang === 'UZ_CYRILLIC') rlMsg = MESSAGES_UZ_CYR.RATE_LIMIT_WARNING(limit.resetSeconds);
      if (lang === 'RU') rlMsg = MESSAGES_RU.RATE_LIMIT_WARNING(limit.resetSeconds);
      await ctx.replyWithMarkdown(rlMsg);
      return;
    }

    return next();
  });

  // 3. Command Handlers
  bot.command('start', CommandHandler.handleStart);
  bot.command('help', CommandHandler.handleHelp);
  bot.command('about', CommandHandler.handleAbout);
  bot.command('lang', CommandHandler.handleLanguage);

  // 4. Main Menu Button Text Handlers (Multi-lingual)
  // Ask Question
  bot.hears(
    [
      KEYBOARD_LABELS.UZ_LATIN.ASK_QUESTION,
      KEYBOARD_LABELS.UZ_CYRILLIC.ASK_QUESTION,
      KEYBOARD_LABELS.RU.ASK_QUESTION,
    ],
    MenuHandler.handleAskQuestionPrompt
  );

  // Meros
  bot.hears(
    [
      KEYBOARD_LABELS.UZ_LATIN.MEROS,
      KEYBOARD_LABELS.UZ_CYRILLIC.MEROS,
      KEYBOARD_LABELS.RU.MEROS,
    ],
    (ctx) => MenuHandler.handleCategory(ctx, 'MEROS')
  );

  // Avtomobil
  bot.hears(
    [
      KEYBOARD_LABELS.UZ_LATIN.AVTOMOBIL,
      KEYBOARD_LABELS.UZ_CYRILLIC.AVTOMOBIL,
      KEYBOARD_LABELS.RU.AVTOMOBIL,
    ],
    (ctx) => MenuHandler.handleCategory(ctx, 'AVTOMOBIL')
  );

  // Uy-joy
  bot.hears(
    [
      KEYBOARD_LABELS.UZ_LATIN.UY_JOY,
      KEYBOARD_LABELS.UZ_CYRILLIC.UY_JOY,
      KEYBOARD_LABELS.RU.UY_JOY,
    ],
    (ctx) => MenuHandler.handleCategory(ctx, 'UY_JOY')
  );

  // Ishonchnoma va Hadya
  bot.hears(
    [
      KEYBOARD_LABELS.UZ_LATIN.ISHONCHNOMA_HADYA,
      KEYBOARD_LABELS.UZ_CYRILLIC.ISHONCHNOMA_HADYA,
      KEYBOARD_LABELS.RU.ISHONCHNOMA_HADYA,
    ],
    (ctx) => MenuHandler.handleCategory(ctx, 'ISHONCHNOMA')
  );

  // Notariusni topish
  bot.hears(
    [
      KEYBOARD_LABELS.UZ_LATIN.NOTARIUSNI_TOPISH,
      KEYBOARD_LABELS.UZ_CYRILLIC.NOTARIUSNI_TOPISH,
      KEYBOARD_LABELS.RU.NOTARIUSNI_TOPISH,
    ],
    NotaryHandler.handleNotarySearchMenu
  );

  // Notarial xizmatlar haqida
  bot.hears(
    [
      KEYBOARD_LABELS.UZ_LATIN.NOTARIAL_XIZMATLAR,
      KEYBOARD_LABELS.UZ_CYRILLIC.NOTARIAL_XIZMATLAR,
      KEYBOARD_LABELS.RU.NOTARIAL_XIZMATLAR,
    ],
    CommandHandler.handleAbout
  );

  // Tilni tanlash
  bot.hears(
    [
      KEYBOARD_LABELS.UZ_LATIN.TILNI_TANLASH,
      KEYBOARD_LABELS.UZ_CYRILLIC.TILNI_TANLASH,
      KEYBOARD_LABELS.RU.TILNI_TANLASH,
    ],
    MenuHandler.handleLanguageSelection
  );

  // 5. Callback Query Actions
  bot.action(/^lang:(UZ_LATIN|UZ_CYRILLIC|RU)$/, async (ctx) => {
    const match = ctx.match;
    if (match && match[1]) {
      await MenuHandler.handleLanguageChangeCallback(ctx, match[1] as any);
    }
  });

  bot.action(/^reg:(.+)$/, async (ctx) => {
    const match = ctx.match;
    if (match && match[1]) {
      await NotaryHandler.handleRegionSelect(ctx, match[1]);
    }
  });

  bot.action(/^dist:(\d+):(\d+)(?::(\d+))?$/, async (ctx) => {
    const match = ctx.match;
    if (match && match[1] && match[2]) {
      await NotaryHandler.handleDistrictSelect(ctx, match[1], match[2], match[3] || '1');
    }
  });

  bot.action(/^notary_regions$/, async (ctx) => {
    await NotaryHandler.handleNotarySearchMenu(ctx);
  });

  bot.action(/^notary_back_reg:(\d+)$/, async (ctx) => {
    const match = ctx.match;
    if (match && match[1]) {
      await NotaryHandler.handleRegionSelect(ctx, match[1]);
    }
  });

  bot.action('main_menu', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    await CommandHandler.handleStart(ctx);
  });

  bot.action('noop', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
  });

  // 6. Incoming Text Handler (Free question answering)
  bot.on('text', async (ctx) => {
    const message = ctx.message;
    if ('text' in message) {
      await QuestionHandler.handleIncomingText(ctx, message.text);
    }
  });

  // 7. Global Error Handler
  bot.catch((err, ctx) => {
    logger.error('Unhandled bot error occurred', err, {
      updateType: ctx.updateType,
      userId: ctx.from?.id,
    });
  });

  return bot;
}
