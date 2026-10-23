import { Context } from 'telegraf';
import { userService } from '../../services/user.service';
import { Keyboards } from '../keyboards';
import { MESSAGES_UZ_LAT } from '../messages/uz-lat';
import { MESSAGES_UZ_CYR } from '../messages/uz-cyr';
import { MESSAGES_RU } from '../messages/ru';
import { SupportedLanguage } from '../../services/legal-search.service';

function getMessages(lang: SupportedLanguage) {
  if (lang === 'UZ_CYRILLIC') return MESSAGES_UZ_CYR;
  if (lang === 'RU') return MESSAGES_RU;
  return MESSAGES_UZ_LAT;
}

export class CommandHandler {
  public static async handleStart(ctx: Context): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    const user = await userService.getOrCreateUser(from.id, {
      username: from.username,
      firstName: from.first_name,
    });

    const msgs = getMessages(user.language);
    const greetingName = from.first_name || 'Foydalanuvchi';

    await ctx.replyWithMarkdown(msgs.WELCOME(greetingName), Keyboards.getMainMenu(user.language));
  }

  public static async handleHelp(ctx: Context): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    const lang = await userService.getLanguage(from.id);
    const msgs = getMessages(lang);

    await ctx.replyWithMarkdown(msgs.HELP, Keyboards.getMainMenu(lang));
  }

  public static async handleAbout(ctx: Context): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    const lang = await userService.getLanguage(from.id);
    const msgs = getMessages(lang);

    await ctx.replyWithMarkdown(msgs.ABOUT, Keyboards.getMainMenu(lang));
  }

  public static async handleLanguage(ctx: Context): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    const lang = await userService.getLanguage(from.id);
    const msgs = getMessages(lang);

    await ctx.reply(msgs.SELECT_LANGUAGE, Keyboards.getLanguagePicker());
  }
}
