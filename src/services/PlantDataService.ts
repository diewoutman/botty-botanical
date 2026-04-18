import type { Plant, PlantDetail } from '../types';
import { StorageService } from './StorageService';
import { PlantApiService, type RejectionReason } from './PlantApiService';
import { buildAssetUrl } from './AssetUrlService';

const INGESTION_CONFIG = {
  target: 1000,
  pageSize: 50,
  querySeeds: ['plant', 'flower', 'tree', 'herb', 'grass', 'wildflower', 'fern', 'moss', 'orchid'],
};

let debugLastAcceptedSample: string[] = [];

type IngestionMetrics = {
  accepted: number;
  rejected: number;
  reasons: Record<RejectionReason, number>;
};

let coreData: Plant[] = [];
let externalData: Plant[] = [];
let pendingExternal = new Set<string>();
let initialized = false;
let initPromise: Promise<void> | null = null;
let backgroundLoading = false;
let externalLoadedCount = 0;
let ingestionMetrics: IngestionMetrics = {
  accepted: 0,
  rejected: 0,
  reasons: {
    keyword_reject: 0,
    disambiguation_or_list: 0,
    no_gbif_match: 0,
    non_plantae: 0,
    low_confidence: 0,
  },
};

function toPlantCategory(title: string): Plant['category'] {
  const t = title.toLowerCase();
  if (t.includes('tree')) return 'tree';
  if (t.includes('shrub')) return 'shrub';
  if (t.includes('grass')) return 'grass';
  if (t.includes('fern')) return 'fern';
  if (t.includes('flower') || t.includes('rose') || t.includes('lily') || t.includes('orchid')) return 'flower';
  return 'other';
}

function mapExternalResultToPlant(result: { title: string; snippet: string; pageId: number }, taxonomy: Plant['taxonomy']): Plant {
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
    taxonomy,
    traits: {},
    thumbnail: null,
    category: toPlantCategory(result.title),
    popularityScore: 0,
    isExternal: true,
    wikiPageId: result.pageId,
  };
}

function recordRejection(reason: RejectionReason) {
  ingestionMetrics.rejected += 1;
  ingestionMetrics.reasons[reason] += 1;
}

export const PlantDataService = {
  async initialize(): Promise<void> {
    if (initialized) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        const coreResponse = await fetch(buildAssetUrl('assets/data/plants-core.json'));
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
    if (externalLoadedCount >= INGESTION_CONFIG.target) return;
    backgroundLoading = true;
    debugLastAcceptedSample = [];

    const seen = new Set<string>([...coreData.map(p => p.id), ...externalData.map(p => p.id)]);

    try {
      for (const seed of INGESTION_CONFIG.querySeeds) {
        let offset = 0;
        while (externalLoadedCount < INGESTION_CONFIG.target) {
          const results = await PlantApiService.searchExternalPlants(seed, INGESTION_CONFIG.pageSize, offset);
          if (results.length === 0) break;

          const acceptedBatch: Plant[] = [];

          for (const result of results) {
            const id = `ext_${result.pageId}`;
            if (seen.has(id) || pendingExternal.has(id)) continue;

            const prefilter = PlantApiService.isCandidateRelevant(result.title, result.snippet);
            if (!prefilter.accepted) {
              recordRejection(prefilter.reason!);
              continue;
            }

            pendingExternal.add(id);
            const validation = await PlantApiService.validateBotanicalCandidate(result.title);
            pendingExternal.delete(id);

            if (!validation.accepted || !validation.taxonomy) {
              recordRejection(validation.reason || 'no_gbif_match');
              continue;
            }

            const mapped = mapExternalResultToPlant(result, {
              kingdom: validation.taxonomy.kingdom || 'Plantae',
              phylum: validation.taxonomy.phylum || '',
              class: validation.taxonomy.class || '',
              order: validation.taxonomy.order || '',
              family: validation.taxonomy.family || '',
              genus: validation.taxonomy.genus || result.title.split(' ')[0] || result.title,
              species: validation.taxonomy.species || result.title,
            });

            acceptedBatch.push(mapped);
            seen.add(mapped.id);
            ingestionMetrics.accepted += 1;
            if (debugLastAcceptedSample.length < 10) {
              debugLastAcceptedSample.push(mapped.latinName);
            }

            if (acceptedBatch.length >= INGESTION_CONFIG.pageSize || externalLoadedCount + acceptedBatch.length >= INGESTION_CONFIG.target) {
              break;
            }
          }

          if (acceptedBatch.length > 0) {
            externalData = [...externalData, ...acceptedBatch];
            externalLoadedCount = externalData.length;
            onUpdate?.(externalLoadedCount);

            acceptedBatch.slice(0, 10).forEach((p) => {
              if (!p.wikiPageId) return;
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
                  onUpdate?.(externalData.length);
                })
                .catch(() => undefined);
            });
          }

          offset += INGESTION_CONFIG.pageSize;
          if (externalLoadedCount >= INGESTION_CONFIG.target) break;
        }
        if (externalLoadedCount >= INGESTION_CONFIG.target) break;
      }

      console.log('Ingestion summary:', {
        accepted: ingestionMetrics.accepted,
        rejected: ingestionMetrics.rejected,
        reasons: ingestionMetrics.reasons,
        acceptedSample: debugLastAcceptedSample,
      });
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

  getIngestionMetrics(): IngestionMetrics {
    return {
      accepted: ingestionMetrics.accepted,
      rejected: ingestionMetrics.rejected,
      reasons: { ...ingestionMetrics.reasons },
    };
  },

  isBackgroundLoading(): boolean {
    return backgroundLoading;
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