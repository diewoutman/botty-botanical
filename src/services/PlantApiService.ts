const WIKI_API_BASE = 'https://en.wikipedia.org/w/api.php';
const GBIF_API_BASE = 'https://api.gbif.org/v1';

const RATE_LIMIT_MS = 1000;
let lastRequestTime = 0;

async function rateLimitedFetch(url: string, signal?: AbortSignal): Promise<Response> {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < RATE_LIMIT_MS) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLast));
  }
  lastRequestTime = Date.now();
  return fetch(url, { signal });
}

async function fetchWithRetry(url: string, retries = 3, signal?: AbortSignal): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await rateLimitedFetch(url, signal);
      if (response.ok) return response;
      if (response.status === 429) {
        const backoff = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoff));
        continue;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
    }
  }
  throw new Error('Max retries exceeded');
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

export const PlantApiService = {
  async searchWikipedia(query: string): Promise<WikiSearchResult[]> {
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: query,
      srlimit: '10',
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

  async searchExternalPlants(query: string): Promise<ExtPlantResult[]> {
    const wikiResults = await this.searchWikipedia(query);
    return wikiResults.map(r => ({
      title: r.title,
      snippet: r.snippet,
      pageId: r.pageId,
    }));
  },
};