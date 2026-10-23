import { Context } from 'telegraf';
import { userService } from '../../services/user.service';
import { legalSearchService } from '../../services/legal-search.service';
import { Keyboards } from '../keyboards';
import { MESSAGES_UZ_LAT } from '../messages/uz-lat';
import { MESSAGES_UZ_CYR } from '../messages/uz-cyr';
import { MESSAGES_RU } from '../messages/ru';
import { Sanitizer } from '../../security/sanitizer';

export class MenuHandler {
  public static async handleCategory(ctx: Context, categoryKey: string): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    const lang = await userService.getLanguage(from.id);
    await ctx.sendChatAction('typing');

    // Get verified legal response for this category
    const result = await legalSearchService.answerQuestion(categoryKey, lang, categoryKey);

    const chunks = Sanitizer.splitTelegramMessage(result.fullFormattedText);
    for (const chunk of chunks) {
      await ctx.replyWithMarkdown(chunk, { link_preview_options: { is_disabled: true } });
    }
  }

  public static async handleAskQuestionPrompt(ctx: Context): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    await userService.setWaitingForQuestion(from.id, true);
    const lang = await userService.getLanguage(from.id);

    let prompt = MESSAGES_UZ_LAT.ASK_QUESTION_PROMPT;
    if (lang === 'UZ_CYRILLIC') prompt = MESSAGES_UZ_CYR.ASK_QUESTION_PROMPT;
    if (lang === 'RU') prompt = MESSAGES_RU.ASK_QUESTION_PROMPT;

    await ctx.replyWithMarkdown(prompt);
  }

  public static async handleLanguageSelection(ctx: Context): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    const lang = await userService.getLanguage(from.id);
    let prompt = MESSAGES_UZ_LAT.SELECT_LANGUAGE;
    if (lang === 'UZ_CYRILLIC') prompt = MESSAGES_UZ_CYR.SELECT_LANGUAGE;
    if (lang === 'RU') prompt = MESSAGES_RU.SELECT_LANGUAGE;

    await ctx.reply(prompt, Keyboards.getLanguagePicker());
  }

  public static async handleLanguageChangeCallback(ctx: Context, newLang: 'UZ_LATIN' | 'UZ_CYRILLIC' | 'RU'): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    await userService.setLanguage(from.id, newLang);
    await ctx.answerCbQuery();

    let confirmation = MESSAGES_UZ_LAT.LANGUAGE_CHANGED;
    if (newLang === 'UZ_CYRILLIC') confirmation = MESSAGES_UZ_CYR.LANGUAGE_CHANGED;
    if (newLang === 'RU') confirmation = MESSAGES_RU.LANGUAGE_CHANGED;

    await ctx.replyWithMarkdown(confirmation, Keyboards.getMainMenu(newLang));
  }
}
