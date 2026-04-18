## Context

The app currently displays a manual “Download plant info” action on the detail page for external plants. Plant detail data is already fetched when viewing an external plant, and that fetch path persists data to local storage. Keeping a separate manual button introduces redundant interaction, inconsistent user behavior, and uncertainty about whether viewed plants are available offline.

The target behavior is to make browsing itself the trigger for offline persistence: when a user opens an external plant detail, the app should cache it automatically without additional taps. The UI should no longer expose a manual download control for this flow.

## Goals / Non-Goals

**Goals:**
- Ensure browsed external plant detail data is automatically cached for offline use.
- Remove the manual “Download plant info” button from detail view UI.
- Keep auto-caching non-blocking and resilient to network/storage failures.
- Preserve existing detail-page rendering behavior while adding deterministic background caching behavior.

**Non-Goals:**
- Downloading all external plants proactively.
- Changing storage backend or introducing new persistence dependencies.
- Redesigning detail page layout beyond removing the manual action.

## Decisions

1. Treat opening an external plant detail as the canonical trigger for caching.
   - Rationale: aligns behavior with user intent and removes manual steps.
   - Alternatives considered:
     - Keep manual button and add auto-cache optionally (rejected: duplicate UX paths).
     - Cache only on explicit settings action (rejected: does not solve browse-time reliability).

2. Reuse existing service-layer persistence path (external detail fetch + StorageService) rather than adding a parallel caching flow.
   - Rationale: minimizes code surface and preserves current data model.
   - Alternatives considered:
     - Add separate cache queue/worker (rejected: unnecessary complexity for current scope).

3. Make auto-cache failure non-fatal for page rendering.
   - Rationale: user should still see content even if persistence fails temporarily.
   - Alternatives considered:
     - Block detail rendering until cache write succeeds (rejected: harms UX and responsiveness).

4. Remove manual download UI and related local loading state from DetailPage.
   - Rationale: avoids misleading action once behavior is automatic.

## Risks / Trade-offs

- [Auto-cache operations may slightly increase detail-load work] → Keep persistence in existing async flow and avoid extra duplicate fetches.
- [Silent cache failure could reduce offline reliability] → Continue returning detail data even on cache errors and rely on existing retry/fallback behavior in services.
- [Users lose explicit control affordance] → This is intentional; browsing now guarantees best-effort caching automatically.
