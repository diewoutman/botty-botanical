import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../public/assets/data');
const THUMBS_DIR = path.resolve(__dirname, '../public/assets/images/thumbs');

const CORE_PATH = path.join(DATA_DIR, 'plants-core.json');
const SEARCH_INDEX_PATH = path.join(DATA_DIR, 'search-index.json');

const RATE_LIMIT_MS = 1200;
let lastRequestTime = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function rateLimitedFetch(url) {
  const now = Date.now();
  const wait = Math.max(0, RATE_LIMIT_MS - (now - lastRequestTime));
  if (wait > 0) await sleep(wait);
  lastRequestTime = Date.now();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  return response;
}

async function fetchWikipediaThumbnailUrl(title) {
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '400',
    format: 'json',
    origin: '*',
  });

  const res = await rateLimitedFetch(`https://en.wikipedia.org/w/api.php?${params}`);
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  const firstPage = Object.values(pages)[0];
  if (!firstPage || firstPage.missing !== undefined) return null;
  return firstPage?.thumbnail?.source || null;
}

async function fetchCommonsThumbnailUrl(title) {
  const searchParams = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: title,
    srnamespace: '6',
    srlimit: '5',
    format: 'json',
    origin: '*',
  });

  const searchRes = await rateLimitedFetch(`https://commons.wikimedia.org/w/api.php?${searchParams}`);
  const searchData = await searchRes.json();
  const results = searchData?.query?.search || [];
  if (!results.length) return null;

  const best = results.find((r) => String(r?.title || '').toLowerCase().includes(String(title).split(' ')[0].toLowerCase())) || results[0];
  if (!best?.title) return null;

  const imageParams = new URLSearchParams({
    action: 'query',
    titles: best.title,
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '600',
    format: 'json',
    origin: '*',
  });

  const imageRes = await rateLimitedFetch(`https://commons.wikimedia.org/w/api.php?${imageParams}`);
  const imageData = await imageRes.json();
  const pages = imageData?.query?.pages;
  if (!pages) return null;
  const firstPage = Object.values(pages)[0];
  const info = firstPage?.imageinfo?.[0];
  return info?.thumburl || info?.url || null;
}

async function downloadThumbnail(url, outputPath) {
  const res = await rateLimitedFetch(url);
  const arr = await res.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(arr));
}

async function main() {
  if (!fs.existsSync(CORE_PATH)) {
    throw new Error(`Missing core data file: ${CORE_PATH}`);
  }

  fs.mkdirSync(THUMBS_DIR, { recursive: true });

  const core = JSON.parse(fs.readFileSync(CORE_PATH, 'utf8'));
  const searchIndex = fs.existsSync(SEARCH_INDEX_PATH)
    ? JSON.parse(fs.readFileSync(SEARCH_INDEX_PATH, 'utf8'))
    : [];

  let downloaded = 0;
  let reused = 0;
  let missing = 0;

  for (const plant of core) {
    const fileName = `${plant.id}.jpg`;
    const localRelPath = `assets/images/thumbs/${fileName}`;
    const localAbsPath = path.join(THUMBS_DIR, fileName);

    if (fs.existsSync(localAbsPath)) {
      plant.thumbnail = localRelPath;
      reused += 1;
      continue;
    }

    try {
      let thumbUrl = await fetchWikipediaThumbnailUrl(plant.latinName);
      if (!thumbUrl) {
        thumbUrl = await fetchCommonsThumbnailUrl(plant.latinName);
      }
      if (!thumbUrl) {
        plant.thumbnail = null;
        missing += 1;
        continue;
      }

      await downloadThumbnail(thumbUrl, localAbsPath);
      plant.thumbnail = localRelPath;
      downloaded += 1;
      process.stdout.write(`Downloaded ${plant.latinName}\n`);
    } catch {
      plant.thumbnail = null;
      missing += 1;
    }
  }

  const previewById = new Map(searchIndex.map((entry) => [entry.id, entry]));
  core.forEach((plant) => {
    const item = previewById.get(plant.id);
    if (item?.preview) {
      item.preview.thumbnail = plant.thumbnail;
    }
  });

  fs.writeFileSync(CORE_PATH, JSON.stringify(core, null, 2));
  if (searchIndex.length > 0) {
    fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(searchIndex, null, 2));
  }

  process.stdout.write(`\nDone. Downloaded: ${downloaded}, reused: ${reused}, missing: ${missing}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
