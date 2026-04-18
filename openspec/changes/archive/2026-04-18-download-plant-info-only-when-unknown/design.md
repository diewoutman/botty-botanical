## Context

The app currently supports plant search, detail viewing, and caching for offline use. Existing caching behavior ensures browsed external detail can be persisted, but it does not explicitly require a strict local-first lookup gate before any new plant-information download attempt. The change must ensure search-driven retrieval avoids redundant downloads for already-known plants while preserving existing user-visible search flows.

## Goals / Non-Goals

**Goals:**
- Enforce a local-first decision path for plant info retrieval during search and lookup.
- Trigger remote plant-info download only when the searched plant is not already known locally.
- Keep downstream study/quiz flows compatible by returning a single resolved plant record source (local if known, remote if newly fetched).
- Reduce duplicate external requests and improve responsiveness for known plants.

**Non-Goals:**
- Changing UI copy, navigation, or introducing new user actions.
- Redesigning the full caching subsystem or storage schema beyond what is needed to support local-first checks.
- Broadly changing background ingestion policies unrelated to user search/lookup.

## Decisions

1. **Local-first resolver for search lookups**  
   Introduce/standardize a resolver step in the search-to-detail pipeline that checks known local plant records before invoking external download logic.  
   **Rationale:** Centralizing this decision avoids duplicate conditional checks across screens and guarantees consistent behavior.  
   **Alternative considered:** Add guards in each caller (search page, detail page, quiz prep). Rejected because it risks divergence and missed paths.

2. **Canonical matching before remote fetch**  
   Perform lookup using normalized plant identity (e.g., canonical name/key already used by caching) so known records are recognized reliably before remote calls.  
   **Rationale:** String-level differences can cause false misses and unnecessary downloads.
   **Alternative considered:** Exact raw string matching only. Rejected because it increases duplicate fetch risk.

3. **Remote fetch as fallback path only**  
   Keep existing fetch/caching pipeline intact but invoke it only when local lookup misses; newly fetched records are then persisted and returned through the same result contract.  
   **Rationale:** Minimizes implementation risk by reusing proven fetch/persist behavior.
   **Alternative considered:** Introduce a new fetch-and-merge flow. Rejected due to higher complexity and migration risk.

4. **Behavioral alignment with auto-cache capability**  
   Update the modified capability requirements to explicitly state that already-known plants are served without re-download.
   **Rationale:** Keeps specification contracts consistent between search-time retrieval and caching expectations.

## Risks / Trade-offs

- **[Risk] False cache misses due to inconsistent identifiers** → **Mitigation:** Reuse existing canonicalization/key-generation logic and add scenario coverage for known-plant match paths.
- **[Risk] Stale local data preferred over potentially fresher remote data** → **Mitigation:** Scope this change to avoiding redundant downloads; freshness policy remains unchanged and can be addressed separately.
- **[Risk] Hidden call sites still invoking remote fetch directly** → **Mitigation:** Route retrieval through shared resolver and add task-level verification for all search-triggered paths.
