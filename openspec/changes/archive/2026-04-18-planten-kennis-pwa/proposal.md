## Why

Planten Kennis (Botanical Knowledge) is a Progressive Web Application that makes botanical education accessible and engaging. Current plant identification apps are either too complex, require constant internet connectivity, or lack depth in their plant information. This app solves these problems by providing a hybrid offline-first experience with rich, multi-layered plant information - from quick facts to deep cultural and historical context - all optimized for Dutch and European flora while maintaining global coverage.

## What Changes

This change introduces a complete Ionic-based PWA with the following capabilities:

- **Study Mode**: Card-based browsing of 500-1000 bundled plants (prioritizing Dutch/European flora) with search, filtering, and infinite scroll
- **Plant Detail Pages**: Two-tab interface with General information (description, taxonomy, traits) and Deep information (history, etymology, cultural significance, uses)
- **Quiz Mode**: 10-question quiz with two question types: (A) image-to-Latin-name matching and (B) name-to-image matching
- **Hybrid Data Architecture**: Bundled core dataset for offline use + Wikipedia API integration for extended plant database
- **Internationalization**: Full i18n support for UI and plant common names (Dutch, English, German, French, Spanish) with Latin names always displayed
- **Offline Capabilities**: Automatic caching of visited external plants + user-controlled bulk download for full offline mode
- **Attribution System**: Automatic image credits and Wikipedia source links on detail pages

## Capabilities

### New Capabilities

- `plant-study`: Browse and search plant database with card-based UI, thumbnails, badges, and filtering
- `plant-detail`: View detailed plant information with tabbed interface (General/Deep) and multi-language support
- `plant-quiz`: Generate and take quizzes with randomized questions from bundled + cached plants
- `data-pipeline`: Build-time script to fetch, enrich, and bundle plant data from multiple sources (Waarneming.nl, GBIF, Wikipedia)
- `api-integration`: Runtime service for lazy-loading external plant data from Wikipedia with caching
- `offline-management`: Cache management, storage tracking, and user-controlled offline downloads
- `i18n`: Application-wide internationalization with language switching

### Modified Capabilities

<!-- No existing capabilities modified - this is a new project -->

## Impact

- **New Repository**: Complete new codebase hosted on GitHub Pages
- **Build Process**: GitHub Actions workflow for weekly data updates and deployment
- **Storage Requirements**: ~10MB bundled data + up to 100MB user cache
- **External Dependencies**: Wikipedia API, GBIF API, Waarneming.nl API (build-time only), Wikimedia Commons (runtime images)
- **Browser Requirements**: Modern browser with IndexedDB support for offline features
- **No Backend**: Fully client-side with static deployment
