# Planten Kennis

A Progressive Web Application for botanical knowledge - study and quiz yourself on plants, with a focus on Dutch and European flora.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Overview

**Planten Kennis** (Dutch for "Botanical Knowledge") is an offline-first PWA that lets you browse, study, and quiz yourself on plants. It bundles 25 priority Dutch/European plants and can lazy-load thousands more from Wikipedia.

### Features

- **Study Mode** - Browse plant cards with thumbnails, Latin/Dutch names, and trait badges. Filter by category and search across all languages.
- **Plant Detail** - Two tabs: General (description, taxonomy, traits) and Deep (history, etymology, cultural significance). Multi-language names always visible.
- **Quiz Mode** - 10-question quiz with two question types: Image-to-Latin-Name and Name-to-Image. Score tracking with high score persistence.
- **Multi-language** - UI and plant names in Dutch, English, German, French, and Spanish. Latin names always displayed.
- **Offline-first** - Bundled plants work without internet. External plants are cached automatically. Manual "Download for offline" in Settings.
- **PWA** - Installable on mobile and desktop. Deployed to GitHub Pages.

## Tech Stack

| Layer          | Technology                                                          |
| -------------- | ------------------------------------------------------------------- |
| Framework      | Ionic React 8                                                       |
| Routing        | React Router 5 (hash-based for GitHub Pages)                       |
| State          | React Context + localForage (IndexedDB)                             |
| i18n           | react-i18next                                                       |
| Build          | Vite + TypeScript                                                   |
| Data Pipeline  | Node.js scripts (GBIF, Wikipedia, iNaturalist APIs)               |
| Deployment     | GitHub Pages (static)                                              |

## Project Structure

```
src/
  components/          # UI components
    layout/            # AppHeader, OfflineIndicator
    study/             # PlantCard
    common/            # LoadingSpinner
  context/             # React contexts (Language, Network)
  hooks/               # Custom hooks (useNetwork)
  i18n/                # Translations (en, nl, de, fr, es)
  locales/
  pages/               # Page components (Study, Detail, Quiz, Settings)
  services/            # PlantApiService, PlantDataService, StorageService
  styles/              # Global CSS
  types/               # TypeScript type definitions
public/
  assets/
    data/              # plants-core.json, plants-detail.json, search-index.json
    images/thumbs/     # Bundled plant thumbnails
    icons/             # PWA icons
  manifest.json        # PWA manifest
scripts/
  generate-sample-data.mjs  # Generate sample dataset from manual priority list
openspec/              # Project specification (proposal, design, specs, tasks)
```

## Data Architecture

```
Bundled (offline)          External (lazy-loaded)
─────────────────          ─────────────────────
plants-core.json           Wikipedia API (search)
plants-detail.json          └─ fetch on demand
search-index.json           └─ cache in IndexedDB
thumbnails/                 └─ cache images locally
```

- **Bundled plants** (25): Ship with the app, work offline immediately
- **External plants**: Fetched from Wikipedia when searched, cached in IndexedDB
- **Images**: Thumbnails for popular plants bundled, others fetched from Wikimedia Commons

## Scripts

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start Vite dev server with HMR             |
| `npm run build`        | TypeScript check + production build        |
| `npm run preview`      | Preview production build locally           |
| `npm run test`         | Run tests with Vitest                      |
| `npm run test:watch`   | Run tests in watch mode                    |
| `npm run lint`         | ESLint check                               |
| `npm run format`       | Prettier format                            |
| `npm run generate-sample` | Generate sample plant data from priority list |

## Deployment

The app deploys to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`). Pushing to `main` triggers a build and deploy. A weekly cron rebuilds to refresh data.

The build uses hash-based routing (`#/study`, `#/quiz`) for GitHub Pages compatibility, with a `404.html` copy of `index.html` as fallback.

## Language Support

| Code | Language     |
| ---- | ------------ |
| nl   | Nederlands   |
| en   | English      |
| de   | Deutsch      |
| fr   | Francais     |
| es   | Espanol      |

The app auto-detects browser language and falls back to English.

## License

MIT