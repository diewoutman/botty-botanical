import localforage from 'localforage';
import type { PlantDetail } from '../types';

const MAX_CACHE_ENTRIES = 200;

const store = localforage.createInstance({
  name: 'planten-kennis',
  storeName: 'plant_data',
  description: 'Planten Kennis offline data store',
});

const imageStore = localforage.createInstance({
  name: 'planten-kennis',
  storeName: 'plant_images',
  description: 'Planten Kennis image cache',
});

const settingsStore = localforage.createInstance({
  name: 'planten-kennis',
  storeName: 'settings',
  description: 'Planten Kennis user settings',
});

const accessTimes = new Map<string, number>();

function touchKey(key: string) {
  accessTimes.set(key, Date.now());
}

async function evictIfNeeded() {
  const keys = await store.keys();
  const dataKeys = keys.filter(k => k.startsWith('plant_detail_'));
  if (dataKeys.length <= MAX_CACHE_ENTRIES) return;

  const entries = dataKeys
    .map(k => ({ key: k, time: accessTimes.get(k) ?? 0 }))
    .sort((a, b) => a.time - b.time);

  const toRemove = entries.slice(0, dataKeys.length - MAX_CACHE_ENTRIES);
  for (const entry of toRemove) {
    await store.removeItem(entry.key);
    accessTimes.delete(entry.key);
  }
}

export const StorageService = {
  async getPlant(id: string): Promise<PlantDetail | null> {
    const key = `plant_detail_${id}`;
    const result = await store.getItem<PlantDetail>(key);
    if (result) touchKey(key);
    return result;
  },

  async setPlant(id: string, data: PlantDetail): Promise<void> {
    const key = `plant_detail_${id}`;
    await store.setItem(key, data);
    touchKey(key);
    await evictIfNeeded();
  },

  async getPlantImage(id: string): Promise<string | null> {
    return imageStore.getItem<string>(`img_${id}`);
  },

  async setPlantImage(id: string, dataUrl: string): Promise<void> {
    await imageStore.setItem(`img_${id}`, dataUrl);
  },

  async getSetting<T>(key: string): Promise<T | null> {
    return settingsStore.getItem<T>(key);
  },

  async setSetting<T>(key: string, value: T): Promise<void> {
    await settingsStore.setItem(key, value);
  },

  async getQuizHighScore(): Promise<number> {
    return (await settingsStore.getItem<number>('quiz_high_score')) ?? 0;
  },

  async setQuizHighScore(score: number): Promise<void> {
    await settingsStore.setItem('quiz_high_score', score);
  },

  async getCachedPlantIds(): Promise<string[]> {
    const keys = await store.keys();
    return keys.filter(k => k.startsWith('plant_detail_')).map(k => k.replace('plant_detail_', ''));
  },

  async getStorageUsage(): Promise<{ used: number; details: Record<string, number> }> {
    let storeSize = 0;
    let imageSize = 0;
    let settingsSize = 0;

    await store.iterate<unknown, void>((value) => {
      storeSize += JSON.stringify(value).length;
    });
    await imageStore.iterate<unknown, void>((value) => {
      imageSize += typeof value === 'string' ? value.length : 0;
    });
    await settingsStore.iterate<unknown, void>((value) => {
      settingsSize += JSON.stringify(value).length;
    });

    return {
      used: storeSize + imageSize + settingsSize,
      details: {
        plantData: storeSize,
        images: imageSize,
        settings: settingsSize,
      },
    };
  },

  async clearCachedData(): Promise<void> {
    await store.clear();
    await imageStore.clear();
  },
};