## 1. Detail page auto-cache behavior

- [x] 1.1 Remove the manual “Download plant info” action and related local download state from the external detail page UI.
- [x] 1.2 Ensure external detail loading path automatically persists viewed plant detail data via the existing service flow and remains non-blocking for rendering.
- [x] 1.3 Handle auto-cache failures gracefully so detail viewing remains usable even if persistence fails.

## 2. Service and integration consistency

- [x] 2.1 Verify and adjust PlantDataService/OfflineService responsibilities so browse-triggered caching is the single source of truth for external detail persistence.
- [x] 2.2 Ensure repeated visits to already-cached external details reuse cached data without requiring additional user actions.

## 3. Verification

- [x] 3.1 Add/update tests for detail-page behavior confirming absence of manual download UI and automatic caching trigger.
- [x] 3.2 Add/update tests for cache-hit reuse and graceful behavior when auto-cache persistence fails.
- [x] 3.3 Run lint, tests, and production build to confirm no regressions.
