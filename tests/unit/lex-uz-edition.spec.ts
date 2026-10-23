import { LexUzProvider } from '../../src/providers/lex-uz.provider';
import { LegalSearchService } from '../../src/services/legal-search.service';

describe('LexUZ Edition & Historical ONDATE Unit Tests', () => {
  let provider: LexUzProvider;
  let searchService: LegalSearchService;

  beforeEach(() => {
    provider = new LexUzProvider();
    searchService = new LegalSearchService();
  });

  describe('1. Historical ONDATE URL Sanitization', () => {
    it('should strip ONDATE query parameter and fragment from historical LexUZ URLs', () => {
      const historicalUrl1 = 'https://lex.uz/docs/111189?ONDATE=01.01.2018%2000:00:00#12345';
      const cleaned1 = LexUzProvider.cleanLexUrl(historicalUrl1);
      expect(cleaned1).toBe('https://lex.uz/docs/111189#12345');
      expect(cleaned1).not.toContain('ONDATE');

      const historicalUrl2 = 'https://lex.uz/docs/4089909?ondate=15.03.2020';
      const cleaned2 = LexUzProvider.cleanLexUrl(historicalUrl2);
      expect(cleaned2).toBe('https://lex.uz/docs/4089909');
      expect(cleaned2).not.toContain('ondate');
    });

    it('should correctly identify historical URLs with isHistoricalUrl', () => {
      expect(LexUzProvider.isHistoricalUrl('https://lex.uz/docs/111189?ONDATE=2018-01-01')).toBe(true);
      expect(LexUzProvider.isHistoricalUrl('https://lex.uz/docs/111189?ondate=01.01.2020')).toBe(true);
      expect(LexUzProvider.isHistoricalUrl('https://lex.uz/docs/111189')).toBe(false);
      expect(LexUzProvider.isHistoricalUrl('https://lex.uz/uz/docs/4089909')).toBe(false);
    });

    it('should never append ONDATE when generating official LexUZ URLs for current law', () => {
      const officialUrl = provider.buildOfficialLexUrl('111189');
      expect(officialUrl).toBe('https://lex.uz/docs/111189');
      expect(officialUrl).not.toContain('ONDATE');
      expect(officialUrl).not.toContain('ondate');
    });

    it('should preserve document ID and clean historical URLs when fetching', () => {
      const dirtyUrl = 'https://lex.uz/docs/180550?ONDATE=01.01.2015';
      const cleaned = LexUzProvider.cleanLexUrl(dirtyUrl);
      expect(cleaned).toBe('https://lex.uz/docs/180550');
    });
  });

  describe('2. Repealed Documents (Bekor qilingan hujjatlar)', () => {
    it('should mark repealed documents with REPEALED status', async () => {
      const verification = await provider.verifyDocumentEdition('OLD-NOTARY-RULES-1998');
      expect(verification.legalStatus).toBe('REPEALED');
      expect(verification.isCurrentEdition).toBe(false);
      expect(verification.statusNotice).toContain('kuchini yo‘qotgan');
    });

    it('should filter out repealed documents from active legal search by default', async () => {
      const results = await provider.searchNormativeActs('kuchini yoqotgan qonun');
      const foundRepealed = results.find(r => r.item.id === 'legal-repealed-sample-01');
      expect(foundRepealed).toBeUndefined();
    });

    it('should allow retrieving repealed documents only when includeRepealed is true', async () => {
      const results = await provider.searchNormativeActs('kuchini yoqotgan qonun', undefined, {
        includeRepealed: true,
      });
      const foundRepealed = results.find(r => r.item.id === 'legal-repealed-sample-01');
      expect(foundRepealed).toBeDefined();
      expect(foundRepealed?.item.legalStatus).toBe('REPEALED');
    });
  });

  describe('3. Active vs Historical Editions', () => {
    it('should verify active in-force edition for active documents', async () => {
      const verification = await provider.verifyDocumentEdition('111189');
      expect(verification.legalStatus).toBe('IN_FORCE');
      expect(verification.isCurrentEdition).toBe(true);
      expect(verification.cleanUrl).toContain('https://lex.uz/docs/111189');
    });

    it('should distinguish historical edition from active edition', async () => {
      const historicalVerif = await provider.verifyDocumentEdition('https://lex.uz/docs/111189?ONDATE=01.01.2010');
      expect(historicalVerif.legalStatus).toBe('HISTORICAL_EDITION');
      expect(historicalVerif.isCurrentEdition).toBe(false);
      expect(historicalVerif.statusNotice).toContain('tarixiy tahrir');
    });

    it('should not claim "amaldagi tahrir tekshirildi" when edition is historical or unverified', async () => {
      const response = await searchService.answerQuestion('Meros ochish va qabul qilish muddati', 'UZ_LATIN');
      expect(response.hasVerifiedNorm).toBe(true);
      if (response.editionStatus === 'IN_FORCE' && response.isCurrentEditionVerified) {
        expect(response.fullFormattedText).toContain('Amaldagi tahrir tekshirilgan sana');
      }

      // If document is unknown or historical, it must NOT claim "amaldagi tahrir tekshirildi"
      const fakeUnverifiedResponse = await searchService.answerQuestion(
        'Qamchiq dovonida ob-havo qanday va samolyot qachon uchadi?',
        'UZ_LATIN'
      );
      expect(fakeUnverifiedResponse.fullFormattedText).not.toContain('amaldagi tahrir tekshirildi');
    });
  });
});
