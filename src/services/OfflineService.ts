import { StorageService } from './StorageService';
import { PlantApiService } from './PlantApiService';
import type { PlantDetail } from '../types';

export const OfflineService = {
  async cacheExternalPlant(pageId: number): Promise<PlantDetail | null> {
    const existing = await StorageService.getPlant(`ext_${pageId}`);
    if (existing) return existing;

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

  async downloadAllForOffline(
    onProgress?: (current: number, total: number) => void
  ): Promise<{ downloaded: number; errors: number }> {
    const cachedIds = await StorageService.getCachedPlantIds();
    let downloaded = 0;
    let errors = 0;

    for (let i = 0; i < cachedIds.length; i++) {
      try {
        if (cachedIds[i] && cachedIds[i]!.startsWith('ext_')) {
          const pageId = parseInt(cachedIds[i]!.replace('ext_', ''), 10);
          const detail = await OfflineService.cacheExternalPlant(pageId);
          if (detail) {
            downloaded++;
          }
        }
        onProgress?.(i + 1, cachedIds.length);
      } catch {
        errors++;
      }
    }

    return { downloaded, errors };
  },

  async getStorageInfo(): Promise<{ used: number; details: Record<string, number> }> {
    return StorageService.getStorageUsage();
  },

  async clearAllCachedData(): Promise<void> {
    return StorageService.clearCachedData();
  },

  async checkStorageQuota(): Promise<{ usage: number; quota: number; percentage: number }> {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? (usage / quota) * 100 : 0;
      return { usage, quota, percentage };
    }
    const storageInfo = await OfflineService.getStorageInfo();
    return { usage: storageInfo.used, quota: 0, percentage: 0 };
  },
};