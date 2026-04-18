const WIKI_API_BASE = 'https://en.wikipedia.org/w/api.php';
const GBIF_API_BASE = 'https://api.gbif.org/v1';

const RATE_LIMIT_MS = 1000;
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 500;
let lastRequestTime = 0;

export class WikipediaTemporarilyUnavailableError extends Error {
  constructor() {
    super('Wikipedia is temporarily unavailable. Please try again shortly.');
    this.name = 'WikipediaTemporarilyUnavailableError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function jitteredBackoff(attempt: number): number {
  const base = BASE_RETRY_DELAY_MS * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 250);
  return base + jitter;
}

async function rateLimitedFetch(url: string, signal?: AbortSignal): Promise<Response> {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < RATE_LIMIT_MS) {
    await sleep(RATE_LIMIT_MS - timeSinceLast);
  }
  lastRequestTime = Date.now();
  return fetch(url, { signal });
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES, signal?: AbortSignal): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await rateLimitedFetch(url, signal);
      if (response.ok) return response;

      const retryableStatus = response.status === 429 || response.status >= 500;
      if (retryableStatus && attempt < retries - 1) {
        await sleep(jitteredBackoff(attempt));
        continue;
      }

      if (response.status === 429) {
        throw new WikipediaTemporarilyUnavailableError();
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (error instanceof WikipediaTemporarilyUnavailableError) {
        throw error;
      }
      if (attempt === retries - 1) throw error;
      await sleep(jitteredBackoff(attempt));
    }
  }
  throw new WikipediaTemporarilyUnavailableError();
}

export interface WikiSearchResult {
  title: string;
  snippet: string;
  pageId: number;
}

export interface WikiPlantData {
  title: string;
  extract: string;
  thumbnail: string | null;
  categories: string[];
  images: string[];
}

export interface WikiImage {
  url: string;
  thumbnailUrl: string | null;
  width: number;
  height: number;
  photographer: string;
  license: string;
}

export interface GbifTaxonomy {
  usageKey: number;
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  matchType: string;
  confidence: number;
}

export interface ExtPlantResult {
  title: string;
  snippet: string;
  pageId: number;
}

export type RejectionReason =
  | 'keyword_reject'
  | 'disambiguation_or_list'
  | 'no_gbif_match'
  | 'non_plantae'
  | 'low_confidence';

export interface ValidationResult {
  accepted: boolean;
  reason?: RejectionReason;
  taxonomy?: GbifTaxonomy;
}

const NON_BOTANICAL_TERMS = [
  'power plant',
  'plant milk',
  'milk',
  'human',
  'factory',
  'industrial',
  'protein',
  'food',
  'company',
  'album',
  'film',
  'song',
  'video game',
  'character',
];

const GBIF_CONFIDENCE_THRESHOLD = 70;

function normalizeNameForTaxonomy(input: string): string {
  const cleaned = input
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(var\.|subsp\.|ssp\.|f\.|cv\.)\b/gi, ' ')
    .replace(/[^a-zA-Z\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const parts = cleaned.split(' ').filter(Boolean);
  return parts.slice(0, 2).join(' ');
}

export const PlantApiService = {
  isCandidateRelevant(title: string, snippet: string): ValidationResult {
    const hay = `${title} ${snippet}`.toLowerCase();
    if (hay.includes('disambiguation') || hay.includes('list of')) {
      return { accepted: false, reason: 'disambiguation_or_list' };
    }
    if (NON_BOTANICAL_TERMS.some(term => hay.includes(term))) {
      return { accepted: false, reason: 'keyword_reject' };
    }
    return { accepted: true };
  },

  async validateBotanicalCandidate(title: string): Promise<ValidationResult> {
    const normalized = normalizeNameForTaxonomy(title) || title;
    const taxonomy = await this.fetchGbifTaxonomy(normalized);
    if (!taxonomy) return { accepted: false, reason: 'no_gbif_match' };
    if ((taxonomy.kingdom || '').toLowerCase() !== 'plantae') {
      return { accepted: false, reason: 'non_plantae', taxonomy };
    }
    if ((taxonomy.confidence || 0) < GBIF_CONFIDENCE_THRESHOLD) {
      return { accepted: false, reason: 'low_confidence', taxonomy };
    }
    return { accepted: true, taxonomy };
  },

  async searchWikipedia(query: string, limit = 10, offset = 0): Promise<WikiSearchResult[]> {
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: query,
      srlimit: String(limit),
      sroffset: String(offset),
      format: 'json',
      origin: '*',
    });

    const response = await fetchWithRetry(`${WIKI_API_BASE}?${params}`);
    const data = await response.json();

    return (data.query?.search || []).map((item: Record<string, unknown>) => ({
      title: item.title as string,
      snippet: (item.snippet as string || '').replace(/<[^>]*>/g, ''),
      pageId: item.pageid as number,
    }));
  },

  async fetchPlantDetails(pageId: number): Promise<WikiPlantData | null> {
    const params = new URLSearchParams({
      action: 'query',
      pageids: String(pageId),
      prop: 'extracts|pageimages|categories|images',
      exintro: 'false',
      explaintext: 'true',
      piprop: 'thumbnail',
      pithumbsize: '400',
      format: 'json',
      origin: '*',
    });

    try {
      const response = await fetchWithRetry(`${WIKI_API_BASE}?${params}`);
      const data = await response.json();
      const page = data.query?.pages?.[pageId];
      if (!page) return null;

      return {
        title: page.title,
        extract: page.extract || '',
        thumbnail: page.thumbnail?.source || null,
        categories: (page.categories || []).map((c: Record<string, string>) => c.title),
        images: (page.images || []).map((i: Record<string, string>) => i.title),
      };
    } catch (error) {
      if (error instanceof WikipediaTemporarilyUnavailableError) {
        return null;
      }
      throw error;
    }
  },

  async fetchWikimediaImages(title: string): Promise<WikiImage[]> {
    const params = new URLSearchParams({
      action: 'query',
      titles: title,
      generator: 'images',
      gimlimit: '10',
      prop: 'imageinfo',
      iiprop: 'url|extmetadata|size',
      iiurlwidth: '800',
      format: 'json',
      origin: '*',
    });

    try {
      const response = await fetchWithRetry(`${WIKI_API_BASE}?${params}`);
      const data = await response.json();
      const pages = data.query?.pages || {};

      const images: WikiImage[] = [];
      for (const page of Object.values(pages) as Record<string, unknown>[]) {
        if (!page.imageinfo || !Array.isArray(page.imageinfo)) continue;
        for (const info of page.imageinfo as Record<string, unknown>[]) {
          const extMetadata = info.extmetadata as Record<string, Record<string, string>> | undefined;
          images.push({
            url: info.url as string,
            thumbnailUrl: (info.thumburl as string) || null,
            width: info.width as number,
            height: info.height as number,
            photographer: extMetadata?.Artist?.value?.replace(/<[^>]*>/g, '') || '',
            license: extMetadata?.LicenseShortName?.value || 'Unknown',
          });
        }
      }
      return images;
    } catch {
      return [];
    }
  },

  async fetchGbifTaxonomy(name: string): Promise<GbifTaxonomy | null> {
    const params = new URLSearchParams({
      name: name,
      verbose: 'true',
    });

    try {
      const response = await fetchWithRetry(`${GBIF_API_BASE}/species/match?${params}`);
      const data = await response.json();

      if (data.matchType === 'NONE') return null;

      return {
        usageKey: data.usageKey,
        kingdom: data.kingdom || '',
        phylum: data.phylum || '',
        class: data.class_ || data['class'] || '',
        order: data.order || '',
        family: data.family || '',
        genus: data.genus || '',
        species: data.species || '',
        matchType: data.matchType,
        confidence: data.confidence || 0,
      };
    } catch {
      return null;
    }
  },

  async searchExternalPlants(query: string, limit = 10, offset = 0): Promise<ExtPlantResult[]> {
    try {
      const wikiResults = await this.searchWikipedia(query, limit, offset);
      return wikiResults.map(r => ({
        title: r.title,
        snippet: r.snippet,
        pageId: r.pageId,
      }));
    } catch (error) {
      if (error instanceof WikipediaTemporarilyUnavailableError) {
        return [];
      }
      throw error;
    }
  },
};