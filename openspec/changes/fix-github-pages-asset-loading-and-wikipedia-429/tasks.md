## 1. Asset path reliability for GitHub Pages

- [x] 1.1 Locate all bundled JSON/static asset fetch call sites and replace root-relative URL construction with a shared base-aware asset URL helper.
- [x] 1.2 Implement and integrate a base-path URL utility that uses configured runtime/app base path normalization for both root and repo-subpath deployments.
- [x] 1.3 Add/update tests covering asset URL resolution behavior for root deployment and GitHub Pages subpath deployment.

## 2. Wikipedia request resilience

- [x] 2.1 Implement centralized Wikipedia request pacing (minimum interval) inside the existing Wikipedia service layer.
- [x] 2.2 Add bounded retry/backoff (with jitter) for HTTP 429 and transient failures, including explicit stop conditions after retry budget exhaustion.
- [x] 2.3 Implement deterministic fallback result/state and user-facing temporary-unavailability messaging for exhausted retries.
- [x] 2.4 Add/update tests validating pacing, retry limit behavior, and fallback behavior under persistent 429 responses.

## 3. Validation and rollout

- [ ] 3.1 Run project lint, tests, and production build to confirm no regressions.
- [ ] 3.2 Verify GitHub Pages deployment behavior by validating JSON asset loads and Wikipedia fallback behavior in a subpath-hosted environment.
