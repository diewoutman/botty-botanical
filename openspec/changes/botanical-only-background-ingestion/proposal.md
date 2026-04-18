## Why

Background ingestion currently uses broad Wikipedia search terms, which introduces many non-botanical results (for example industrial plants, plant-based products, and other non-species pages). We need taxonomy-verified ingestion so the growing dataset stays scientifically relevant and usable for plant study and quiz features.

## What Changes

- Replace broad background discovery with a botanical-only ingestion pipeline that requires plant taxonomy validation before adding entries to the in-app dataset.
- Add a multi-stage filtering pipeline for candidate pages (title/snippet filtering, taxonomy checks, and optional quality signals) to prevent non-plant entities from being surfaced.
- Keep Wikipedia as an enrichment/details source, but use stricter source-of-truth validation (GBIF-backed Plantae checks) for inclusion in searchable background-loaded results.
- Track ingestion quality metrics (accepted vs rejected counts by reason) so we can tune filter strictness over time.
- Add configurable ingestion guardrails (target item count, rate limits, and source query seeds) without exposing noisy results to end users.

## Capabilities

### New Capabilities
- `botanical-only-ingestion`: Background plant ingestion only admits taxonomy-validated botanical entities into the app dataset.
- `ingestion-quality-controls`: Ingestion applies deterministic rejection rules and tracks rejection/acceptance reasons for observability and tuning.

### Modified Capabilities
- None.

## Impact

- Affected code: `src/services/PlantDataService.ts`, `src/services/PlantApiService.ts`, and Study page result composition in `src/pages/StudyPage.tsx`.
- Data behavior: background-loaded dataset content quality will change significantly (fewer noisy entries, higher relevance).
- API usage: increased reliance on GBIF taxonomy validation calls during ingestion; Wikipedia remains used for discovery/enrichment with stricter acceptance.
- UX: users get seamless growth in searchable plant results without seeing non-botanical entities.
