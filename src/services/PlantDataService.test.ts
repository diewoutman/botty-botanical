import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlantDataService } from './PlantDataService';
import { PlantApiService } from './PlantApiService';
import { StorageService } from './StorageService';

describe('PlantDataService external detail caching', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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
});
