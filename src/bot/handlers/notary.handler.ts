import { Context } from 'telegraf';
import { userService } from '../../services/user.service';
import { notaryDirectoryService } from '../../services/notary-directory.service';
import { Keyboards } from '../keyboards';
import { MESSAGES_UZ_LAT } from '../messages/uz-lat';
import { MESSAGES_UZ_CYR } from '../messages/uz-cyr';
import { MESSAGES_RU } from '../messages/ru';
import { eNotariusProvider } from '../../providers/e-notarius.provider';

export class NotaryHandler {
  /**
   * Step 1 & 2: User requests notary search -> show list of 14 regions
   */
  public static async handleNotarySearchMenu(ctx: Context): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery().catch(() => {});
    }

    const lang = await userService.getLanguage(from.id);
    let prompt = MESSAGES_UZ_LAT.SELECT_REGION;
    if (lang === 'UZ_CYRILLIC') prompt = MESSAGES_UZ_CYR.SELECT_REGION;
    if (lang === 'RU') prompt = MESSAGES_RU.SELECT_REGION;

    const keyboard = Keyboards.getRegionsKeyboard(lang);

    if (ctx.callbackQuery) {
      try {
        await ctx.editMessageText(prompt, keyboard);
        return;
      } catch {
        // Fall back to new reply if edit fails
      }
    }

    await ctx.reply(prompt, keyboard);
  }

  /**
   * Step 3: Region is chosen -> show list of districts belonging strictly to this region
   */
  public static async handleRegionSelect(ctx: Context, regionIdentifier: string): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    if (ctx.callbackQuery || typeof ctx.answerCbQuery === 'function') {
      await ctx.answerCbQuery?.().catch(() => {});
    }
    await ctx.sendChatAction('typing').catch(() => {});

    const lang = await userService.getLanguage(from.id);
    const region = notaryDirectoryService.getRegionById(regionIdentifier);

    if (!region) {
      const errorMsg =
        lang === 'UZ_LATIN'
          ? '⚠️ Tanlangan hudud topilmadi. Iltimos, ro‘yxatdan qayta tanlang.'
          : lang === 'UZ_CYRILLIC'
          ? '⚠️ Танланган ҳудуд топилмади. Илтимос, рўйхатдан қайта танланг.'
          : '⚠️ Выбранный регион не найден. Пожалуйста, выберите снова из списка.';
      await ctx.reply(errorMsg, Keyboards.getRegionsKeyboard(lang));
      return;
    }

    const districts = await notaryDirectoryService.getDistrictsByRegion(region.id);

    const regionName =
      lang === 'UZ_LATIN' ? region.nameUzLat : lang === 'UZ_CYRILLIC' ? region.nameUzCyr : region.nameRu;

    const prompt =
      lang === 'UZ_LATIN'
        ? `📍 *${regionName}*\nKerakli tuman yoki shaharni tanlang:`
        : lang === 'UZ_CYRILLIC'
        ? `📍 *${regionName}*\nКеракли туман ёки шаҳарни танланг:`
        : `📍 *${regionName}*\nВыберите район или город:`;

    const keyboard = Keyboards.getDistrictsKeyboard(region.id, districts, lang);

    if (ctx.callbackQuery) {
      try {
        await ctx.editMessageText(prompt, { parse_mode: 'Markdown', ...keyboard });
        return;
      } catch {
        // Fall back to reply
      }
    }

    await ctx.replyWithMarkdown(prompt, keyboard);
  }

  /**
   * Step 4, 5, 6: District is chosen -> query official E-Notarius and display notaries with pagination
   */
  public static async handleDistrictSelect(
    ctx: Context,
    regionIdStr: string,
    districtIdStr: string,
    pageStr = '1'
  ): Promise<void> {
    const from = ctx.from;
    if (!from) return;

    if (ctx.callbackQuery || typeof ctx.answerCbQuery === 'function') {
      await ctx.answerCbQuery?.().catch(() => {});
    }
    await ctx.sendChatAction('typing').catch(() => {});

    const lang = await userService.getLanguage(from.id);
    const regionId = parseInt(regionIdStr, 10);
    const districtId = parseInt(districtIdStr, 10);
    const page = Math.max(1, parseInt(pageStr, 10) || 1);

    const result = await notaryDirectoryService.searchNotariesByDistrict(regionId, districtId, page, 3);
    const fallbackUrl = eNotariusProvider.getSearchFallbackUrl(regionId, districtId);

    // Case A: Technical error or external system unavailable
    if (result.isDegraded && result.notaries.length === 0) {
      const networkErrorMsg =
        lang === 'UZ_LATIN'
          ? `⚠️ *E-Notarius axborot tizimiga ulanishda vaqtincha uzilish yuz berdi.*\n\n` +
            `_${result.regionName}, ${result.districtName}_ bo‘yicha amaldagi notariuslar ro‘yxatini to‘g‘ridan-to‘g‘ri rasmiy portal orqali ko‘rishingiz mumkin.`
          : lang === 'UZ_CYRILLIC'
          ? `⚠️ *E-Notarius ахборот тизимига уланишда вақтинча узилиш юз берди.*\n\n` +
            `_${result.regionName}, ${result.districtName}_ бўйича амалдаги нотариуслар рўйхатини тўғридан-тўғри расмий портал орқали кўришингиз мумкин.`
          : `⚠️ *Временно отсутствует связь с системой E-Notarius.*\n\n` +
            `Вы можете просмотреть актуальный список нотариусов по _${result.regionName}, ${result.districtName}_ непосредственно на официальном портале.`;

      const keyboard = Keyboards.getNotariesFallbackKeyboard(fallbackUrl, lang, regionId);

      if (ctx.callbackQuery) {
        try {
          await ctx.editMessageText(networkErrorMsg, { parse_mode: 'Markdown', ...keyboard });
          return;
        } catch {
          // fallback
        }
      }
      await ctx.replyWithMarkdown(networkErrorMsg, keyboard);
      return;
    }

    // Case B: No notaries found in the official registry for this specific district
    if (result.notaries.length === 0) {
      const emptyMsg =
        lang === 'UZ_LATIN'
          ? `ℹ️ *${result.regionName}, ${result.districtName}* bo‘yicha ro‘yxatda hozirda faol notariuslar qayd etilmagan.\n\n` +
            `To‘liq rasmiy reestr orqali qidirishingiz mumkin:`
          : lang === 'UZ_CYRILLIC'
          ? `ℹ️ *${result.regionName}, ${result.districtName}* бўйича рўйхатда ҳозирда фаол нотариуслар қайд этилмаган.\n\n` +
            `Тўлиқ расмий реестр орқали қидиришингиз мумкин:`
          : `ℹ️ По району *${result.regionName}, ${result.districtName}* в реестре в настоящее время активных нотариусов не найдено.\n\n` +
            `Вы можете воспользоваться единым официальным реестром:`;

      const keyboard = Keyboards.getNotariesFallbackKeyboard(fallbackUrl, lang, regionId);

      if (ctx.callbackQuery) {
        try {
          await ctx.editMessageText(emptyMsg, { parse_mode: 'Markdown', ...keyboard });
          return;
        } catch {
          // fallback
        }
      }
      await ctx.replyWithMarkdown(emptyMsg, keyboard);
      return;
    }

    // Case C: Notaries successfully found -> display formatted page with pagination
    const text = notaryDirectoryService.formatNotariesPage(result, lang);
    const keyboard = Keyboards.getNotariesPaginationKeyboard(
      regionId,
      districtId,
      page,
      result.totalPages,
      lang
    );

    if (ctx.callbackQuery) {
      try {
        await ctx.editMessageText(text, {
          parse_mode: 'Markdown',
          link_preview_options: { is_disabled: true },
          ...keyboard,
        });
        return;
      } catch {
        // Fall back to normal reply if message cannot be edited (e.g. text identical)
      }
    }

    await ctx.replyWithMarkdown(text, {
      link_preview_options: { is_disabled: true },
      ...keyboard,
    });
  }
}
