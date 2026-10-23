import { Context } from 'telegraf';
import { userService } from '../../services/user.service';
import { legalSearchService } from '../../services/legal-search.service';
import { Sanitizer } from '../../security/sanitizer';
import { queueService } from '../../services/queue.service';
import { Logger } from '../../core/logger/logger';

const logger = new Logger('QuestionHandler');

export class QuestionHandler {
  public static async handleIncomingText(ctx: Context, text: string): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    const lang = await userService.getLanguage(from.id);
    const { clean, isSuspicious } = Sanitizer.sanitizeQuery(text);

    if (isSuspicious) {
      logger.warn(`Suspicious input pattern neutralized for user ${from.id}`);
    }

    if (clean.length < 3) {
      const tooShortMsg =
        lang === 'UZ_LATIN'
          ? 'Iltimos, savolingizni to‘liqroq yozing.'
          : lang === 'UZ_CYRILLIC'
          ? 'Илтимос, саволингизни тўлиқроқ ёзинг.'
          : 'Пожалуйста, сформулируйте вопрос более подробно.';
      await ctx.reply(tooShortMsg);
      return;
    }

    // Check for operator dispatching / ticketing attempts (strictly prohibited by Section 1)
    const lower = clean.toLowerCase();
    const isTicketAttempt =
      lower.includes('operator') ||
      lower.includes('ijrochi') ||
      lower.includes('murojaatimni yubor') ||
      lower.includes('shikoyat yubor') ||
      lower.includes('оператор') ||
      lower.includes('мурожаатни юбор') ||
      lower.includes('соедините с оператором') ||
      lower.includes('жалобу отправить');

    if (isTicketAttempt) {
      const ticketNotice =
        lang === 'UZ_LATIN'
          ? `ℹ️ *Muhim eslatma:*\n\n` +
            `Mazkur Telegram bot rasmiy qonunchilik va notarial xizmatlar bo‘yicha avtomatlashtirilgan axborot-maslahat tizimi hisoblanadi.\n\n` +
            `Bot orqali murojaatlarni Notarial palata xodimlariga yoki operatorlarga yuborish, ijro nazoratiga olish funksiyasi mavjud emas.\n\n` +
            `Notarial palataga to‘g‘ridan-to‘g‘ri murojaat qilish uchun:\n` +
            `📞 *Ishonch telefoni:* (71) 203-05-55\n` +
            `🌐 *Rasmiy sayt:* [notarialpalata.uz](https://notarialpalata.uz/)`
          : lang === 'UZ_CYRILLIC'
          ? `ℹ️ *Муҳим эслатма:*\n\n` +
            `Мазкур Telegram бот расмий қонунчилик бўйича автоматлаштирилган ахборот-маслаҳат тизимидир.\n\n` +
            `Мурожаатларни палата ходимлари ёки операторларга юбориш функцияси мавжуд эмас.\n\n` +
            `📞 *Ишонч телефони:* (71) 203-05-55\n` +
            `🌐 *Расмий сайт:* [notarialpalata.uz](https://notarialpalata.uz/)`
          : `ℹ️ *Важное примечание:*\n\n` +
            `Данный бот является автоматизированной информационно-справочной системой по законодательству.\n\n` +
            `Функция передачи обращений операторам или сотрудникам Палаты в системе не предусмотрена.\n\n` +
            `📞 *Телефон доверия:* (71) 203-05-55\n` +
            `🌐 *Официальный сайт:* [notarialpalata.uz](https://notarialpalata.uz/)`;

      await ctx.replyWithMarkdown(ticketNotice, { link_preview_options: { is_disabled: true } });
      return;
    }

    await ctx.sendChatAction('typing');

    // Perform grounded legal search
    const response = await legalSearchService.answerQuestion(clean, lang);

    // Split long response to avoid Telegram 4096 character limit
    const chunks = Sanitizer.splitTelegramMessage(response.fullFormattedText);
    for (const chunk of chunks) {
      await ctx.replyWithMarkdown(chunk, { link_preview_options: { is_disabled: true } });
    }

    // Reset waiting state
    await userService.setWaitingForQuestion(from.id, false);

    // Queue background audit job (asynchronously)
    await queueService.addTask({
      jobType: 'LOG_SEARCH',
      payload: {
        userId: from.id,
        queryLength: clean.length,
        language: lang,
        hasVerifiedNorm: response.hasVerifiedNorm,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
