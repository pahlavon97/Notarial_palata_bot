import { LexUzProvider } from '../../src/providers/lex-uz.provider';
import { AdviceUzProvider } from '../../src/providers/advice-uz.provider';
import { ENotariusProvider } from '../../src/providers/e-notarius.provider';

describe('Providers & External Integration Unit Tests', () => {
  describe('LexUzProvider', () => {
    let provider: LexUzProvider;

    beforeEach(() => {
      provider = new LexUzProvider();
    });

    it('should search normative legal acts by keyword', async () => {
      const results = await provider.searchNormativeActs('meros');
      expect(results.length).toBeGreaterThan(0);
      const first = results[0]!;
      expect(first.item.category).toBe('MEROS');
      expect(first.item.officialUrl).toContain('https://lex.uz');
      expect(first.item.isCurrentEdition).toBe(true);
    });

    it('should filter acts by category', async () => {
      const results = await provider.searchNormativeActs('oldi-sotdi', 'AVTOMOBIL');
      expect(results.length).toBeGreaterThan(0);
      const first = results[0]!;
      expect(first.item.category).toBe('AVTOMOBIL');
    });

    it('should provide safe official fallback URL', () => {
      const fallbackWithQuery = provider.getFallbackUrl('vasiyatnoma');
      expect(fallbackWithQuery).toContain('https://lex.uz/search/natsearch');

      const fallbackGeneric = provider.getFallbackUrl('');
      expect(fallbackGeneric).toBe('https://lex.uz/');
    });

    it('should track health status correctly', () => {
      const health = provider.getHealth();
      expect(health.name).toBe('LexUzProvider');
      expect(health.status).toBe('UP');
    });
  });

  describe('AdviceUzProvider', () => {
    let provider: AdviceUzProvider;

    beforeEach(() => {
      provider = new AdviceUzProvider();
    });

    it('should retrieve category 701 guide by category', async () => {
      const guide = await provider.getGuideByCategory('MEROS');
      expect(guide).not.toBeNull();
      expect(guide?.titleUzLat).toContain('Merosni rasmiylashtirish');
      expect(guide?.stepsUzLat.length).toBeGreaterThan(0);
      expect(guide?.requiredDocsUzLat.length).toBeGreaterThan(0);
      expect(guide?.officialUrl).toBe('https://advice.uz/uz/category/701');
    });

    it('should return null for non-existent category safely without crashing', async () => {
      const guide = await provider.getGuideByCategory('NON_EXISTENT_CAT');
      expect(guide).toBeNull();
    });

    it('should return safe fallback URL', () => {
      expect(provider.getFallbackUrl()).toBe('https://advice.uz/uz/category/701');
    });
  });

  describe('ENotariusProvider', () => {
    let provider: ENotariusProvider;

    beforeEach(() => {
      provider = new ENotariusProvider();
    });

    it('should retrieve verified notaries by region', async () => {
      const notaries = await provider.getNotariesByRegion('tashkent_city');
      expect(notaries.length).toBeGreaterThan(0);
      const first = notaries[0]!;
      expect(first.address).toContain('Toshkent');
      expect(first.phone).toBeDefined();
      expect(first.workingHours).toBeDefined();
      expect(first.licenseNumber).toBeDefined();
      expect(first.officialUrl).toContain('https://e-notarius.uz');
    });

    it('should find notary by district name', async () => {
      const notaries = await provider.findNotaries('tashkent_city', 'Yunusobod');
      expect(notaries.length).toBeGreaterThan(0);
      const first = notaries[0]!;
      expect(first.districtName).toContain('Yunusobod');
    });

    it('should return empty list safely for unknown region without hallucinating data', async () => {
      const notaries = await provider.getNotariesByRegion('unknown_region');
      expect(notaries).toEqual([]);
    });

    it('should return official E-Notarius fallback URL', () => {
      expect(provider.getFallbackUrl()).toBe('https://e-notarius.uz/');
    });
  });
});
