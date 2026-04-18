const PLACEHOLDER_COLORS: Record<string, string> = {
  Asteraceae: '#FFD700',
  Rosaceae: '#FF6B6B',
  Fabaceae: '#90EE90',
  Orchidaceae: '#DDA0DD',
  Lamiaceae: '#98FB98',
  Poaceae: '#F0E68C',
  Brassicaceae: '#FFFFE0',
  Apiaceae: '#FFE4B5',
  Solanaceae: '#DDA0DD',
  Liliaceae: '#FFB6C1',
  Betulaceae: '#DEB887',
  Fagaceae: '#8B4513',
  Pinaceae: '#2E8B57',
  Cupressaceae: '#556B2F',
  Salicaceae: '#90EE90',
  Aceraceae: '#32CD32',
  Oleaceae: '#AEEEEE',
  Ranunculaceae: '#FF69B4',
  Caryophyllaceae: '#FFB6C1',
  Scrophulariaceae: '#E6E6FA',
  Urticaceae: '#7CFC00',
  Plantaginaceae: '#90EE90',
};

const DEFAULT_COLOR = '#808080';

function getInitials(latinName: string): string {
  if (!latinName) return '??';
  const parts = latinName.split(' ');
  const firstPart = parts[0] || '';
  const secondPart = parts.length >= 2 ? (parts[1] || '') : '';
  if (secondPart) {
    const initials = (firstPart.charAt(0) + secondPart.charAt(0)).toUpperCase();
    return initials || '??';
  }
  return firstPart.substring(0, 2).toUpperCase() || '??';
}

function getFamilyColor(family: string | undefined): string {
  if (!family) return DEFAULT_COLOR;
  return PLACEHOLDER_COLORS[family] || DEFAULT_COLOR;
}

function generatePlaceholderSvg(latinName: string, family?: string): string {
  const color = getFamilyColor(family);
  const initials = getInitials(latinName);

  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${color}" opacity="0.3"/>
    <text x="200" y="200" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-size="80" font-weight="bold" fill="${color}">${initials}</text>
  </svg>`)}`;
}

export const ImageService = {
  getPlantThumbnail(plant: { thumbnail: string | null; latinName: string; taxonomy?: { family?: string } }): string {
    if (plant.thumbnail) return plant.thumbnail;
    return generatePlaceholderSvg(plant.latinName, plant.taxonomy?.family);
  },

  getPlaceholder(latinName: string, family?: string): string {
    return generatePlaceholderSvg(latinName, family);
  },

  async fetchImageWithFallback(
    primaryUrl: string | null | undefined,
    fallbacks: string[],
    latinName: string,
    family?: string
  ): Promise<string> {
    if (primaryUrl) {
      try {
        const response = await fetch(primaryUrl, { method: 'HEAD' });
        if (response.ok) return primaryUrl;
      } catch { /* continue */ }
    }

    for (const url of fallbacks) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) return url;
      } catch { /* continue */ }
    }

    return generatePlaceholderSvg(latinName, family);
  },

  async prefetchImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = url;
      });
    });
    await Promise.allSettled(promises);
  },
};