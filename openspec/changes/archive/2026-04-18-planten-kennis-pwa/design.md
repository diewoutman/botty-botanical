## Context

Planten Kennis is a new Progressive Web Application for botanical education, targeting Dutch and European flora with global coverage. The app must work as a PWA deployed to GitHub Pages with no backend server. 

Key constraints:
- No backend - all data must be fetched from external APIs or bundled
- GitHub Pages deployment (static hosting only)
- Offline-first architecture with optional API enrichment
- Multi-language support (Dutch priority)
- Must handle 500-1000 bundled plants + unlimited lazy-loaded plants

## Goals / Non-Goals

**Goals:**
- Build Ionic React PWA with study mode, detail pages, and quiz functionality
- Implement hybrid data architecture: bundled core data + Wikipedia API for extended plants
- Achieve offline capability for all bundled plants + user-cached external plants
- Support 5 languages (Dutch, English, German, French, Spanish) with Latin names always visible
- Implement Dutch-weighted plant prioritization in data pipeline
- Create automated build pipeline with weekly data updates

**Non-Goals:**
- Backend server or database (MVP only - may add later)
- User accounts or authentication
- Social features or sharing
- Advanced quiz levels/difficulty (future enhancement)
- Image recognition or AI plant identification
- Real-time collaborative features
- Native mobile apps (iOS/Android stores)

## Decisions

### Architecture: Ionic + React (not Angular)
**Decision:** Use Ionic with React instead of Angular.

**Rationale:**
- Smaller bundle size (~30% smaller than Angular) critical for PWA performance
- Hooks-based state management simpler for this app size
- Larger ecosystem of PWA-specific React libraries
- Faster build times improve development velocity

**Alternatives considered:**
- Angular: Better dependency injection but heavier bundle
- Vue: Good middle ground but smaller ecosystem for Ionic
- Vanilla JS: Too much boilerplate for this complexity

### Routing: Hash-based (not History API)
**Decision:** Use hash-based routing (`#/study`) instead of History API (`/study`).

**Rationale:**
- GitHub Pages doesn't support SPA routing on static hosting
- No server configuration needed
- Works reliably on all static hosts

**Alternatives considered:**
- 404.html redirect hack: Prettier URLs but fragile
- Redirect meta tags: Poor user experience with flashes

### Data Storage: IndexedDB via localForage (not LocalStorage)
**Decision:** Use IndexedDB via localForage wrapper for runtime caching.

**Rationale:**
- LocalStorage limited to ~5MB and synchronous (blocks UI)
- IndexedDB supports 50MB+ and is asynchronous
- localForage provides Promise-based API that's easier to use than raw IndexedDB
- Can store binary image data directly

**Alternatives considered:**
- LocalStorage: Too small for image caching
- Cache API: More complex, designed for Service Workers
- SQLite (via Cordova plugin): Breaks PWA "no native code" principle

### Image Strategy: Bundled Thumbnails + Fetched Full Images
**Decision:** Bundle 400x400 thumbnails for popular plants, fetch full images on demand.

**Rationale:**
- 500 thumbnails × 6KB = ~3MB (acceptable bundle size)
- Thumbnails load instantly in study grid
- Full resolution images only needed on detail pages
- Reduces initial bundle while maintaining offline capability for core plants

**Alternatives considered:**
- All images bundled: 100MB+ (too large)
- All images fetched: Requires connectivity for basic browsing
- Placeholder system only: Poor user experience

### Data Pipeline: Multi-Source Aggregation
**Decision:** Aggregate data from Waarneming.nl, GBIF, Wikipedia, and iNaturalist.

**Rationale:**
- No single source has complete data
- Waarneming.nl provides Dutch-specific observation data
- GBIF provides taxonomy and global context
- Wikipedia provides descriptions and cultural information
- iNaturalist provides images and additional observations

**Alternatives considered:**
- Single Wikipedia source: Insufficient taxonomy and observation data
- Commercial plant APIs (Trefle): Rate limits and costs
- Manual data entry: Not scalable to 500+ plants

### Quiz Question Pool: Bundled + Cached (not real-time API)
**Decision:** Generate quiz questions only from bundled and already-cached plants.

**Rationale:**
- Prevents quiz interruptions from slow API calls
- Ensures offline quiz capability
- Better user experience with instant question loading

**Alternatives considered:**
- Real-time Wikipedia fetching: Too slow, breaks quiz flow
- Only bundled plants: Limits quiz variety over time

## Risks / Trade-offs

**Risk:** Wikipedia API rate limits or changes → **Mitigation:** Implement request throttling, cache aggressively, fallback to bundled-only mode if API fails

**Risk:** Bundled data becomes stale → **Mitigation:** Automated weekly rebuilds via GitHub Actions, versioned data files

**Risk:** Image licensing issues → **Mitigation:** Display attribution on detail pages, link to source, filter to open licenses if needed

**Risk:** Storage quota exceeded on user devices → **Mitigation:** Storage usage indicator in settings, user-controlled cache clearing, automatic LRU eviction

**Risk:** GitHub Pages bandwidth limits (100GB/month) → **Mitigation:** Aggressive Service Worker caching, CDN for images (future consideration)

**Trade-off:** Initial load time vs offline capability → Bundled data adds 5-10MB download but enables instant offline use

**Trade-off:** Data freshness vs reliability → Weekly rebuilds balance currency with stability

## Migration Plan

N/A - This is a new project with no existing users or data to migrate.

## Open Questions

1. **Image optimization:** Should we use WebP format for better compression? (Check browser support)
2. **Search indexing:** Should we implement full-text search or prefix matching only?
3. **Quiz distractor selection:** Random selection for MVP, but taxonomy-based similarity would improve quality
4. **Update notification:** How to notify users when new data is available after app update?
