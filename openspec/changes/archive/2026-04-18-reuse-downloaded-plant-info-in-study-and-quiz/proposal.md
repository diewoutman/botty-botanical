## Why

Downloaded external plant info is persisted, but study and quiz flows do not consistently prioritize and reuse that enriched data once it exists. Reusing downloaded data in these learning flows improves offline readiness and ensures users benefit from previously fetched plant content.

## What Changes

- Ensure Study uses already-downloaded plant info when building plant cards/list data where relevant.
- Ensure Quiz uses already-downloaded plant info for question generation and display when available.
- Define deterministic merge/precedence behavior between bundled plant data and downloaded cached plant info.
- Add fallback behavior so Study/Quiz continue working if cached detail data is missing or partially available.
- Add/update tests for Study and Quiz data-source reuse behavior.

## Capabilities

### New Capabilities
- `reuse-downloaded-plant-info`: Reuses cached/downloaded plant detail data in study and quiz experiences without requiring refetch.

### Modified Capabilities
- None.

## Impact

- Affected code: Study and Quiz data preparation flows, and related service-layer data composition.
- Affected storage integration: read paths from persisted plant detail cache into learning flows.
- Affected tests: Study/Quiz integration and data reuse/fallback coverage.
