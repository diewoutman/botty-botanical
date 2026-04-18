import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlantDataService } from './PlantDataService';
import { PlantApiService } from './PlantApiService';
import { StorageService } from './StorageService';

describe('PlantDataService external detail caching', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('reuses cached external detail without refetching', async () => {
    const cachedDetail = {
      id: 'ext_42',
      general: { description: { en: 'cached' }, family: '', nativeRange: [], growthHabit: '' },
      deep: null,
      images: [],
      sources: [],
    };

    vi.spyOn(StorageService, 'getPlant').mockResolvedValue(cachedDetail);
    const fetchPlantDetailsSpy = vi.spyOn(PlantApiService, 'fetchPlantDetails');
    const fetchImagesSpy = vi.spyOn(PlantApiService, 'fetchWikimediaImages');

    const result = await PlantDataService.fetchExternalPlantDetails(42);

    expect(result).toEqual(cachedDetail);
    expect(fetchPlantDetailsSpy).not.toHaveBeenCalled();
    expect(fetchImagesSpy).not.toHaveBeenCalled();
  });

  it('returns detail even when cache persistence fails', async () => {
    vi.spyOn(StorageService, 'getPlant').mockResolvedValue(null);
    vi.spyOn(PlantApiService, 'fetchPlantDetails').mockResolvedValue({
      title: 'Rosa canina',
      extract: 'A species of rose',
      thumbnail: null,
      categories: [],
      images: [],
    });
    vi.spyOn(PlantApiService, 'fetchWikimediaImages').mockResolvedValue([]);
    vi.spyOn(StorageService, 'setPlant').mockRejectedValue(new Error('storage full'));

    const result = await PlantDataService.fetchExternalPlantDetails(42);

    expect(result).toBeTruthy();
    expect(result?.id).toBe('ext_42');
    expect(result?.general.description.en).toBe('A species of rose');
  });

  it('searchExternal returns known local plant and skips remote search', async () => {
    const mockedFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ([{
        id: 'core_1',
        latinName: 'Rosa canina',
        names: { nl: 'Rosa canina', en: 'Dog rose', de: '', fr: '', es: '' },
        taxonomy: { kingdom: 'Plantae', phylum: '', class: '', order: '', family: 'Rosaceae', genus: 'Rosa', species: 'Rosa canina' },
        traits: {},
        thumbnail: null,
        category: 'flower',
        popularityScore: 1,
        isExternal: false,
        wikiPageId: 42,
      }]),
    });
    globalThis.fetch = mockedFetch as typeof globalThis.fetch;

    await PlantDataService.initialize();

    const remoteSpy = vi.spyOn(PlantApiService, 'searchExternalPlants').mockResolvedValue([]);
    const result = await PlantDataService.searchExternal('Rosa canina');

    expect(result).toEqual([{ title: 'Rosa canina', snippet: 'Known plant', pageId: 42 }]);
    expect(remoteSpy).not.toHaveBeenCalled();
  });

  it('searchExternal uses remote search when plant is unknown locally', async () => {
    const mockedFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ([{
        id: 'core_1',
        latinName: 'Rosa canina',
        names: { nl: 'Rosa canina', en: 'Dog rose', de: '', fr: '', es: '' },
        taxonomy: { kingdom: 'Plantae', phylum: '', class: '', order: '', family: 'Rosaceae', genus: 'Rosa', species: 'Rosa canina' },
        traits: {},
        thumbnail: null,
        category: 'flower',
        popularityScore: 1,
        isExternal: false,
        wikiPageId: 42,
      }]),
    });
    globalThis.fetch = mockedFetch as typeof globalThis.fetch;

    await PlantDataService.initialize();

    const remoteResults = [{ title: 'Lavandula', snippet: 'Lavender', pageId: 77 }];
    const remoteSpy = vi.spyOn(PlantApiService, 'searchExternalPlants').mockResolvedValue(remoteResults);
    vi.spyOn(PlantApiService, 'isCandidateRelevant').mockReturnValue({ accepted: true });
    vi.spyOn(PlantApiService, 'validateBotanicalCandidate').mockResolvedValue({
      accepted: true,
      taxonomy: {
        usageKey: 1,
        kingdom: 'Plantae',
        phylum: '',
        class: '',
        order: '',
        family: 'Lamiaceae',
        genus: 'Lavandula',
        species: 'Lavandula angustifolia',
        matchType: 'EXACT',
        confidence: 100,
      },
    });

    const result = await PlantDataService.searchExternal('Lavandula');

    expect(result).toEqual(remoteResults);
    expect(remoteSpy).toHaveBeenCalledWith('Lavandula', 20, 0);
  });
});
