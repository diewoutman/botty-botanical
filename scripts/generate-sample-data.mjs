import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/data');
const IMAGES_DIR = path.resolve(__dirname, '../public/assets/images/thumbs');

const DUTCH_PRIORITY_PLANTS = [
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
  { latinName: 'Frangula alnus', dutchName: 'Vuilboom', priority: 70 },
  { latinName: 'Rumex obtusifolius', dutchName: 'Ronde zuuring', priority: 70 },
  { latinName: 'Centaurea cyanus', dutchName: 'Korenbloem', priority: 85 },
  { latinName: 'Papaver rhoeas', dutchName: 'Grote klaproos', priority: 85 },
];

function generateSampleCoreData() {
  return DUTCH_PRIORITY_PLANTS.map(entry => ({
    id: entry.latinName.toLowerCase().replace(/\s+/g, '-'),
    latinName: entry.latinName,
    names: {
      nl: entry.dutchName,
      en: '',
      de: '',
      fr: '',
      es: '',
    },
    taxonomy: {
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      class: 'Magnoliopsida',
      order: '',
      family: '',
      genus: entry.latinName.split(' ')[0],
      species: entry.latinName,
    },
    traits: {
      sun: '',
      water: '',
      hardiness: '',
      height: '',
      growthHabit: '',
    },
    thumbnail: `assets/images/thumbs/${entry.latinName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    category: 'flower',
    popularityScore: entry.priority,
  }));
}

function generateSampleDetailData(coreData) {
  return coreData.map(plant => ({
    id: plant.id,
    general: {
      description: {
        nl: `${plant.names.nl} (${plant.latinName}) is een veelvoorkomende plant in Nederland.`,
        en: `${plant.names.nl} (${plant.latinName}) is a common plant in the Netherlands.`,
      },
      family: plant.taxonomy.family || 'Unknown',
      nativeRange: ['Netherlands', 'Europe'],
      growthHabit: plant.traits.growthHabit || 'Herbaceous',
    },
    deep: {
      history: {
        nl: `${plant.names.nl} heeft een rijke geschiedenis in Nederland.`,
        en: `${plant.names.nl} has a rich history in the Netherlands.`,
      },
      etymology: {
        nl: `De naam ${plant.names.nl} komt van...`,
        en: `The name ${plant.names.nl} comes from...`,
      },
      culturalSignificance: {
        nl: `${plant.names.nl} is cultureel significant in Nederland.`,
        en: `${plant.names.nl} is culturally significant in the Netherlands.`,
      },
      usesTraditional: ['Traditional use 1', 'Traditional use 2'],
      usesModern: ['Modern use 1', 'Modern use 2'],
      conservationStatus: 'Least Concern',
    },
    images: [],
    sources: [
      { name: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${encodeURIComponent(plant.latinName)}` },
    ],
  }));
}

function generateSearchIndex(coreData) {
  return coreData.map(plant => ({
    id: plant.id,
    terms: [
      plant.latinName.toLowerCase(),
      ...Object.values(plant.names).filter(Boolean).map(n => n.toLowerCase()),
      plant.taxonomy?.family?.toLowerCase() || '',
      plant.taxonomy?.genus?.toLowerCase() || '',
    ].filter(Boolean),
    preview: {
      latin: plant.latinName,
      thumbnail: plant.thumbnail,
    },
  }));
}

async function main() {
  console.log('🌱 Generating sample plant data...');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const coreData = generateSampleCoreData();
  const detailData = generateSampleDetailData(coreData);
  const searchIndex = generateSearchIndex(coreData);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'plants-core.json'),
    JSON.stringify(coreData, null, 2)
  );
  console.log(`✓ Generated plants-core.json with ${coreData.length} plants`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'plants-detail.json'),
    JSON.stringify(detailData, null, 2)
  );
  console.log(`✓ Generated plants-detail.json`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'search-index.json'),
    JSON.stringify(searchIndex, null, 2)
  );
  console.log(`✓ Generated search-index.json`);

  console.log('\n🌱 Sample data generation complete!');
  console.log(`Total plants: ${coreData.length}`);
  console.log('Note: This is sample data. Run the full pipeline with --fetch to get real data.');
}

main().catch(console.error);