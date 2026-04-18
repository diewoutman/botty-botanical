import type { PlantDetail } from '../types';
import { buildAssetUrl } from './AssetUrlService';

let coreDetails: Record<string, PlantDetail> = {};
let initialized = false;
let initPromise: Promise<void> | null = null;

export const PlantDetailService = {
  async initialize(): Promise<void> {
    if (initialized) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        const response = await fetch(buildAssetUrl('assets/data/plants-detail.json'));
        console.log('PlantDetailService: fetch status', response.status, response.ok);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const details: PlantDetail[] = await response.json();
        coreDetails = {};
        for (const d of details) {
          coreDetails[d.id] = d;
        }
        console.log(`Planten Kennis: Loaded details for ${details.length} plants`);
        initialized = true;
      } catch (err) {
        console.error('Failed to load plant details:', err);
        coreDetails = {};
        initialized = true;
      }
    })();

    return initPromise;
  },

  getPlantDetailById(id: string): PlantDetail | null {
    return coreDetails[id] || null;
  },
};