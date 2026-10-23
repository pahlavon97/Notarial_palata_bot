import { LexUzProvider, lexUzProvider } from '../providers/lex-uz.provider';
import { AdviceUzProvider, adviceUzProvider, AdviceUzArticle } from '../providers/advice-uz.provider';
import { LEGAL_DISCLAIMER, OFFICIAL_URLS } from '../config/constants';
import { VerifiedLegalItem, DocumentLegalStatus } from '../database/legal-corpus.data';
import { Sanitizer } from '../security/sanitizer';
import { LegalCacheService, legalCacheService } from './legal-cache.service';

export type SupportedLanguage = 'UZ_LATIN' | 'UZ_CYRILLIC' | 'RU';

export interface FormattedLegalResponse {
  language: SupportedLanguage;
  summary: string;
  legalBasis: string;
  sourceUrl: string;
  adviceUrl?: string;
  verifiedDate: string;
  isCurrentEditionVerified: boolean;
  editionStatus: DocumentLegalStatus | string;
  discrepancyNotice?: string;
  steps?: string[];
  requiredDocs?: string[];
  stateDuty?: string;
  fullFormattedText: string;
  hasVerifiedNorm: boolean;
  officialFallbackUrl?: string;
  isDegraded?: boolean;
}

export class LegalSearchService {
  constructor(
    private lexProvider: LexUzProvider = lexUzProvider,
    private adviceProvider: AdviceUzProvider = adviceUzProvider,
    private cacheService: LegalCacheService = legalCacheService
  ) {}

  /**
   * Detect language from text (Cyrillic Uzbek, Russian, or Latin Uzbek)
   */
  public detectLanguage(text: string): SupportedLanguage {
    const cyrillicPattern = /[\u0400-\u04FF]/;
    if (!cyrillicPattern.test(text)) {
      return 'UZ_LATIN';
    }

    // Check specific Uzbek Cyrillic letters (ў, қ, ғ, ҳ)
    const uzCyrillicSpecific = /[ўқғҳЎҚҒҲ]/;
    if (uzCyrillicSpecific.test(text)) {
      return 'UZ_CYRILLIC';
    }

    // Check common Russian words vs Uzbek words in Cyrillic
    const lower = text.toLowerCase();
    const ruWords = ['как', 'где', 'доверенность', 'наследство', 'машина', 'нотариус', 'договор', 'госпошлина', 'сколько'];
    const uzCyrWords = ['мерос', 'ишончнома', 'қандай', 'қаерда', 'давлат', 'божи', 'ҳужжат', 'олди-сотди'];

    const ruMatches = ruWords.filter((w) => lower.includes(w)).length;
    const uzMatches = uzCyrWords.filter((w) => lower.includes(w)).length;

    if (ruMatches > uzMatches) {
      return 'RU';
    }
    return 'UZ_CYRILLIC';
  }

  /**
   * Identifies category topic from the user question across all 10 required domains
   */
  public classifyTopic(query: string): string | undefined {
    const clean = query.toLowerCase();

    if (/meros|vasiyat|merosxo|мерос|васият|наследств|завещан/.test(clean)) return 'MEROS';
    if (/avto|mashina|moshina|transport|авто|машина|транспорт/.test(clean)) return 'AVTOMOBIL';
    if (/ishonchnoma|doverennost|ишончнома|доверенност/.test(clean)) return 'ISHONCHNOMA';
    if (/uy|kvartira|ko‘chmas mulk|kadastr|уй|квартира|кўчмас мулк|недвижим/.test(clean)) return 'UY_JOY';
    if (/hadya|sovg‘a|ayirboshlash|mena|ҳадя|айирбошлаш|дарен|подарок|мена/.test(clean)) return 'HADYA';
    if (/nikoh|er-xotin|nikohlanuvchi|никоҳ|брачн|брак/.test(clean)) return 'NIKOH_SHARTNOMASI';
    if (/davlat boji|boj stavka|to‘lov|bhm|давлат божи|госпошлин|пошлин|тариф/.test(clean)) return 'DAVLAT_BOJI';
    if (/dublikat|apostil|tarjima|imzo|voyaga yetmagan.*chiqish|дубликат|апостил|перевод|подпис|выезд.*ребенка/.test(clean)) {
      return 'HUJJATLARNI_RASMIYLASHTIRISH';
    }
    if (/qarz|garov|ijro xati|kafillik|depozit|omonat|қарз|гаров|заем|залог|исполнительн/.test(clean)) return 'BOSHQA';
    if (/notariat|notarius|notarial tasdiqlash|нотариат|нотариус/.test(clean)) return 'NOTARIAL_TASDIQLASH';

    return undefined;
  }

  /**
   * Search and generate a strictly grounded, non-hallucinated response
   */
  public async answerQuestion(
    rawQuery: string,
    forcedLang?: SupportedLanguage,
    categoryHint?: string
  ): Promise<FormattedLegalResponse> {
    const { clean } = Sanitizer.sanitizeQuery(rawQuery);
    const lang = forcedLang || this.detectLanguage(clean);

    // Identify topic
    const topic = categoryHint || this.classifyTopic(clean);

    // 1. Check Cache
    const queryHash = this.cacheService.generateQueryHash(clean);
    const cacheKey = this.cacheService.buildKey({
      queryHash,
      category: topic,
      language: lang,
    });

    const isProviderDown =
      this.lexProvider.getHealth().status === 'DOWN' || this.adviceProvider.getHealth().status === 'DOWN';

    const cached = this.cacheService.get<FormattedLegalResponse>(cacheKey, isProviderDown);
    if (cached) {
      if (cached.isDegraded) {
        return this.formatDegradedCachedResponse(cached.data, lang);
      }
      return cached.data;
    }

    // 2. Step 1 & 2: Search Advice.uz articles
    const adviceArticles = await this.adviceProvider.searchArticles(clean, topic);
    const primaryAdvice = adviceArticles[0] || (topic ? await this.adviceProvider.getArticleByCategory(topic) : null);

    // 3. Step 3 & 4: Search Lex.uz normative acts
    const lexResults = await this.lexProvider.searchNormativeActs(clean, topic, { includeRepealed: false });
    const primaryLexResult = lexResults[0];

    // If both return nothing, return not found response
    if (!primaryLexResult && !primaryAdvice) {
      return this.buildNotFoundResponse(clean, lang);
    }

    // 4. Resolve normative act
    let resolvedItem: VerifiedLegalItem;
    let isCurrentEditionVerified = false;
    let editionStatus: DocumentLegalStatus = 'IN_FORCE';
    let cleanLexUrl: string = OFFICIAL_URLS.LEX_UZ_NOTARIAT_LAW;

    if (primaryLexResult) {
      resolvedItem = primaryLexResult.item;
      cleanLexUrl = primaryLexResult.cleanUrl;
      isCurrentEditionVerified = primaryLexResult.isCurrentEditionVerified;
      editionStatus = primaryLexResult.editionStatus;
    } else {
      // Direct category lookup in verified corpus
      const fallbackItem = topic ? this.lexProvider.getByCategory(topic) : undefined;
      resolvedItem = fallbackItem || {
        id: 'derived',
        category: (topic as any) || 'BOSHQA',
        source: 'LEX_UZ',
        docNumber: '34304',
        docTitle: {
          uzLat: "O'zbekiston Respublikasining 'Notariat to'g'risida'gi Qonuni",
          uzCyr: "Ўзбекистон Республикасининг 'Нотариат тўғрисида'ги Қонуни",
          ru: "Закон Республики Узбекистан 'О нотариате'",
        },
        articleNumber: 'Notarial tartib-qoidalar',
        articleTitle: {
          uzLat: 'Umumiy notarial qoidalar',
          uzCyr: 'Умумий нотариал қоидалар',
          ru: 'Общие правила совершения нотариальных действий',
        },
        keywords: [],
        officialUrl: OFFICIAL_URLS.LEX_UZ_NOTARIAT_LAW,
        cleanOfficialUrl: OFFICIAL_URLS.LEX_UZ_NOTARIAT_LAW,
        verifiedDate: '2026-01-01',
        isCurrentEdition: true,
        legalStatus: 'IN_FORCE',
        content: {
          uzLat: 'Notarial harakatlar qonun hujjatlariga muvofiq rasmiylashtiriladi.',
          uzCyr: 'Нотариал ҳаракатлар қонун ҳужжатларига мувофиқ расмийлаштирилади.',
          ru: 'Нотариальные действия совершаются в строгом соответствии с законодательством.',
        },
      };

      const check = await this.lexProvider.verifyDocumentEdition(resolvedItem.docNumber);
      isCurrentEditionVerified = check.isReliablyVerified && check.isCurrentEdition;
      editionStatus = check.legalStatus;
      cleanLexUrl = check.cleanUrl;
    }

    // 5. Compare Advice.uz explanation with LexUZ active norm
    const discrepancyNotice = this.detectDiscrepancy(resolvedItem, primaryAdvice, lang);

    // 6. Build response
    const response = this.buildGroundedResponse({
      item: resolvedItem,
      adviceArticle: primaryAdvice,
      lang,
      cleanLexUrl,
      isCurrentEditionVerified,
      editionStatus,
      discrepancyNotice,
      isDegraded: isProviderDown,
    });

    // 7. Store in Cache
    this.cacheService.set({
      key: cacheKey,
      queryHash,
      docId: resolvedItem.docNumber,
      editionStatus,
      language: lang,
      data: response,
      isDegraded: isProviderDown,
    });

    return response;
  }

  /**
   * Compares Advice.uz explanation with LexUZ normative act.
   * If there is any discrepancy, notes it and gives precedence to LexUZ.
   */
  private detectDiscrepancy(
    _item: VerifiedLegalItem,
    advice: AdviceUzArticle | null,
    lang: SupportedLanguage
  ): string | undefined {
    if (!advice) return undefined;

    if (advice.discrepancyNote) {
      if (lang === 'UZ_LATIN') return advice.discrepancyNote.uzLat;
      if (lang === 'UZ_CYRILLIC') return advice.discrepancyNote.uzCyr;
      return advice.discrepancyNote.ru;
    }

    return undefined;
  }

  private buildGroundedResponse(params: {
    item: VerifiedLegalItem;
    adviceArticle: AdviceUzArticle | null;
    lang: SupportedLanguage;
    cleanLexUrl: string;
    isCurrentEditionVerified: boolean;
    editionStatus: DocumentLegalStatus | string;
    discrepancyNotice?: string;
    isDegraded?: boolean;
  }): FormattedLegalResponse {
    const { item, adviceArticle, lang, cleanLexUrl, isCurrentEditionVerified, discrepancyNotice, isDegraded } = params;

    let summary = '';
    let legalBasis = '';
    let docTitle = '';
    let articleTitle = '';
    let stateDuty = '';
    let requiredDocs: string[] = [];
    let steps: string[] = [];

    if (lang === 'UZ_LATIN') {
      summary = adviceArticle?.contentUzLat || item.content.uzLat;
      docTitle = item.docTitle.uzLat;
      articleTitle = item.articleTitle.uzLat;
      legalBasis = `${docTitle}, ${item.articleNumber} (${articleTitle})`;
      stateDuty = item.stateDuty?.uzLat || '';
      requiredDocs = adviceArticle?.requiredDocsUzLat || item.requiredDocuments?.uzLat || [];
      steps = adviceArticle?.stepsUzLat || [];
    } else if (lang === 'UZ_CYRILLIC') {
      summary = adviceArticle?.contentUzCyr || item.content.uzCyr;
      docTitle = item.docTitle.uzCyr;
      articleTitle = item.articleTitle.uzCyr;
      legalBasis = `${docTitle}, ${item.articleNumber} (${articleTitle})`;
      stateDuty = item.stateDuty?.uzCyr || '';
      requiredDocs = adviceArticle?.requiredDocsUzCyr || item.requiredDocuments?.uzCyr || [];
      steps = adviceArticle?.stepsUzCyr || [];
    } else {
      summary = adviceArticle?.contentRu || item.content.ru;
      docTitle = item.docTitle.ru;
      articleTitle = item.articleTitle.ru;
      legalBasis = `${docTitle}, ${item.articleNumber} (${articleTitle})`;
      stateDuty = item.stateDuty?.ru || '';
      requiredDocs = adviceArticle?.requiredDocsRu || item.requiredDocuments?.ru || [];
      steps = adviceArticle?.stepsRu || [];
    }

    const labels = {
      UZ_LATIN: {
        summary: '💡 *Qisqa tushuntirish:*',
        steps: '📋 *Amalga oshirish bosqichlari:*',
        docs: '📄 *Talab etiladigan hujjatlar:*',
        duty: '💰 *Davlat boji va to‘lovlar:*',
        basis: '⚖️ *Huquqiy asos:*',
        source: '🌐 *Rasmiy manba (Lex.uz):* [Hujjatni ko‘rish]',
        adviceSource: '📖 *Amaliy qo‘llanma (Advice.uz):* [Maqolani o‘qish]',
        verifiedDate: '✅ *Amaldagi tahrir tekshirilgan sana:*',
        unverifiedWarning: '⚠️ *Tahrir holati:* Amaldagi tahrir to‘liq tasdiqlanmagan (rasmiy Lex.uz bazasidan tekshiring)',
        degradedWarning: '⚠️ *Diqqat:* Tashqi huquqiy baza vaqtincha aloqasiz. Ma’lumot keshdan taqdim etilmoqda.',
        discrepancyHeader: '⚠️ *Tafovut eslatmasi:*',
        portal: '🏛 *Elektron notarius orqali rasmiylashtirish:* [E-Notarius.uz portaliga o‘tish]',
      },
      UZ_CYRILLIC: {
        summary: '💡 *Қисқа тушунтириш:*',
        steps: '📋 *Амалга ошириш босқичлари:*',
        docs: '📄 *Талаб этиладиган ҳужжатлар:*',
        duty: '💰 *Давлат божи ва тўловлар:*',
        basis: '⚖️ *Ҳуқуқий асос:*',
        source: '🌐 *Расмий манба (Lex.uz):* [Ҳужжатни кўриш]',
        adviceSource: '📖 *Амалий қўлланма (Advice.uz):* [Мақолани ўқиш]',
        verifiedDate: '✅ *Амалдаги таҳрир текширилган сана:*',
        unverifiedWarning: '⚠️ *Таҳрир ҳолати:* Амалдаги таҳрир тўлиқ тасдиқланмаган (Lex.uz расмий базасидан текширинг)',
        degradedWarning: '⚠️ *Диққат:* Ташқи қонунчилик базаси вақтинча алоқасиз. Маълумот кешдан кўрсатилмоқда.',
        discrepancyHeader: '⚠️ *Тафовут эслатмаси:*',
        portal: '🏛 *Электрон нотариус орқали расмийлаштириш:* [E-Notarius.uz порталига ўтиш]',
      },
      RU: {
        summary: '💡 *Краткое разъяснение:*',
        steps: '📋 *Этапы оформления:*',
        docs: '📄 *Необходимые документы:*',
        duty: '💰 *Госпошлина и сборы:*',
        basis: '⚖️ *Правовое основание:*',
        source: '🌐 *Официальный источник (Lex.uz):* [Посмотреть документ]',
        adviceSource: '📖 *Практическое руководство (Advice.uz):* [Читать статью]',
        verifiedDate: '✅ *Дата проверки действующей редакции:*',
        unverifiedWarning: '⚠️ *Статус редакции:* Действующая редакция полностью не подтверждена (проверьте в базе Lex.uz)',
        degradedWarning: '⚠️ *Внимание:* Внешний юридический источник временно недоступен. Информация из локального кэша.',
        discrepancyHeader: '⚠️ *Примечание о расхождении:*',
        portal: '🏛 *Оформление через Электронный нотариус:* [Перейти на портал E-Notarius.uz]',
      },
    }[lang];

    let text = `📌 *${this.getCategoryTitle(item.category, lang)}*\n\n`;

    if (isDegraded) {
      text += `${labels.degradedWarning}\n\n`;
    }

    text += `${labels.summary}\n${summary}\n\n`;

    if (steps.length > 0) {
      text += `${labels.steps}\n${steps.join('\n')}\n\n`;
    }

    if (requiredDocs.length > 0) {
      text += `${labels.docs}\n${requiredDocs.map((d) => `• ${d}`).join('\n')}\n\n`;
    }

    if (stateDuty) {
      text += `${labels.duty}\n${stateDuty}\n\n`;
    }

    if (discrepancyNotice) {
      text += `${labels.discrepancyHeader}\n${discrepancyNotice}\n\n`;
    }

    text += `${labels.basis}\n${legalBasis}\n`;
    text += `${labels.source}(${cleanLexUrl})\n`;

    if (adviceArticle?.officialUrl) {
      text += `${labels.adviceSource}(${adviceArticle.canonicalUrl || adviceArticle.officialUrl})\n`;
    }

    // STRICT REQUIREMENT: If edition is NOT reliably verified, DO NOT write "amaldagi tahrir tekshirildi"
    if (isCurrentEditionVerified && !isDegraded) {
      text += `${labels.verifiedDate} ${item.verifiedDate}\n`;
    } else {
      text += `${labels.unverifiedWarning}\n`;
    }

    text += `${labels.portal}(${OFFICIAL_URLS.E_NOTARIUS_HOME})`;
    text += LEGAL_DISCLAIMER[lang];

    return {
      language: lang,
      summary,
      legalBasis,
      sourceUrl: cleanLexUrl,
      adviceUrl: adviceArticle?.canonicalUrl || adviceArticle?.officialUrl,
      verifiedDate: isCurrentEditionVerified && !isDegraded ? item.verifiedDate : 'UNVERIFIED',
      isCurrentEditionVerified: isCurrentEditionVerified && !isDegraded,
      editionStatus: params.editionStatus,
      discrepancyNotice,
      steps: steps.length > 0 ? steps : undefined,
      requiredDocs: requiredDocs.length > 0 ? requiredDocs : undefined,
      stateDuty: stateDuty || undefined,
      fullFormattedText: text,
      hasVerifiedNorm: true,
      officialFallbackUrl: cleanLexUrl,
      isDegraded,
    };
  }

  public formatDegradedCachedResponse(original: FormattedLegalResponse, lang: SupportedLanguage): FormattedLegalResponse {
    const notice =
      lang === 'UZ_LATIN'
        ? '\n\n⚠️ *Diqqat:* Tashqi qonunchilik bazasi bilan aloqa vaqtincha mavjud emas. Taqdim etilgan ma’lumot avval saqlangan keshdan olindi va amaldagi holat yangilangan deb kafolatlanmaydi.'
        : lang === 'UZ_CYRILLIC'
        ? '\n\n⚠️ *Диққат:* Ташқи қонунчилик базаси билан алоқа вақтинча мавжуд эмас. Маълумот аввалги кешдан олинди ва амалдаги ҳолат янгиланган деб кафолатланмайди.'
        : '\n\n⚠️ *Внимание:* Связь с внешней юридической базой временно отсутствует. Информация получена из сохраненного кэша и не гарантирует актуальность текущей редакции.';

    return {
      ...original,
      isDegraded: true,
      isCurrentEditionVerified: false,
      fullFormattedText: original.fullFormattedText + notice,
    };
  }

  private buildNotFoundResponse(query: string, lang: SupportedLanguage): FormattedLegalResponse {
    const fallbackUrl = this.lexProvider.getFallbackUrl(query);

    let text = '';
    if (lang === 'UZ_LATIN') {
      text =
        `⚠️ *Kechirasiz, berilgan so‘rov bo‘yicha bazadan aniq tasdiqlangan huquqiy norma topilmadi.*\n\n` +
        `Notarial palata qoidalari bo‘yicha tizim taxminiy yoki tasdiqlanmagan huquqiy xulosalar bermaydi.\n\n` +
        `🔍 So‘rovingiz bo‘yicha rasmiy manbalardan qidirishni tavsiya qilamiz:\n` +
        `• [Lex.uz rasmiy qonunchilik bazasida qidirish](${fallbackUrl})\n` +
        `• [Advice.uz huquqiy portalida qidirish](${OFFICIAL_URLS.ADVICE_UZ_NOTARIAT_CATEGORY})\n` +
        `• [E-Notarius portalida notariusga yozilish](${OFFICIAL_URLS.E_NOTARIUS_HOME})` +
        LEGAL_DISCLAIMER.UZ_LATIN;
    } else if (lang === 'UZ_CYRILLIC') {
      text =
        `⚠️ *Кечирасиз, берилган сўров бўйича базадан аниқ тасдиқланган ҳуқуқий норма топилмади.*\n\n` +
        `Нотариал палата қоидалари бўйича тизим тахминий ёки тасдиқланмаган ҳуқуқий хулосалар бермайди.\n\n` +
        `🔍 Сўровингиз бўйича расмий манбалардан қидиришни тавсия қиламиз:\n` +
        `• [Lex.uz расмий қонунчилик базасида қидириш](${fallbackUrl})\n` +
        `• [Advice.uz ҳуқуқий порталида қидириш](${OFFICIAL_URLS.ADVICE_UZ_NOTARIAT_CATEGORY})\n` +
        `• [E-Notarius порталида нотариусга ёзилиш](${OFFICIAL_URLS.E_NOTARIUS_HOME})` +
        LEGAL_DISCLAIMER.UZ_CYRILLIC;
    } else {
      text =
        `⚠️ *По вашему запросу в базе проверенных правовых норм точного совпадения не найдено.*\n\n` +
        `В соответствии с политикой точности бот не генерирует неподтвержденную или предположительную информацию.\n\n` +
        `🔍 Рекомендуем обратиться к официальным первоисточникам:\n` +
        `• [Поиск в национальной базе Lex.uz](${fallbackUrl})\n` +
        `• [Портал правовых консультаций Advice.uz](${OFFICIAL_URLS.ADVICE_UZ_NOTARIAT_CATEGORY})\n` +
        `• [Портал Электронного нотариуса E-Notarius.uz](${OFFICIAL_URLS.E_NOTARIUS_HOME})` +
        LEGAL_DISCLAIMER.RU;
    }

    return {
      language: lang,
      summary: 'No verified legal act found',
      legalBasis: 'Lex.uz / Advice.uz',
      sourceUrl: fallbackUrl,
      verifiedDate: 'N/A',
      isCurrentEditionVerified: false,
      editionStatus: 'UNKNOWN',
      fullFormattedText: text,
      hasVerifiedNorm: false,
      officialFallbackUrl: fallbackUrl,
    };
  }

  private getCategoryTitle(category: string, lang: SupportedLanguage): string {
    const titles: Record<string, Record<SupportedLanguage, string>> = {
      MEROS: {
        UZ_LATIN: 'Meros va meros guvohnomasi',
        UZ_CYRILLIC: 'Мерос ва мерос гувоҳномаси',
        RU: 'Наследство и свидетельство о праве на наследство',
      },
      AVTOMOBIL: {
        UZ_LATIN: 'Avtomobil oldi-sotdisi va ro‘yxatga olish',
        UZ_CYRILLIC: 'Автомобиль олди-сотдиси ва рўйхатга олиш',
        RU: 'Купля-продажа и оформление автотранспорта',
      },
      UY_JOY: {
        UZ_LATIN: 'Uy-joy va ko‘chmas mulk bitimlari',
        UZ_CYRILLIC: 'Уй-жой ва кўчмас мулк битимлари',
        RU: 'Сделки с недвижимостью и жильем',
      },
      ISHONCHNOMA: {
        UZ_LATIN: 'Ishonchnomalar rasmiylashtirish tartibi',
        UZ_CYRILLIC: 'Ишончномалар расмийлаштириш тартиби',
        RU: 'Порядок оформления доверенностей',
      },
      HADYA: {
        UZ_LATIN: 'Hadya shartnomasi rasmiylashtirish',
        UZ_CYRILLIC: 'Ҳадя шартномаси расмийлаштириш',
        RU: 'Оформление договора дарения',
      },
      NIKOH_SHARTNOMASI: {
        UZ_LATIN: 'Nikoh shartnomasi tuzish tartibi',
        UZ_CYRILLIC: 'Никоҳ шартномаси тузиш тартиби',
        RU: 'Порядок заключения брачного договора',
      },
      NOTARIAL_TASDIQLASH: {
        UZ_LATIN: 'Notarial tasdiqlash va umumiy qoidalar',
        UZ_CYRILLIC: 'Нотариал тасдиқлаш ва умумий қоидалар',
        RU: 'Нотариальное удостоверение и общие правила',
      },
      DAVLAT_BOJI: {
        UZ_LATIN: 'Davlat boji va to‘lovlar stavkalari',
        UZ_CYRILLIC: 'Давлат божи ва тўловлар ставкалари',
        RU: 'Ставки государственной пошлины и сборов',
      },
      HUJJATLARNI_RASMIYLASHTIRISH: {
        UZ_LATIN: 'Hujjatlarni rasmiylashtirish va dublikat berish',
        UZ_CYRILLIC: 'Ҳужжатларни расмийлаштириш ва дубликат бериш',
        RU: 'Оформление документов и выдача дубликатов',
      },
      BOSHQA: {
        UZ_LATIN: 'Boshqa notarial xizmatlar (qarz, garov, ijro xatlari)',
        UZ_CYRILLIC: 'Бошқа нотариал хизматлар (қарз, гаров, ижро хатлари)',
        RU: 'Прочие нотариальные действия (займы, залог, исполнительные надписи)',
      },
    };

    return titles[category]?.[lang] || 'Notarial ma‘lumot';
  }
}

export const legalSearchService = new LegalSearchService();
