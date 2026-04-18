import type { Plant, PlantDetail } from '../types';
import { StorageService } from './StorageService';
import { PlantApiService } from './PlantApiService';

const BACKGROUND_TARGET = 1000;
const BACKGROUND_PAGE_SIZE = 50;

let coreData: Plant[] = [];
let externalData: Plant[] = [];
let initialized = false;
let initPromise: Promise<void> | null = null;
let backgroundLoading = false;
let externalLoadedCount = 0;

function toPlantCategory(title: string): Plant['category'] {
  const t = title.toLowerCase();
  if (t.includes('tree')) return 'tree';
  if (t.includes('shrub')) return 'shrub';
  if (t.includes('grass')) return 'grass';
  if (t.includes('fern')) return 'fern';
  if (t.includes('flower') || t.includes('rose') || t.includes('lily') || t.includes('orchid')) return 'flower';
  return 'other';
}

function mapExternalResultToPlant(result: { title: string; snippet: string; pageId: number }): Plant {
  const latinName = result.title;
  return {
    id: `ext_${result.pageId}`,
    latinName,
    names: {
      nl: result.title,
      en: result.title,
      de: '',
      fr: '',
      es: '',
    },
    taxonomy: {
      kingdom: 'Plantae',
      phylum: '',
      class: '',
      order: '',
      family: '',
      genus: latinName.split(' ')[0] || latinName,
      species: latinName,
    },
    traits: {},
    thumbnail: null,
    category: toPlantCategory(result.title),
    popularityScore: 0,
    isExternal: true,
    wikiPageId: result.pageId,
  };
}

export const PlantDataService = {
  async initialize(): Promise<void> {
    if (initialized) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        const coreResponse = await fetch('/assets/data/plants-core.json');
        console.log('PlantDataService: fetch status', coreResponse.status, coreResponse.ok);
        if (!coreResponse.ok) throw new Error(`HTTP ${coreResponse.status}`);
        coreData = await coreResponse.json();
        console.log(`Planten Kennis: Loaded ${coreData.length} plants`);
        initialized = true;
      } catch (err) {
        console.error('Failed to load plant data:', err);
        coreData = [];
        initialized = true;
      }
    })();

    return initPromise;
  },

  async startBackgroundExternalLoad(onUpdate?: (count: number) => void): Promise<void> {
    if (backgroundLoading) return;
    if (externalLoadedCount >= BACKGROUND_TARGET) return;
    backgroundLoading = true;

    const querySeeds = ['plant', 'flower', 'tree', 'herb', 'grass'];
    const seen = new Set<string>([...coreData.map(p => p.id), ...externalData.map(p => p.id)]);

    try {
      for (const seed of querySeeds) {
        let offset = 0;
        while (externalLoadedCount < BACKGROUND_TARGET) {
          const results = await PlantApiService.searchExternalPlants(seed, BACKGROUND_PAGE_SIZE, offset);
          if (results.length === 0) break;

          const mapped = results
            .map(mapExternalResultToPlant)
            .filter(p => !seen.has(p.id));

          if (mapped.length === 0) {
            offset += BACKGROUND_PAGE_SIZE;
            continue;
          }

          mapped.forEach(p => seen.add(p.id));
          externalData = [...externalData, ...mapped];
          externalLoadedCount = externalData.length;
          onUpdate?.(externalLoadedCount);

          for (const p of mapped.slice(0, 10)) {
            if (!p.wikiPageId) continue;
            PlantApiService.fetchPlantDetails(p.wikiPageId)
              .then(detail => {
                if (!detail) return;
                const idx = externalData.findIndex(ep => ep.id === p.id);
                if (idx === -1) return;
                const next = [...externalData];
                const current = next[idx];
                if (!current) return;
                next[idx] = {
                  ...current,
                  thumbnail: detail.thumbnail,
                };
                externalData = next;
              })
              .catch(() => undefined);
          }

          offset += BACKGROUND_PAGE_SIZE;
        }
      }
    } finally {
      backgroundLoading = false;
    }
  },

  getBundledPlants(): Plant[] {
    return [...coreData, ...externalData];
  },

  getExternalLoadedCount(): number {
    return externalLoadedCount;
  },

  getPlantById(id: string): Plant | undefined {
    return [...coreData, ...externalData].find(p => p.id === id);
  },

  searchBundledPlants(query: string): Plant[] {
    const all = [...coreData, ...externalData];
    if (!query.trim()) return all;
    const q = query.toLowerCase().trim();
    return all.filter(plant => {
      const latinMatch = plant.latinName.toLowerCase().includes(q);
      const nameMatch = Object.values(plant.names).some(name =>
        name.toLowerCase().includes(q)
      );
      const familyMatch = plant.taxonomy?.family?.toLowerCase().includes(q) ?? false;
      return latinMatch || nameMatch || familyMatch;
    });
  },

  async searchExternal(query: string) {
    return PlantApiService.searchExternalPlants(query, 20, 0);
  },

  async fetchExternalPlantDetails(pageId: number): Promise<PlantDetail | null> {
    const cached = await StorageService.getPlant(`ext_${pageId}`);
    if (cached) return cached;

    const wikiData = await PlantApiService.fetchPlantDetails(pageId);
    if (!wikiData) return null;

    const images = await PlantApiService.fetchWikimediaImages(wikiData.title);

    const detail: PlantDetail = {
      id: `ext_${pageId}`,
      general: {
        description: { en: wikiData.extract },
        family: '',
        nativeRange: [],
        growthHabit: '',
      },
      deep: null,
      images: images.map(img => ({
        url: img.url,
        thumbnailUrl: img.thumbnailUrl ?? undefined,
        photographer: img.photographer,
        license: img.license,
        sourceUrl: img.url,
      })),
      sources: [
        { name: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiData.title)}` },
      ],
    };

    await StorageService.setPlant(`ext_${pageId}`, detail);
    return detail;
  },
};