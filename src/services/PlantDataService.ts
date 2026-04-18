import type { Plant, PlantDetail } from '../types';
import { StorageService } from './StorageService';
import { PlantApiService } from './PlantApiService';

let coreData: Plant[] = [];
let initialized = false;
let initPromise: Promise<void> | null = null;

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

  getBundledPlants(): Plant[] {
    return coreData;
  },

  getPlantById(id: string): Plant | undefined {
    return coreData.find(p => p.id === id);
  },

  searchBundledPlants(query: string): Plant[] {
    if (!query.trim()) return coreData;
    const q = query.toLowerCase().trim();
    return coreData.filter(plant => {
      const latinMatch = plant.latinName.toLowerCase().includes(q);
      const nameMatch = Object.values(plant.names).some(name =>
        name.toLowerCase().includes(q)
      );
      const familyMatch = plant.taxonomy?.family?.toLowerCase().includes(q) ?? false;
      return latinMatch || nameMatch || familyMatch;
    });
  },

  async searchExternal(query: string) {
    return PlantApiService.searchExternalPlants(query);
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