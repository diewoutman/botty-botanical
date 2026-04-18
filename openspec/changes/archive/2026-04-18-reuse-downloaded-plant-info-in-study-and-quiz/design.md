## Context

The app already stores downloaded external plant detail data in local storage, but study and quiz experiences primarily consume bundled in-memory plant data and can miss richer downloaded content. This creates a disconnect: users download data once, yet learning flows do not consistently reuse that local investment. We need one reliable composition path that merges bundled plant metadata with cached downloaded details for study and quiz.

## Goals / Non-Goals

**Goals:**
- Reuse downloaded plant detail information in Study and Quiz data preparation paths when available.
- Define deterministic precedence rules when bundled and downloaded data overlap.
- Keep Study/Quiz responsive and offline-safe if cached detail reads fail or are missing.
- Avoid duplicate fetches for content already downloaded and cached.

**Non-Goals:**
- Redesigning Study or Quiz UI layouts.
- Changing storage backend technology.
- Rewriting ingestion pipeline or downloading all content proactively.

## Decisions

1. Introduce a shared data composition utility/service for learning flows.
   - Rationale: Centralizes merge rules so Study and Quiz stay consistent.
   - Alternative considered: separate merge logic in each page; rejected due to drift risk.

2. Prefer downloaded detail-derived fields when present, fallback to bundled values.
   - Rationale: Downloaded data is expected to be fresher/richer while fallback preserves completeness.
   - Alternative considered: always prefer bundled fields; rejected as it ignores user-downloaded improvements.

3. Keep merge and cache reads non-blocking for rendering-critical paths.
   - Rationale: Study/Quiz must remain usable even when cached detail is unavailable or corrupt.
   - Alternative considered: strict dependency on cache load; rejected due to fragility/offline edge cases.

4. Scope reuse to fields that impact study cards and quiz prompts/options first.
   - Rationale: Delivers immediate user value with limited risk.
   - Alternative considered: merge all detail fields into all models; deferred to avoid unnecessary complexity.

## Risks / Trade-offs

- [Risk] Merge precedence may produce inconsistent labels if source data quality varies → Mitigation: define explicit per-field precedence and test key scenarios.
- [Risk] Additional cache reads can impact startup latency → Mitigation: lazy or batched reads and memoization for session reuse.
- [Risk] Partial/corrupt cache entries could break learning flows → Mitigation: guard reads with validation and fallback to bundled data.

## Migration Plan

1. Add shared composition function/service for bundled + downloaded plant info.
2. Integrate service into Study data loading.
3. Integrate service into Quiz question source loading.
4. Add tests for cache-hit, fallback, and consistency across Study/Quiz.
5. Run lint/tests/build and fix regressions.

## Open Questions

- Should merged results be persisted as a derived cache or computed per session in-memory?
- Which exact fields should always favor downloaded detail versus bundled baseline data?
