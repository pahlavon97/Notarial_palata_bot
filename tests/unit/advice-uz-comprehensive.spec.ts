import { AdviceUzProvider } from '../../src/providers/advice-uz.provider';
import { SsrfGuard } from '../../src/security/ssrf-guard';

describe('AdviceUZ Comprehensive & Category 701 Search Tests', () => {
  let provider: AdviceUzProvider;

  beforeEach(() => {
    provider = new AdviceUzProvider();
  });

  describe('1. Notariat Category 701 All 10 Topics Coverage', () => {
    const categories = [
      'MEROS',
      'AVTOMOBIL',
      'ISHONCHNOMA',
      'UY_JOY',
      'HADYA',
      'NIKOH_SHARTNOMASI',
      'NOTARIAL_TASDIQLASH',
      'DAVLAT_BOJI',
      'HUJJATLARNI_RASMIYLASHTIRISH',
      'BOSHQA',
    ];

    it.each(categories)('should provide structured article for category: %s', async category => {
      const article = await provider.getArticleByCategory(category);
      expect(article).not.toBeNull();
      expect(article?.category).toBe(category);
      expect(article?.titleUzLat).toBeDefined();
      expect(article?.contentUzLat.length).toBeGreaterThan(10);
      expect(article?.officialUrl).toContain('advice.uz');
      expect(article?.canonicalUrl).toBeDefined();
      expect(article?.lastVerifiedAt).toBeDefined();
      expect(article?.relatedNormativeActs.length).toBeGreaterThan(0);
    });

    it('should search articles across topics by relevant keyword', async () => {
      const results = await provider.searchArticles('meros vasiyatnoma ochish');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]?.category).toBe('MEROS');
      expect(results[0]?.contentUzLat).toContain('meros');
    });

    it('should return articles with proper metadata structure', async () => {
      const article = await provider.getArticleByCategory('DAVLAT_BOJI');
      expect(article).not.toBeNull();
      expect(article?.requiredDocsUzLat).toBeDefined();
      expect(article?.stepsUzLat).toBeDefined();
      expect(article?.relatedNormativeActs.length).toBeGreaterThan(0);
    });
  });

  describe('2. Internal Article Link Discovery & Extraction', () => {
    it('should discover article links from Advice.uz HTML structure', () => {
      const mockCategoryHtml = `
        <div class="category-articles">
          <a href="/uz/document/2187">Merosni qabul qilish tartibi</a>
          <a href="/uz/document/1897">Avtomobil oldi-sotdisi shartnomasi</a>
          <a href="https://external-unknown.com/page">Tashqi havola</a>
        </div>
      `;

      const links = provider.extractArticleLinks(mockCategoryHtml, 'https://advice.uz/uz/category/701');
      expect(links).toContain('https://advice.uz/uz/document/2187');
      expect(links).toContain('https://advice.uz/uz/document/1897');
      // Must not include external untrusted links
      expect(links.find((l: string) => l.includes('external-unknown.com'))).toBeUndefined();
    });

    it('should parse article content and header from HTML', () => {
      const mockArticleHtml = `
        <h3 class="page-header">Merosni rasmiylashtirish</h3>
        <div class="page-document-content">
          <p>Meros ochilgan kundan e'tiboran 6 oy ichida notariusga murojaat qilish kerak.</p>
        </div>
        <div class="field-name-field-date">10.01.2026</div>
      `;

      const parsed = provider.parseArticleHtml(mockArticleHtml, 'https://advice.uz/uz/document/2187');
      expect(parsed).not.toBeNull();
      expect(parsed?.titleUzLat).toBe('Merosni rasmiylashtirish');
      expect(parsed?.contentUzLat).toContain('Meros ochilgan kundan e\'tiboran 6 oy');
      expect(parsed?.publishedDate).toBe('10.01.2026');
    });
  });

  describe('3. Safe Redirect Handling & SSRF Protection', () => {
    it('should block unsafe redirects or SSRF URLs via SsrfGuard', () => {
      expect(SsrfGuard.isSafeUrl('http://127.0.0.1/admin')).toBe(false);
      expect(SsrfGuard.isSafeUrl('http://169.254.169.254/latest/meta-data/')).toBe(false);
      expect(SsrfGuard.isSafeUrl('http://localhost:8080/')).toBe(false);
      expect(SsrfGuard.isSafeUrl('https://evil-hacker.com/exploit')).toBe(false);
    });

    it('should allow legitimate official domains', () => {
      expect(SsrfGuard.isSafeUrl('https://advice.uz/uz/category/701')).toBe(true);
      expect(SsrfGuard.isSafeUrl('https://lex.uz/docs/111189')).toBe(true);
      expect(SsrfGuard.isSafeUrl('https://e-notarius.uz/')).toBe(true);
      expect(SsrfGuard.isSafeUrl('https://notarialpalata.uz/')).toBe(true);
    });

    it('should return safe fallback URL when network request fails', () => {
      const fallback = provider.getFallbackUrl();
      expect(fallback).toBe('https://advice.uz/uz/category/701');
    });
  });
});
