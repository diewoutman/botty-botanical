## 1. Ingestion Validation Pipeline

- [ ] 1.1 Add deterministic candidate prefilter utility for non-botanical terms and disambiguation/list page patterns
- [ ] 1.2 Implement GBIF validation gate helper that confirms kingdom Plantae with confidence threshold
- [ ] 1.3 Wire prefilter + GBIF gate into background ingestion flow before candidate admission
- [ ] 1.4 Add fallback normalization for candidate names (cleaned genus/species query) before final rejection

## 2. Background Loader Behavior

- [ ] 2.1 Refactor background loader to maintain pending/accepted candidate states and only publish accepted entries
- [ ] 2.2 Keep batched asynchronous ingestion non-blocking while enforcing strict validation ordering
- [ ] 2.3 Ensure configured ingestion target count applies to accepted botanical entries only
- [ ] 2.4 Add configurable query seed/batch/target constants in a single ingestion config surface

## 3. Quality Metrics and Observability

- [ ] 3.1 Add ingestion metrics model for accepted count, rejected count, and rejection reason buckets
- [ ] 3.2 Record reason codes for each rejection path (keyword reject, disambiguation, no GBIF match, non-Plantae, low confidence)
- [ ] 3.3 Expose read-only metrics accessors from PlantDataService for UI/debug consumers
- [ ] 3.4 Add lightweight console diagnostics for ingestion summary per run

## 4. Study/Search Integration

- [ ] 4.1 Update Study page data wiring to consume only validated merged datasets
- [ ] 4.2 Preserve seamless user experience while background additions appear incrementally
- [ ] 4.3 Show concise ingestion progress/quality indicators without requiring manual external search actions
- [ ] 4.4 Verify detail page navigation continues to work for accepted external botanical items

## 5. Verification and Hardening

- [ ] 5.1 Add focused tests (or scripted checks) for filtering and GBIF validation acceptance/rejection behavior
- [ ] 5.2 Validate that known noisy terms (power plant, plant milk, human-related pages) are rejected
- [ ] 5.3 Validate that representative botanical pages pass and are surfaced in study search
- [ ] 5.4 Run full build/typecheck and manual smoke test for startup, search, and background ingestion stability