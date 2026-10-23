import { LegalSearchService, FormattedLegalResponse } from '../../src/services/legal-search.service';
import { LegalCacheService } from '../../src/services/legal-cache.service';
import { LexUzProvider } from '../../src/providers/lex-uz.provider';
import { AdviceUzProvider, AdviceUzArticle } from '../../src/providers/advice-uz.provider';

describe('Two-Source Search, Discrepancy, Cache & Multilingual Tests', () => {
  let cacheService: LegalCacheService;
  let lexProvider: LexUzProvider;
  let adviceProvider: AdviceUzProvider;
  let searchService: LegalSearchService;

  beforeEach(() => {
    cacheService = new LegalCacheService();
    lexProvider = new LexUzProvider();
    adviceProvider = new AdviceUzProvider();
    searchService = new LegalSearchService(lexProvider, adviceProvider, cacheService);
  });

  describe('1. Discrepancy Handling Between Advice.uz and Lex.uz', () => {
    it('should detect differences between Advice.uz article and Lex.uz normative acts', async () => {
      const mockAdviceArticle: AdviceUzArticle = {
        id: 'advice_conflict_1',
        category: 'MEROS',
        titleUzLat: 'Meros ochish',
        titleUzCyr: 'Мерос очиш',
        titleRu: 'Открытие наследства',
        contentUzLat: 'Boj to‘lovi 50 foiz stavkada belgilanadi',
        contentUzCyr: 'Бож тўлови 50 фоиз ставкада белгиланади',
        contentRu: 'Пошлина составляет 50 процентов',
        stepsUzLat: ['Notariusga borish'],
        stepsUzCyr: ['Нотариусга бориш'],
        stepsRu: ['Обратиться к нотариусу'],
        requiredDocsUzLat: ['Guvohnoma'],
        requiredDocsUzCyr: ['Гувоҳнома'],
        requiredDocsRu: ['Свидетельство'],
        officialUrl: 'https://advice.uz/uz/document/2187',
        canonicalUrl: 'https://advice.uz/uz/document/2187',
        publishedDate: '2020-01-01',
        lastVerifiedAt: '2020-01-01',
        isVerifiedCurrent: true,
        relatedNormativeActs: [{ title: 'FK 1146-modda', lexUrl: 'https://lex.uz/docs/111189' }],
        discrepancyNote: {
          uzLat: 'Izoh: Ushbu stavka 2026-yilgi amaldagi qonunga ko‘ra o‘zgargan bo‘lishi mumkin.',
        },
      };

      jest.spyOn(adviceProvider, 'searchArticles').mockResolvedValue([mockAdviceArticle]);

      const response = await searchService.answerQuestion('Meros ochish va qabul qilish muddati', 'UZ_LATIN');

      // LexUZ is the supreme normative legal act and must take precedence
      expect(response.hasVerifiedNorm).toBe(true);
      expect(response.sourceUrl).toContain('https://lex.uz');
      expect(response.legalBasis).toContain('Fuqarolik kodeksi');
      // Verify Advice.uz URL is also provided as secondary explanation
      expect(response.adviceUrl).toBe('https://advice.uz/uz/document/2187');
      expect(response.fullFormattedText).toContain('advice.uz');
    });
  });

  describe('2. Provider Failure & Degraded State Handling', () => {
    it('should handle provider failure safely without crashing', async () => {
      // Simulate LexUZ provider being down
      jest.spyOn(lexProvider, 'getHealth').mockReturnValue({
        name: 'LexUzProvider',
        status: 'DOWN',
        lastChecked: new Date(),
        consecutiveFailures: 3,
      });

      // Should still return safe response
      const response = await searchService.answerQuestion('Meros muddati', 'UZ_LATIN');
      expect(response).toBeDefined();
      expect(response.fullFormattedText).toBeDefined();
    });

    it('should flag degraded cached responses when external sources are down', () => {
      const queryHash = cacheService.generateQueryHash('vasiyatnoma');
      const cacheKey = cacheService.buildKey({
        queryHash,
        docId: '111189',
        language: 'UZ_LATIN',
      });

      const fakeResponse: FormattedLegalResponse = {
        summary: 'Vasiyatnoma rasmiylashtirish',
        requiredDocs: ['Pasport'],
        steps: ['Ariza berish'],
        legalBasis: 'FK 1120-modda',
        sourceUrl: 'https://lex.uz/docs/111189',
        fullFormattedText: 'Test text with info',
        hasVerifiedNorm: true,
        verifiedDate: '2026-01-01',
        language: 'UZ_LATIN',
        isCurrentEditionVerified: true,
        editionStatus: 'IN_FORCE',
        officialFallbackUrl: 'https://lex.uz/docs/111189',
      };

      cacheService.set({
        key: cacheKey,
        queryHash,
        docId: '111189',
        data: fakeResponse,
      });

      // When external provider is down, cached response is marked as degraded
      const retrieved = cacheService.get<FormattedLegalResponse>(cacheKey, true);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.isDegraded).toBe(true);

      // Verify formatted degraded response strips false current edition claims
      const degradedFormatted = searchService.formatDegradedCachedResponse(retrieved!.data, 'UZ_LATIN');
      expect(degradedFormatted.isCurrentEditionVerified).toBe(false);
      expect(degradedFormatted.fullFormattedText).toContain('Tashqi qonunchilik bazasi bilan aloqa vaqtincha mavjud emas');
    });
  });

  describe('3. Cache Key Generation & Document Invalidation', () => {
    it('should generate consistent SHA-256 query hashes', () => {
      const hash1 = cacheService.generateQueryHash('Meros guvohnomasi');
      const hash2 = cacheService.generateQueryHash('meros guvohnomasi');
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(16);
    });

    it('should invalidate cache entries by document ID upon new legal updates', () => {
      const docId = '4089909';
      const hash1 = cacheService.generateQueryHash('avtomobil oldi-sotdi');
      const hash2 = cacheService.generateQueryHash('mashina shartnomasi');
      const hashOther = cacheService.generateQueryHash('meros');

      const key1 = cacheService.buildKey({
        queryHash: hash1,
        docId,
        language: 'UZ_LATIN',
      });
      const key2 = cacheService.buildKey({
        queryHash: hash2,
        docId,
        language: 'UZ_LATIN',
      });
      const keyOther = cacheService.buildKey({
        queryHash: hashOther,
        docId: '111189',
        language: 'UZ_LATIN',
      });

      cacheService.set({ key: key1, queryHash: hash1, docId, data: { val: 1 } });
      cacheService.set({ key: key2, queryHash: hash2, docId, data: { val: 2 } });
      cacheService.set({ key: keyOther, queryHash: hashOther, docId: '111189', data: { val: 3 } });

      expect(cacheService.get(key1)).not.toBeNull();
      expect(cacheService.get(key2)).not.toBeNull();
      expect(cacheService.get(keyOther)).not.toBeNull();

      // Invalidate docId 4089909
      const invalidatedCount = cacheService.invalidateDoc(docId);
      expect(invalidatedCount).toBe(2);

      expect(cacheService.get(key1)).toBeNull();
      expect(cacheService.get(key2)).toBeNull();
      // Other docId must remain intact
      expect(cacheService.get(keyOther)).not.toBeNull();
    });
  });

  describe('4. Multilingual Queries (Uzbek Latin, Cyrillic, Russian)', () => {
    it('should correctly process and format answer in Uzbek Latin', async () => {
      const res = await searchService.answerQuestion('Ishonchnoma berish tartibi qanday?', 'UZ_LATIN');
      expect(res.language).toBe('UZ_LATIN');
      expect(res.fullFormattedText).toContain('Huquqiy asos:');
      expect(res.fullFormattedText).toContain('Rasmiy manba (Lex.uz):');
    });

    it('should correctly process and format answer in Uzbek Cyrillic', async () => {
      const res = await searchService.answerQuestion('Ишончнома бериш тартиби қандай?', 'UZ_CYRILLIC');
      expect(res.language).toBe('UZ_CYRILLIC');
      expect(res.fullFormattedText).toContain('Ҳуқуқий асос:');
      expect(res.fullFormattedText).toContain('Расмий манба (Lex.uz):');
    });

    it('should correctly process and format answer in Russian', async () => {
      const res = await searchService.answerQuestion('Какой порядок выдачи доверенности?', 'RU');
      expect(res.language).toBe('RU');
      expect(res.fullFormattedText).toContain('Правовое основание:');
      expect(res.fullFormattedText).toContain('Официальный источник (Lex.uz):');
    });
  });
});
