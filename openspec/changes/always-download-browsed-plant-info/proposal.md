## Why

Users currently need to manually tap a “Download plant info” action to cache browsed plant details, which creates unnecessary friction and inconsistent offline availability. Automatically downloading plant info when a user opens a plant detail improves reliability and aligns with an offline-first experience.

## What Changes

- Automatically cache plant detail data whenever a user browses an external plant detail page.
- Remove the manual “Download plant info” UI action from the detail page.
- Ensure automatic caching remains non-blocking for page rendering and degrades gracefully on network/cache failures.
- Update related UI behavior and tests to reflect the automatic download flow.

## Capabilities

### New Capabilities
- `auto-cache-browsed-plant-info`: Automatically persist browsed plant info for offline use without requiring a manual download action.

### Modified Capabilities
- None.

## Impact

- Affected code in detail page interactions and plant data/offline caching services.
- Removal of manual download control from detail page UI.
- Updated tests for detail-page caching behavior and offline persistence flow.
