## Why

When deployed on GitHub Pages, the app fails to load JSON assets because asset URLs are resolved incorrectly for the repository subpath, causing core functionality to break in production. Wikipedia lookups are also triggering HTTP 429 responses due to request volume patterns, degrading search reliability.

## What Changes

- Add deployment-aware asset URL resolution so JSON assets are loaded correctly on GitHub Pages and other non-root base paths.
- Update asset loading behavior to consistently use the configured app base path rather than hardcoded root-relative URLs.
- Add client-side request controls for Wikipedia queries (rate limiting, pacing, and/or backoff on 429) to reduce throttling.
- Add resilience for Wikipedia fetch failures (retry policy and graceful fallback messaging) so the app remains usable during temporary API limits.

## Capabilities

### New Capabilities
- `github-pages-asset-path-resolution`: Resolve bundled JSON and other static asset URLs through the configured app base path so deployments under repository subpaths load correctly.
- `wikipedia-request-resilience`: Add request throttling and 429-aware retry/backoff behavior for Wikipedia lookups, with graceful fallback on persistent rate limiting.

### Modified Capabilities
- None.

## Impact

- Affected code in frontend asset fetching utilities and Wikipedia integration/search service logic.
- Deployment behavior on GitHub Pages and any environment using a non-root base URL.
- Runtime network behavior for external Wikipedia API calls.
- Potential updates to configuration and tests covering URL resolution and API retry behavior.
