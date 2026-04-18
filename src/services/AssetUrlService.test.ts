import { describe, it, expect } from 'vitest';
import { buildAssetUrl } from './AssetUrlService';

describe('AssetUrlService', () => {
  it('builds asset URL for root deployments', () => {
    expect(buildAssetUrl('assets/data/plants-core.json', '/')).toBe('/assets/data/plants-core.json');
  });

  it('builds asset URL for GitHub Pages subpath deployments', () => {
    expect(buildAssetUrl('assets/data/plants-core.json', '/Botty Botanical/')).toBe('/Botty Botanical/assets/data/plants-core.json');
  });

  it('normalizes leading slash in asset path', () => {
    expect(buildAssetUrl('/assets/data/plants-detail.json', '/repo/')).toBe('/repo/assets/data/plants-detail.json');
  });
});
