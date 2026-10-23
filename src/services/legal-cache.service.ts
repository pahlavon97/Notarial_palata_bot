import * as crypto from 'crypto';
import { Logger } from '../core/logger/logger';

export interface CacheEntry<T> {
  key: string;
  queryHash: string;
  docId: string;
  editionStatus: string;
  effectiveDate?: string;
  language: string;
  cachedAt: number;
  expiresAt: number;
  data: T;
  isDegraded?: boolean;
}

export class LegalCacheService {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private logger = new Logger('LegalCacheService');
  private readonly defaultTtlMs: number;

  constructor(defaultTtlSeconds = 86400) {
    this.defaultTtlMs = defaultTtlSeconds * 1000;
  }

  /**
   * Generates a deterministic SHA-256 hash from normalized query
   */
  public generateQueryHash(query: string): string {
    const normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');
    return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
  }

  /**
   * Creates a cache key binding query hash, docId, editionStatus, and language
   */
  public buildKey(params: {
    queryHash: string;
    docId?: string;
    category?: string;
    editionStatus?: string;
    language?: string;
  }): string {
    const doc = params.docId || 'NONE';
    const cat = params.category || 'ALL';
    const edition = params.editionStatus || 'CURRENT';
    const lang = params.language || 'UZ_LATIN';
    return `legal:${params.queryHash}:${cat}:${doc}:${edition}:${lang}`;
  }

  /**
   * Retrieve cached data. Returns null if expired or not found.
   */
  public get<T>(key: string, isProviderDown = false): { data: T; isDegraded: boolean } | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) {
      return null;
    }

    const now = Date.now();
    // If expired
    if (now > entry.expiresAt) {
      // If external provider is down, we might serve degraded cache BUT never claim it as current
      if (isProviderDown) {
        this.logger.warn(`External provider is down. Returning degraded expired cache for key: ${key}`);
        return { data: entry.data, isDegraded: true };
      }
      this.cache.delete(key);
      return null;
    }

    // If external provider is down even for fresh cache, flag it as degraded
    return {
      data: entry.data,
      isDegraded: isProviderDown || !!entry.isDegraded,
    };
  }

  /**
   * Store data in cache with edition metadata
   */
  public set<T>(params: {
    key: string;
    queryHash: string;
    docId?: string;
    editionStatus?: string;
    effectiveDate?: string;
    language?: string;
    data: T;
    ttlSeconds?: number;
    isDegraded?: boolean;
  }): void {
    const now = Date.now();
    const ttl = (params.ttlSeconds ? params.ttlSeconds * 1000 : this.defaultTtlMs);

    const entry: CacheEntry<T> = {
      key: params.key,
      queryHash: params.queryHash,
      docId: params.docId || 'NONE',
      editionStatus: params.editionStatus || 'CURRENT',
      effectiveDate: params.effectiveDate,
      language: params.language || 'UZ_LATIN',
      cachedAt: now,
      expiresAt: now + ttl,
      data: params.data,
      isDegraded: params.isDegraded,
    };

    this.cache.set(params.key, entry as CacheEntry<unknown>);
  }

  /**
   * Invalidate all cache entries associated with a specific document ID.
   * Called immediately when a new edition or status change is detected.
   */
  public invalidateDoc(docId: string): number {
    let count = 0;
    const cleanId = docId.trim();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.docId === cleanId || key.includes(`:${cleanId}:`)) {
        this.cache.delete(key);
        count++;
      }
    }
    this.logger.info(`Invalidated ${count} cache entries for docId: ${docId}`);
    return count;
  }

  /**
   * Clear all cache entries
   */
  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

export const legalCacheService = new LegalCacheService();
