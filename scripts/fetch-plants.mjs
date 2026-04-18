import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/data');
const IMAGES_DIR = path.resolve(__dirname, '../public/assets/images/thumbs');

const RATE_LIMIT_MS = 1100;
let lastRequestTime = 0;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const wait = Math.max(0, RATE_LIMIT_MS - (now - lastRequestTime));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastRequestTime = Date.now();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  return response;
}

interface WikiSearchResult {
  title: string;
  pageid: number;
  snippet: string;
}

interface GbifMatch {
  usageKey: number;
  scientificName: string;
  kingdom: string;
  phylum: string;
  class_: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  matchType: string;
  confidence: number;
}

interface ProcessedPlant {
  id: string;
  latinName: string;
  names: Record<string, string>;
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  traits: Record<string, string>;
  thumbnail: string | null;
  category: string;
  popularityScore: number;
  description: Record<string, string>;
  deep: {
    history: Record<string, string>;
    etymology: Record<string, string>;
    culturalSignificance: Record<string, string>;
    usesTraditional: string[];
    usesModern: string[];
    conservationStatus: string;
  } | null;
  images: { url: string; photographer: string; license: string; sourceUrl: string }[];
  sources: { name: string; url: string }[];
}

const DUTCH_PRIORITY_PLANTS: { latinName: string; dutchName: string; priority: number }[] = [
  { latinName: 'Tulipa gesneriana', dutchName: 'Tulp', priority: 100 },
  { latinName: 'Narcissus pseudonarcissus', dutchName: 'Narcis', priority: 100 },
  { latinName: 'Hyacinthus orientalis', dutchName: 'Hyacint', priority: 100 },
  { latinName: 'Crocus vernus', dutchName: 'Krokus', priority: 100 },
  { latinName: 'Convallaria majalis', dutchName: 'Lelietje-van-dalen', priority: 100 },
  { latinName: 'Quercus robur', dutchName: 'Zomereik', priority: 95 },
  { latinName: 'Fagus sylvatica', dutchName: 'Beuk', priority: 95 },
  { latinName: 'Urtica dioica', dutchName: 'Brandnetel', priority: 90 },
  { latinName: 'Taraxacum officinale', dutchName: 'Paardenbloem', priority: 95 },
  { latinName: 'Plantago major', dutchName: 'Wegerich', priority: 90 },
  { latinName: 'Helianthus annuus', dutchName: 'Zonnebloem', priority: 90 },
  { latinName: 'Trifolium repens', dutchName: 'Witte klaver', priority: 85 },
  { latinName: 'Bellis perennis', dutchName: 'Margriet', priority: 85 },
  { latinName: 'Rosa canina', dutchName: 'Wilde roos', priority: 85 },
  { latinName: 'Acer platanoides', dutchName: 'Noorse esdoorn', priority: 80 },
  { latinName: 'Betula pendula', dutchName: 'Zilverberk', priority: 80 },
  { latinName: 'Salix alba', dutchName: 'Witte wilg', priority: 80 },
  { latinName: 'Prunus avium', dutchName: 'Wilde kersenboom', priority: 75 },
  { latinName: 'Sambucus nigra', dutchName: 'Vlier', priority: 80 },
  { latinName: 'Crataegus monogyna', dutchName: 'Eenstijlige meidoorn', priority: 75 },
  { latinName: 'Alnus glutinosa', dutchName: 'Zwarte els', priority: 75 },
  { latinName: 'Centaurea cyanus', dutchName: 'Korenbloem', priority: 85 },
  { latinName: 'Papaver rhoeas', dutchName: 'Grote klaproos', priority: 85 },
  { latinName: 'Achillea millefolium', dutchName: 'Duizendblad', priority: 80 },
  { latinName: 'Ranunculus acris', dutchName: 'Scherpe boterbloem', priority: 75 },
];

async function fetchWikipediaExtract(title: string): Promise<{ extract: string; thumbnail: string | null; pageId: number } | null> {
  try {
    const params = new URLSearchParams({
      action: 'query', titles: title, prop: 'extracts|pageimages',
      exintro: 'true', explaintext: 'true', piprop: 'thumbnail', pithumbsize: '400',
      format: 'json', origin: '*',
    });
    const res = await rateLimitedFetch(`https://en.wikipedia.org/w/api.php?${params}`);
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as Record<string, unknown>;
    if (!page || page.missing !== undefined) return null;
    return {
      extract: (page.extract as string) || '',
      thumbnail: (page.thumbnail as Record<string, string>)?.source || null,
      pageId: page.pageid as number,
    };
  } catch { return null; }
}

async function fetchWikipediaLangLinks(title: string): Promise<Record<string, string>> {
  try {
    const params = new URLSearchParams({
      action: 'query', titles: title, prop: 'langlinks', lllimit: '50',
      format: 'json', origin: '*',
    });
    const res = await rateLimitedFetch(`https://en.wikipedia.org/w/api.php?${params}`);
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return {};
    const page = Object.values(pages)[0] as Record<string, unknown>;
    const langLinks = page.langlinks as Record<string, string>[] | undefined;
    if (!langLinks) return {};
    const names: Record<string, string> = {};
    for (const link of langLinks) {
      const lang = link.lang as string;
      if (['nl', 'de', 'fr', 'es'].includes(lang)) {
        names[lang] = link['*'] as string;
      }
    }
    return names;
  } catch { return {}; }
}

async function fetchGbifTaxonomy(name: string): Promise<GbifMatch | null> {
  try {
    const params = new URLSearchParams({ name, verbose: 'true' });
    const res = await rateLimitedFetch(`https://api.gbif.org/v1/species/match?${params}`);
    const data = await res.json();
    if (data.matchType === 'NONE') return null;
    return {
      usageKey: data.usageKey, scientificName: data.scientificName,
      kingdom: data.kingdom || '', phylum: data.phylum || '',
      class_: data.class_ || data['class'] || '', order: data.order || '',
      family: data.family || '', genus: data.genus || '', species: data.species || '',
      matchType: data.matchType, confidence: data.confidence || 0,
    };
  } catch { return null; }
}

function guessCategory(plant: ProcessedPlant): string {
  const family = plant.taxonomy.family.toLowerCase();
  const habits = (plant.traits.growthHabit || '').toLowerCase();

  if (habits.includes('tree') || ['fagaceae', 'betulaceae', 'salicaceae', 'aceraceae', 'pinaceae'].includes(family)) return 'tree';
  if (habits.includes('shrub') || ['ericaceae', 'caprifoliaceae', 'rhamnaceae'].includes(family)) return 'shrub';
  if (habits.includes('grass') || family === 'poaceae') return 'grass';
  if (habits.includes('fern') || family === 'polypodiaceae') return 'fern';
  if (family === 'lamiaceae' || habits.includes('herb')) return 'herb';
  return 'flower';
}

async function processPlant(entry: { latinName: string; dutchName: string; priority: number }): Promise<ProcessedPlant | null> {
  const id = entry.latinName.toLowerCase().replace(/\s+/g, '-');
  console.log(`  Processing: ${entry.latinName}`);

  const wikiData = await fetchWikipediaExtract(entry.latinName);
  if (!wikiData) {
    console.log(`    ⚠ No Wikipedia data for ${entry.latinName}`);
  }

  const langNames = await fetchWikipediaLangLinks(entry.latinName);
  const taxonomy = await fetchGbifTaxonomy(entry.latinName);

  const names: Record<string, string> = { nl: entry.dutchName };
  if (langNames.en) names.en = langNames.en;
  else names.en = entry.latinName.split(' ')[1] || entry.latinName;
  if (langNames.de) names.de = langNames.de;
  if (langNames.fr) names.fr = langNames.fr;
  if (langNames.es) names.es = langNames.es;

  const plant: ProcessedPlant = {
    id,
    latinName: entry.latinName,
    names,
    taxonomy: {
      kingdom: taxonomy?.kingdom || 'Plantae',
      phylum: taxonomy?.phylum || '',
      class: taxonomy?.class_ || '',
      order: taxonomy?.order || '',
      family: taxonomy?.family || '',
      genus: taxonomy?.genus || entry.latinName.split(' ')[0],
      species: taxonomy?.species || entry.latinName,
    },
    traits: {
      sun: '', water: '', hardiness: '', height: '', growthHabit: '',
    },
    thumbnail: wikiData?.thumbnail || null,
    category: 'flower',
    popularityScore: entry.priority,
    description: {
      en: wikiData?.extract || `${entry.latinName} is a plant species in the family ${taxonomy?.family || 'unknown'}.`,
    },
    deep: null,
    images: [],
    sources: [
      { name: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${encodeURIComponent(entry.latinName)}` },
    ],
  };

  if (taxonomy) {
    plant.sources.push({ name: 'GBIF', url: `https://www.gbif.org/species/${taxonomy.usageKey}` });
  }

  plant.category = guessCategory(plant);
  return plant;
}

async function main() {
  console.log('🌿 Planten Kennis Data Pipeline');
  console.log('==============================\n');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const plants: ProcessedPlant[] = [];

  for (const entry of DUTCH_PRIORITY_PLANTS) {
    try {
      const plant = await processPlant(entry);
      if (plant) plants.push(plant);
    } catch (err) {
      console.error(`  ✗ Error processing ${entry.latinName}:`, err);
    }
  }

  const coreData = plants.map(p => ({
    id: p.id, latinName: p.latinName, names: p.names, taxonomy: p.taxonomy,
    traits: p.traits, thumbnail: p.thumbnail, category: p.category,
    popularityScore: p.popularityScore,
  }));

  const detailData = plants.map(p => ({
    id: p.id, general: {
      description: p.description, family: p.taxonomy.family,
      nativeRange: [], growthHabit: p.traits.growthHabit || p.category,
    },
    deep: p.deep, images: p.images, sources: p.sources,
  }));

  const searchIndex = plants.map(p => ({
    id: p.id,
    terms: [
      p.latinName.toLowerCase(),
      ...Object.values(p.names).filter(Boolean).map(n => n.toLowerCase()),
      p.taxonomy?.family?.toLowerCase() || '',
    ].filter(Boolean),
    preview: { latin: p.latinName, thumbnail: p.thumbnail },
  }));

  fs.writeFileSync(path.join(OUTPUT_DIR, 'plants-core.json'), JSON.stringify(coreData, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'plants-detail.json'), JSON.stringify(detailData, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'search-index.json'), JSON.stringify(searchIndex, null, 2));

  console.log(`\n✅ Generated data for ${plants.length} plants`);
  console.log(`   Core data: ${(JSON.stringify(coreData).length / 1024).toFixed(1)} KB`);
  console.log(`   Detail data: ${(JSON.stringify(detailData).length / 1024).toFixed(1)} KB`);
  console.log(`   Search index: ${(JSON.stringify(searchIndex).length / 1024).toFixed(1)} KB`);
}

main().catch(err => { console.error('Pipeline failed:', err); process.exit(1); });