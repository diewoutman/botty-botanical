## Why

The app should avoid unnecessary external plant-data downloads for plants it already knows, reducing latency, external request load, and failure risk during normal usage. This is needed now to improve responsiveness and make offline-first behavior more reliable.

## What Changes

- Add logic to check local known-plant data before attempting any new plant-information download.
- Only trigger remote plant-info fetching when a searched plant is not already present in known data.
- Keep existing search behavior intact while changing fetch behavior to be conditional.
- Ensure downstream study/quiz flows continue using the resolved plant info source (local first, remote only when missing).

## Capabilities

### New Capabilities
- `conditional-plant-info-download`: Search and lookup flows fetch remote plant information only when no known local record exists for the searched plant.

### Modified Capabilities
- `auto-cache-browsed-plant-info`: Clarify caching/fetching behavior so known plants are served without re-downloading, and caching is only invoked for newly discovered plants.

## Impact

- Affected systems: plant search flow, plant info retrieval service, and caching/known-plants storage integration.
- External API usage: fewer redundant requests to plant information providers.
- User impact: faster results and fewer network-dependent failures for already known plants.
