import { Markup } from 'telegraf';
import { SupportedLanguage } from '../services/legal-search.service';
import { REGIONS_OF_UZBEKISTAN } from '../config/constants';

export const KEYBOARD_LABELS = {
  UZ_LATIN: {
    ASK_QUESTION: '⚖️ Huquqiy savol berish',
    MEROS: '📜 Meros masalalari',
    AVTOMOBIL: '🚗 Avtomobil oldi-sotdisi',
    UY_JOY: '🏠 Uy-joy va ko‘chmas mulk',
    ISHONCHNOMA_HADYA: '✍️ Ishonchnoma va hadya',
    NOTARIUSNI_TOPISH: '📍 Notariusni topish',
    NOTARIAL_XIZMATLAR: 'ℹ️ Notarial xizmatlar haqida',
    TILNI_TANLASH: '🌐 Tilni tanlash',
  },
  UZ_CYRILLIC: {
    ASK_QUESTION: '⚖️ Ҳуқуқий савол бериш',
    MEROS: '📜 Мерос масалалари',
    AVTOMOBIL: '🚗 Автомобиль олди-сотдиси',
    UY_JOY: '🏠 Уй-жой ва кўчмас мулк',
    ISHONCHNOMA_HADYA: '✍️ Ишончнома ва ҳадя',
    NOTARIUSNI_TOPISH: '📍 Нотариусни топиш',
    NOTARIAL_XIZMATLAR: 'ℹ️ Нотариал хизматлар ҳақида',
    TILNI_TANLASH: '🌐 Тилни танлаш',
  },
  RU: {
    ASK_QUESTION: '⚖️ Задать правовой вопрос',
    MEROS: '📜 Вопросы наследства',
    AVTOMOBIL: '🚗 Купля-продажа авто',
    UY_JOY: '🏠 Недвижимость и жилье',
    ISHONCHNOMA_HADYA: '✍️ Доверенности и дарение',
    NOTARIUSNI_TOPISH: '📍 Найти нотариуса',
    NOTARIAL_XIZMATLAR: 'ℹ️ О нотариальных услугах',
    TILNI_TANLASH: '🌐 Выбрать язык',
  },
};

export class Keyboards {
  /**
   * Main menu keyboard according to Section 5
   */
  public static getMainMenu(lang: SupportedLanguage) {
    const labels = KEYBOARD_LABELS[lang];
    return Markup.keyboard([
      [labels.ASK_QUESTION],
      [labels.MEROS, labels.AVTOMOBIL],
      [labels.UY_JOY, labels.ISHONCHNOMA_HADYA],
      [labels.NOTARIUSNI_TOPISH, labels.NOTARIAL_XIZMATLAR],
      [labels.TILNI_TANLASH],
    ]).resize();
  }

  /**
   * Inline language selection
   */
  public static getLanguagePicker() {
    return Markup.inlineKeyboard([
      [Markup.button.callback("🇺🇿 O'zbekcha (Lotin)", 'lang:UZ_LATIN')],
      [Markup.button.callback('🇺🇿 Ўзбекча (Кирилл)', 'lang:UZ_CYRILLIC')],
      [Markup.button.callback('🇷🇺 Русский', 'lang:RU')],
    ]);
  }

  /**
   * Inline keyboard for selecting Uzbekistan regions
   */
  public static getRegionsKeyboard(lang: SupportedLanguage) {
    const rows: ReturnType<typeof Markup.button.callback>[][] = [];

    for (let i = 0; i < REGIONS_OF_UZBEKISTAN.length; i += 2) {
      const reg1 = REGIONS_OF_UZBEKISTAN[i];
      const reg2 = REGIONS_OF_UZBEKISTAN[i + 1];

      const row = [];
      if (reg1) {
        const title1 = lang === 'UZ_LATIN' ? reg1.nameUzLat : lang === 'UZ_CYRILLIC' ? reg1.nameUzCyr : reg1.nameRu;
        row.push(Markup.button.callback(title1, `reg:${reg1.id}`));
      }
      if (reg2) {
        const title2 = lang === 'UZ_LATIN' ? reg2.nameUzLat : lang === 'UZ_CYRILLIC' ? reg2.nameUzCyr : reg2.nameRu;
        row.push(Markup.button.callback(title2, `reg:${reg2.id}`));
      }
      if (row.length > 0) {
        rows.push(row);
      }
    }

    const homeText = lang === 'UZ_LATIN' ? '🏠 Bosh menyu' : lang === 'UZ_CYRILLIC' ? '🏠 Бош меню' : '🏠 Главное меню';
    rows.push([Markup.button.callback(homeText, 'main_menu')]);

    return Markup.inlineKeyboard(rows);
  }

  /**
   * Inline keyboard for selecting districts within a chosen region
   */
  public static getDistrictsKeyboard(
    regionId: number,
    districts: Array<{ id: number; nameUzLat: string }>,
    lang: SupportedLanguage
  ) {
    const rows: ReturnType<typeof Markup.button.callback>[][] = [];

    for (let i = 0; i < districts.length; i += 2) {
      const d1 = districts[i];
      const d2 = districts[i + 1];

      const row = [];
      if (d1) {
        row.push(Markup.button.callback(d1.nameUzLat, `dist:${regionId}:${d1.id}`));
      }
      if (d2) {
        row.push(Markup.button.callback(d2.nameUzLat, `dist:${regionId}:${d2.id}`));
      }
      if (row.length > 0) {
        rows.push(row);
      }
    }

    const backText =
      lang === 'UZ_LATIN'
        ? '🔙 Viloyatlar ro‘yxati'
        : lang === 'UZ_CYRILLIC'
        ? '🔙 Вилоятлар рўйхати'
        : '🔙 Список регионов';
    const homeText = lang === 'UZ_LATIN' ? '🏠 Bosh menyu' : lang === 'UZ_CYRILLIC' ? '🏠 Бош меню' : '🏠 Главное меню';

    rows.push([Markup.button.callback(backText, 'notary_regions'), Markup.button.callback(homeText, 'main_menu')]);

    return Markup.inlineKeyboard(rows);
  }

  /**
   * Inline keyboard for notary search pagination and navigation
   */
  public static getNotariesPaginationKeyboard(
    regionId: number,
    districtId: number,
    page: number,
    totalPages: number,
    lang: SupportedLanguage
  ) {
    const rows: ReturnType<typeof Markup.button.callback>[][] = [];
    const navRow: ReturnType<typeof Markup.button.callback>[] = [];

    const prevText = lang === 'UZ_LATIN' ? '⬅️ Oldingi' : lang === 'UZ_CYRILLIC' ? '⬅️ Олдинги' : '⬅️ Назад';
    const nextText = lang === 'UZ_LATIN' ? 'Keyingi ➡️' : lang === 'UZ_CYRILLIC' ? 'Кейинги ➡️' : 'Вперёд ➡️';
    const pageIndicator = `${page}/${totalPages || 1}`;

    if (page > 1) {
      navRow.push(Markup.button.callback(prevText, `dist:${regionId}:${districtId}:${page - 1}`));
    }

    navRow.push(Markup.button.callback(pageIndicator, 'noop'));

    if (page < totalPages) {
      navRow.push(Markup.button.callback(nextText, `dist:${regionId}:${districtId}:${page + 1}`));
    }

    if (navRow.length > 0) {
      rows.push(navRow);
    }

    const backDistText =
      lang === 'UZ_LATIN'
        ? '🔙 Tumanlar ro‘yxati'
        : lang === 'UZ_CYRILLIC'
        ? '🔙 Туманлар рўйхати'
        : '🔙 К списку районов';
    const homeText = lang === 'UZ_LATIN' ? '🏠 Bosh menyu' : lang === 'UZ_CYRILLIC' ? '🏠 Бош меню' : '🏠 Главное меню';

    rows.push([
      Markup.button.callback(backDistText, `notary_back_reg:${regionId}`),
      Markup.button.callback(homeText, 'main_menu'),
    ]);

    return Markup.inlineKeyboard(rows);
  }

  /**
   * Inline keyboard for fallback when notaries could not be retrieved
   */
  public static getNotariesFallbackKeyboard(
    fallbackUrl: string,
    lang: SupportedLanguage,
    regionId?: number
  ) {
    const portalBtnText =
      lang === 'UZ_LATIN'
        ? '🌐 E-Notarius portalida ko‘rish'
        : lang === 'UZ_CYRILLIC'
        ? '🌐 E-Notarius порталида кўриш'
        : '🌐 Открыть на портале E-Notarius';

    const rows: (ReturnType<typeof Markup.button.url> | ReturnType<typeof Markup.button.callback>)[][] = [
      [Markup.button.url(portalBtnText, fallbackUrl)],
    ];

    const backText =
      regionId
        ? lang === 'UZ_LATIN'
          ? '🔙 Tumanlar ro‘yxati'
          : lang === 'UZ_CYRILLIC'
          ? '🔙 Туманлар рўйхати'
          : '🔙 К списку районов'
        : lang === 'UZ_LATIN'
        ? '🔙 Viloyatlar ro‘yxati'
        : lang === 'UZ_CYRILLIC'
        ? '🔙 Вилоятлар рўйхати'
        : '🔙 Список регионов';
    const backAction = regionId ? `notary_back_reg:${regionId}` : 'notary_regions';
    const homeText = lang === 'UZ_LATIN' ? '🏠 Bosh menyu' : lang === 'UZ_CYRILLIC' ? '🏠 Бош меню' : '🏠 Главное меню';

    rows.push([Markup.button.callback(backText, backAction), Markup.button.callback(homeText, 'main_menu')]);

    return Markup.inlineKeyboard(rows);
  }

  /**
   * Inline keyboard for specific notary with E-Notarius external link
   */
  public static getNotaryActionKeyboard(officialUrl: string, lang: SupportedLanguage) {
    const text =
      lang === 'UZ_LATIN'
        ? '🌐 E-Notarius orqali yozilish'
        : lang === 'UZ_CYRILLIC'
        ? '🌐 E-Notarius орқали ёзилиш'
        : '🌐 Запись через E-Notarius';

    return Markup.inlineKeyboard([[Markup.button.url(text, officialUrl)]]);
  }
}
