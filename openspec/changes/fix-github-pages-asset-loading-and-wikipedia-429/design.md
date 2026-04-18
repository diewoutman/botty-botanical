## Context

The app is a Vite + Ionic React PWA deployed to GitHub Pages, where it runs under a repository subpath instead of the domain root. Bundled JSON data in `public/assets/data` must be available at runtime for study/search features. Current client asset fetching logic resolves at least some URLs as root-relative paths, which works locally but fails on GitHub Pages because the app base path is not `/`.

Wikipedia-backed lazy loading currently issues request bursts that can trigger HTTP 429 responses. These rate-limit responses reduce search reliability and can leave users without results. We need resilient client request behavior that respects remote limits while preserving responsive UX.

## Goals / Non-Goals

**Goals:**
- Ensure bundled JSON/static assets load correctly when hosted under non-root base paths (including GitHub Pages repo paths).
- Standardize client asset URL construction so new asset fetches inherit deployment-safe behavior.
- Reduce Wikipedia 429 frequency via client-side pacing/rate limiting.
- Handle 429 and transient upstream failures with bounded retry/backoff and user-friendly fallback behavior.

**Non-Goals:**
- Replacing Wikipedia as a data source.
- Building a server-side proxy/cache layer.
- Redesigning search UX beyond minimal status/fallback messaging required for resilience.

## Decisions

1. Centralize asset URL resolution behind a single utility that prepends the runtime/app build base path (e.g., Vite base) and normalizes slashes.
   - Rationale: Eliminates repeated, error-prone root-relative strings and ensures consistent behavior across all deployments.
   - Alternatives considered:
     - Patch each fetch call manually (rejected: easy to miss future call sites).
     - Hardcode GitHub Pages repository path (rejected: environment-specific and brittle).

2. Treat bundled data assets as deployment-time constants loaded via base-aware paths from `public/assets/...`.
   - Rationale: Keeps offline-first model intact and avoids shifting data packaging or runtime assumptions.
   - Alternatives considered:
     - Move JSON imports into compiled modules (rejected: increases bundle pressure and reduces flexibility for data updates).

3. Introduce a small client-side request policy for Wikipedia integration:
   - Minimum interval between outbound Wikipedia requests.
   - Bounded retries for 429/temporary failures using exponential backoff with jitter.
   - Early stop with explicit fallback state/message after retry budget is exhausted.
   - Rationale: Balances API friendliness with user-perceived reliability.
   - Alternatives considered:
     - Unbounded retries (rejected: poor UX and unnecessary load).
     - No retries, fail fast (rejected: overly fragile under transient limits).

4. Preserve existing feature flow by encapsulating policy within the Wikipedia service layer rather than page components.
   - Rationale: Maintains separation of concerns and keeps UI changes minimal.

## Risks / Trade-offs

- [Slightly slower Wikipedia responses under aggressive pacing] → Tune interval/backoff with conservative defaults and monitor perceived latency.
- [Backoff/retry logic complexity can introduce duplicate handling bugs] → Keep policy centralized and covered by unit tests for retry branching.
- [Asset URL utility misuse by bypassing helper] → Use helper in all known asset loaders and document pattern in service code/tests.
- [Persistent upstream 429 still causes failures] → Provide clear fallback messaging and continue serving bundled offline content.
