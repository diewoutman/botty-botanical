import type { Plant, PlantDetail } from '../types';
import { StorageService } from './StorageService';

function mergePlantWithDetail(plant: Plant, detail: PlantDetail): Plant {
  const merged: Plant = {
    ...plant,
    taxonomy: { ...plant.taxonomy },
    traits: { ...plant.traits },
  };

  const family = detail.general.family?.trim();
  if (family) {
    merged.taxonomy.family = family;
  }

  const growthHabit = detail.general.growthHabit?.trim();
  if (growthHabit) {
    merged.traits.growthHabit = growthHabit;
  }

  if (detail.general.nativeRange?.length) {
    merged.traits.nativeRange = detail.general.nativeRange.join(', ');
  }

  if (!merged.thumbnail) {
    const firstImage = detail.images[0];
    const fallbackImage = firstImage?.thumbnailUrl || firstImage?.url;
    if (fallbackImage) {
      merged.thumbnail = fallbackImage;
    }
  }

  return merged;
}

export const LearningPlantDataService = {
  async composePlantsWithCachedDetails(plants: Plant[]): Promise<Plant[]> {
    if (!plants.length) return plants;

    const enrichedById = new Map<string, Plant>();

    await Promise.all(
      plants.map(async (plant) => {
        if (!plant.id.startsWith('ext_')) return;

        try {
          const detail = await StorageService.getPlant(plant.id);
          if (!detail) return;
          enrichedById.set(plant.id, mergePlantWithDetail(plant, detail));
        } catch {
          return;
        }
      })
    );

    if (enrichedById.size === 0) return plants;

    return plants.map((plant) => enrichedById.get(plant.id) || plant);
  },
};
