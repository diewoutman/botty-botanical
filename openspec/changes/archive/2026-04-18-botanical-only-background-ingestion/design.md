## Context

The app currently grows its plant catalog in the background by querying Wikipedia with broad search seeds. This produces a high volume of irrelevant results (industrial plants, food products, and non-botanical entities) that degrade study/search quality. We already have a core bundled dataset and a background-loading flow in `PlantDataService`, plus Wikipedia and GBIF integration in `PlantApiService`. The next iteration needs better source quality controls without losing the seamless “catalog expands while you use the app” user experience.

Key constraints:
- Must keep initial load fast and offline-friendly via bundled JSON.
- Must keep background expansion non-blocking for UI.
- Must avoid major increases in API error rate or request bursts.
- Must remain compatible with current TypeScript models and quiz/detail flows.

## Goals / Non-Goals

**Goals:**
- Ensure background-ingested records are botanical entities only.
- Require taxonomy validation (Plantae) before adding external items to searchable in-app data.
- Keep Wikipedia available as discovery/enrichment input but not sole authority for acceptance.
- Add deterministic filtering and rejection reason tracking for quality tuning.
- Preserve seamless UX: users search one combined dataset without manual “search Wikipedia” actions.

**Non-Goals:**
- Building a full scientific taxonomy normalization pipeline for all ranks.
- Perfect species synonym resolution across all plant databases.
- Replacing all external APIs in this change.
- Backfilling image assets for all bundled plants in this same change.

## Decisions

1. Use GBIF Plantae validation as ingestion gate
- Decision: A background candidate is admitted only if GBIF match exists and kingdom resolves to Plantae with acceptable confidence.
- Rationale: GBIF provides structured taxonomy and is better suited than free-text Wikipedia pages for entity validation.
- Alternatives considered:
  - Wikipedia-only heuristics: rejected due to high false positives.
  - Manual allowlist-only ingestion: rejected due to poor scalability.

2. Keep Wikipedia for candidate discovery and detail enrichment
- Decision: Continue using Wikipedia search/page APIs for candidate generation and descriptions/thumbnails, but apply validation before catalog admission.
- Rationale: Wikipedia coverage and multilingual metadata are useful; quality concerns are addressed by validation layer.
- Alternatives considered:
  - Drop Wikipedia entirely: rejected because enrichment quality and content breadth would decrease.

3. Introduce multi-stage deterministic filters before GBIF calls
- Decision: Apply fast local rejection checks first (title/snippet keyword blacklist, disambiguation/list pages, known non-botanical terms), then run GBIF validation on survivors.
- Rationale: Reduces external API load and speeds convergence toward relevant entities.
- Alternatives considered:
  - GBIF-check every candidate: rejected due to unnecessary API usage.

4. Add ingestion quality telemetry in app state/service
- Decision: Track accepted/rejected counts and rejection reasons (e.g., blacklist-term, no-gbif-match, non-plantae, low-confidence).
- Rationale: Enables tuning filters and debugging without guesswork.
- Alternatives considered:
  - No telemetry: rejected because tuning quality would be opaque.

5. Preserve incremental background ingestion behavior
- Decision: Keep batched background ingestion target (e.g., up to 1000 entries) and incremental UI updates, but only with validated entities.
- Rationale: Maintains current seamless UX while improving result precision.
- Alternatives considered:
  - One-shot large sync: rejected due to slower first interaction and weaker resilience.

## Risks / Trade-offs

- [Risk] GBIF validation may reject legitimate plants due to naming ambiguity or missing records → Mitigation: include confidence thresholds and fallback retry with cleaned genus/species query.
- [Risk] Added validation steps could reduce ingestion speed → Mitigation: apply local prefilters first and keep batched async processing.
- [Risk] Strict filters might under-fill target count in some sessions → Mitigation: expand query seed set and permit continued background attempts over time.
- [Risk] Extra API calls may hit rate limits → Mitigation: respect existing throttling/retry policy and short-circuit on deterministic rejections.
- [Risk] Thumbnail availability remains uneven for some external entries → Mitigation: keep placeholder strategy and progressive thumbnail hydration.

## Migration Plan

1. Add filtering + validation pipeline in `PlantDataService` background ingestion flow.
2. Extend `PlantApiService` helpers for reusable candidate validation and GBIF gating.
3. Add ingestion metrics model and expose read-only counters for UI/debug.
4. Update Study data composition to include only validated background entries.
5. Verify search behavior, detail navigation, and quiz source pool with new catalog.
6. Rollback plan: feature-flag (or temporary config) to disable strict validation and revert to bundled-only/existing behavior if regression appears.

## Open Questions

- What confidence threshold should be required for GBIF acceptance (single value vs rank-aware)?
- Should cultivar/hybrid pages be included when GBIF returns partial but Plantae-consistent matches?
- Do we want to persist ingestion metrics/history across app restarts or keep in-memory/session-only?
- Should we include a small curated denylist/allowlist file for edge cases discovered in production?