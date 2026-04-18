import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LearningPlantDataService } from './LearningPlantDataService';
import { StorageService } from './StorageService';
import type { Plant } from '../types';

function makeExternalPlant(id: string): Plant {
  return {
    id,
    latinName: `Plant ${id}`,
    names: { en: `Plant ${id}` },
    taxonomy: {
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      class: 'Magnoliopsida',
      order: 'Rosales',
      family: 'OriginalFamily',
      genus: 'Plantus',
      species: 'Plantus species',
    },
    traits: {
      growthHabit: 'OriginalHabit',
      nativeRange: 'OriginalRange',
    },
    thumbnail: null,
    category: 'flower',
    popularityScore: 0,
    isExternal: true,
  };
}

describe('LearningPlantDataService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('reuses cached detail data to enrich external plants', async () => {
    const plants = [makeExternalPlant('ext_1')];

    vi.spyOn(StorageService, 'getPlant').mockResolvedValue({
      id: 'ext_1',
      general: {
        description: { en: 'desc' },
        family: 'CachedFamily',
        nativeRange: ['Europe', 'Asia'],
        growthHabit: 'CachedHabit',
      },
      deep: null,
      images: [{
        url: 'https://example.com/full.jpg',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        photographer: 'Unknown',
        license: 'CC',
        sourceUrl: 'https://example.com/full.jpg',
      }],
      sources: [],
    });

    const merged = await LearningPlantDataService.composePlantsWithCachedDetails(plants);

    expect(merged[0]?.taxonomy.family).toBe('CachedFamily');
    expect(merged[0]?.traits.growthHabit).toBe('CachedHabit');
    expect(merged[0]?.traits.nativeRange).toBe('Europe, Asia');
    expect(merged[0]?.thumbnail).toBe('https://example.com/thumb.jpg');
  });

  it('falls back to bundled plants when cache read fails', async () => {
    const plants = [makeExternalPlant('ext_2')];
    vi.spyOn(StorageService, 'getPlant').mockRejectedValue(new Error('broken cache'));

    const merged = await LearningPlantDataService.composePlantsWithCachedDetails(plants);

    expect(merged).toEqual(plants);
  });

  it('applies consistent precedence across repeated composition calls', async () => {
    const plants = [makeExternalPlant('ext_3')];

    vi.spyOn(StorageService, 'getPlant').mockResolvedValue({
      id: 'ext_3',
      general: {
        description: { en: 'desc' },
        family: 'ConsistentFamily',
        nativeRange: ['Africa'],
        growthHabit: 'ConsistentHabit',
      },
      deep: null,
      images: [],
      sources: [],
    });

    const studyMerged = await LearningPlantDataService.composePlantsWithCachedDetails(plants);
    const quizMerged = await LearningPlantDataService.composePlantsWithCachedDetails(plants);

    expect(studyMerged[0]?.taxonomy.family).toBe('ConsistentFamily');
    expect(quizMerged[0]?.taxonomy.family).toBe('ConsistentFamily');
    expect(studyMerged[0]?.traits.growthHabit).toBe(quizMerged[0]?.traits.growthHabit);
  });
});
