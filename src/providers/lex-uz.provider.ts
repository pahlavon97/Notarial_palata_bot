import { BaseProvider } from './base.provider';
import { VERIFIED_LEGAL_CORPUS, VerifiedLegalItem, DocumentLegalStatus } from '../database/legal-corpus.data';
import { OFFICIAL_URLS } from '../config/constants';
import { SsrfGuard } from '../security/ssrf-guard';

export interface LegalSearchResult {
  item: VerifiedLegalItem;
  score: number;
  matchedKeywords: string[];
  cleanUrl: string;
  isCurrentEditionVerified: boolean;
  editionStatus: DocumentLegalStatus;
  statusNotice?: string;
}

export interface DocumentEditionCheckResult {
  docNumber?: string;
  isCurrentEdition: boolean;
  legalStatus: DocumentLegalStatus;
  statusNotice: string;
  effectiveDate?: string;
  verifiedAt: string;
  isReliablyVerified: boolean;
  cleanUrl: string;
  hasHistoricalParams: boolean;
}

export interface SearchOptions {
  includeRepealed?: boolean;
  targetDate?: string;
}

export class LexUzProvider extends BaseProvider {
  constructor(timeoutMs = 5000) {
    super('LexUzProvider', timeoutMs);
  }

  /**
   * Static helper to sanitize historical parameters from a Lex.uz URL
   */
  public static cleanLexUrl(rawUrl: string): string {
    const p = new LexUzProvider();
    return p.cleanLexUrl(rawUrl).cleanUrl;
  }

  /**
   * Static helper to detect whether a URL contains historical parameters (e.g. ONDATE)
   */
  public static isHistoricalUrl(rawUrl: string): boolean {
    const p = new LexUzProvider();
    return p.cleanLexUrl(rawUrl).hasHistoricalParam;
  }

  /**
   * Cleans a Lex.uz URL by removing historical revision parameters (like ONDATE)
   * while preserving the document ID and anchor fragment.
   */
  public cleanLexUrl(rawUrl: string): { cleanUrl: string; hasHistoricalParam: boolean; onDateValue: string | null } {
    try {
      const parsed = SsrfGuard.validateUrl(rawUrl);
      let hasHistoricalParam = false;
      let onDateValue: string | null = null;

      // Check all query parameters case-insensitively for ONDATE
      const keysToDelete: string[] = [];
      for (const [key, val] of parsed.searchParams.entries()) {
        if (key.toLowerCase() === 'ondate') {
          hasHistoricalParam = true;
          onDateValue = val;
          keysToDelete.push(key);
        }
      }

      for (const k of keysToDelete) {
        parsed.searchParams.delete(k);
      }

      // If search params are now empty, remove the trailing '?'
      let cleanUrl = parsed.origin + parsed.pathname;
      const remainingSearch = parsed.searchParams.toString();
      if (remainingSearch) {
        cleanUrl += `?${remainingSearch}`;
      }
      if (parsed.hash) {
        cleanUrl += parsed.hash;
      }

      return { cleanUrl, hasHistoricalParam, onDateValue };
    } catch {
      // If parsing fails, return as-is
      return { cleanUrl: rawUrl, hasHistoricalParam: false, onDateValue: null };
    }
  }

  /**
   * Checks whether a URL contains historical parameters or points to an archived revision
   */
  public isHistoricalUrl(rawUrl: string): boolean {
    const { hasHistoricalParam } = this.cleanLexUrl(rawUrl);
    return hasHistoricalParam;
  }

  /**
   * Safely constructs an official canonical Lex.uz URL.
   * By default, it NEVER appends historical parameters.
   */
  public buildOfficialLexUrl(docId: string, options?: { anchor?: string; onDate?: string }): string {
    const cleanDocId = docId.replace(/[^0-9A-Za-z_-]/g, '');
    let url = `https://lex.uz/docs/${cleanDocId}`;
    if (options?.onDate && options.onDate.trim().length > 0) {
      url += `?ONDATE=${encodeURIComponent(options.onDate.trim())}`;
    }
    if (options?.anchor) {
      const cleanAnchor = options.anchor.replace(/^#/, '');
      url += `#${cleanAnchor}`;
    }
    return url;
  }

  /**
   * Verifies the legal status and edition of a document.
   */
  public async verifyDocumentEdition(
    docIdentifier: string,
    requestedDate?: string
  ): Promise<DocumentEditionCheckResult> {
    return this.executeWithTimeout(
      async () => {
        let extractedDocId = docIdentifier;
        if (docIdentifier.startsWith('http')) {
          const match = docIdentifier.match(/\/docs\/([0-9A-Za-z_-]+)/i);
          if (match) {
            extractedDocId = match[1]!;
          }
        }
        const cleanId = extractedDocId.replace(/[^0-9A-Za-z_-]/g, '');
        const { cleanUrl, hasHistoricalParam } = this.cleanLexUrl(docIdentifier);

        // Find in verified legal corpus
        const item = VERIFIED_LEGAL_CORPUS.find(
          (c) =>
            c.id === docIdentifier ||
            c.docNumber === cleanId ||
            c.officialUrl.includes(`/docs/${cleanId}`) ||
            (docIdentifier.startsWith('http') && (c.officialUrl === docIdentifier || c.cleanOfficialUrl === cleanUrl))
        );

        if (!item) {
          // If not in verified corpus and requested without verification
          return {
            docNumber: cleanId || undefined,
            isCurrentEdition: false,
            legalStatus: 'UNKNOWN',
            statusNotice: 'Hujjatning amaldagi tahriri rasmiy bazada avtomatik tasdiqlanmadi',
            verifiedAt: new Date().toISOString().split('T')[0] || '2026-01-01',
            isReliablyVerified: false,
            cleanUrl: cleanUrl.startsWith('http') ? cleanUrl : `https://lex.uz/docs/${cleanId}`,
            hasHistoricalParams: hasHistoricalParam,
          };
        }

        // If the document is known to be repealed (o'z kuchini yo'qotgan)
        if (item.legalStatus === 'REPEALED') {
          return {
            docNumber: item.docNumber,
            isCurrentEdition: false,
            legalStatus: 'REPEALED',
            statusNotice: `Mazkur hujjat ${item.repealDate || 'avvalgi'} sanada o‘z kuchini yo‘qotgan va amaldagi huquqiy munosabatlarda qo‘llanilmaydi.`,
            effectiveDate: item.effectiveDate,
            verifiedAt: item.verifiedDate,
            isReliablyVerified: true,
            cleanUrl: item.cleanOfficialUrl || item.officialUrl,
            hasHistoricalParams: hasHistoricalParam,
          };
        }

        // If URL had historical ONDATE and user didn't ask for historical date
        if (hasHistoricalParam && !requestedDate) {
          return {
            docNumber: item.docNumber,
            isCurrentEdition: false,
            legalStatus: 'HISTORICAL_EDITION',
            statusNotice: 'Havolada tarixiy tahrir parametri (ONDATE) aniqlandi. Amaldagi tahrirga havola berilmoqda.',
            effectiveDate: item.effectiveDate,
            verifiedAt: item.verifiedDate,
            isReliablyVerified: true,
            cleanUrl: item.cleanOfficialUrl || this.cleanLexUrl(item.officialUrl).cleanUrl,
            hasHistoricalParams: true,
          };
        }

        // In force and verified
        return {
          docNumber: item.docNumber,
          isCurrentEdition: item.isCurrentEdition && item.legalStatus === 'IN_FORCE',
          legalStatus: item.legalStatus,
          statusNotice: 'Amaldagi tahrir tasdiqlangan',
          effectiveDate: item.effectiveDate,
          verifiedAt: item.verifiedDate,
          isReliablyVerified: true,
          cleanUrl: item.cleanOfficialUrl || this.cleanLexUrl(item.officialUrl).cleanUrl,
          hasHistoricalParams: false,
        };
      },
      () => ({
        docNumber: undefined,
        isCurrentEdition: false,
        legalStatus: 'UNKNOWN',
        statusNotice: 'Lex.uz xizmatiga ulanishda uzilish: tahrir holatini avtomatik aniqlab bo‘lmadi',
        verifiedAt: 'N/A',
        isReliablyVerified: false,
        cleanUrl: OFFICIAL_URLS.LEX_UZ_HOME,
        hasHistoricalParams: false,
      })
    );
  }

  public getFallbackUrl(query?: string): string {
    if (query && query.trim().length > 0) {
      const encoded = encodeURIComponent(query.trim());
      const targetUrl = `https://lex.uz/search/natsearch?search_text=${encoded}`;
      if (SsrfGuard.isSafeUrl(targetUrl)) {
        return targetUrl;
      }
    }
    return OFFICIAL_URLS.LEX_UZ_HOME;
  }

  /**
   * Search through verified Lex.uz normative acts with keyword relevance scoring
   * Automatically filters out repealed documents and historical ONDATE editions
   * unless explicitly requested.
   */
  public async searchNormativeActs(
    query: string,
    categoryFilter?: string,
    options?: SearchOptions
  ): Promise<LegalSearchResult[]> {
    return this.executeWithTimeout(
      async () => {
        const cleanQuery = query.toLowerCase().trim();
        const stopWords = new Set([
          'qanday', 'qachon', 'qaerda', 'qayerda', 'uchun', 'bilan', 'haqida', 'nima', 'kerak', 'mumkin',
          'bormi', 'va', 'yoki', 'esa', 'ham', 'bu', 'shu', 'biz', 'siz',
          'как', 'где', 'когда', 'что', 'для', 'или', 'если', 'можно', 'нужно', 'ли'
        ]);

        const tokens = cleanQuery
          .split(/[\s,.;:!?]+/)
          .filter((t) => t.length > 2 && !stopWords.has(t));

        if (tokens.length === 0 && !categoryFilter) {
          return [];
        }

        const results: LegalSearchResult[] = [];

        for (const item of VERIFIED_LEGAL_CORPUS) {
          if (item.source !== 'LEX_UZ') continue;
          if (categoryFilter && item.category !== categoryFilter) continue;

          // Reject repealed documents unless explicitly allowed
          if (!options?.includeRepealed && item.legalStatus === 'REPEALED') {
            continue;
          }

          // Reject historical editions when seeking current law
          if (!options?.targetDate && item.legalStatus === 'HISTORICAL_EDITION') {
            continue;
          }

          let score = 0;
          const matchedKeywords: string[] = [];

          // Exact category match
          if (cleanQuery.includes(item.category.toLowerCase())) {
            score += 10;
          }

          // Keyword matches (definitive match)
          for (const kw of item.keywords) {
            const kwLower = kw.toLowerCase();
            if (cleanQuery.includes(kwLower)) {
              score += 8;
              matchedKeywords.push(kw);
            } else {
              for (const token of tokens) {
                if (kwLower === token || (token.length >= 4 && kwLower.includes(token))) {
                  score += 4;
                  matchedKeywords.push(token);
                }
              }
            }
          }

          // Title check
          const titleStr = (
            item.articleTitle.uzLat + ' ' +
            item.articleTitle.uzCyr + ' ' +
            item.articleTitle.ru + ' ' +
            item.docTitle.uzLat + ' ' +
            item.docTitle.uzCyr + ' ' +
            item.docTitle.ru
          ).toLowerCase();

          for (const token of tokens) {
            if (token.length >= 4 && titleStr.includes(token)) {
              score += 3;
            }
          }

          // Clean URL of any historical params
          const { cleanUrl } = this.cleanLexUrl(item.cleanOfficialUrl || item.officialUrl);

          // Only accept results with genuine relevance (score >= 4 or matched keywords)
          if (score >= 4 || matchedKeywords.length > 0) {
            results.push({
              item,
              score,
              matchedKeywords: Array.from(new Set(matchedKeywords)),
              cleanUrl,
              isCurrentEditionVerified: item.isCurrentEdition && item.legalStatus === 'IN_FORCE',
              editionStatus: item.legalStatus,
              statusNotice: item.legalStatus === 'IN_FORCE' ? 'Amaldagi tahrir tasdiqlangan' : undefined,
            });
          }
        }

        // Sort descending by score
        results.sort((a, b) => b.score - a.score);
        return results;
      },
      () => []
    );
  }

  /**
   * Retrieve by specific category directly (strictly current in-force)
   */
  public getByCategory(category: string): VerifiedLegalItem | undefined {
    return VERIFIED_LEGAL_CORPUS.find(
      (item) => item.category === category && item.source === 'LEX_UZ' && item.legalStatus === 'IN_FORCE'
    );
  }
}

export const lexUzProvider = new LexUzProvider();

