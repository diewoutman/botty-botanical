## 1. Discovery and flow mapping

- [x] 1.1 Identify all search/lookup entry points that can trigger plant info retrieval.
- [x] 1.2 Trace current retrieval path to locate where known local plant data is checked versus where remote download is invoked.
- [x] 1.3 Confirm canonical plant identity/key logic used by local cache lookup and reuse it as the single match strategy.

## 2. Implement local-first resolution

- [x] 2.1 Add or refactor a shared resolver that checks known local plant data first for a searched plant.
- [x] 2.2 Update search-driven retrieval paths to call the shared resolver instead of calling remote download directly.
- [x] 2.3 Ensure remote plant-info download is executed only when the local-first resolver returns a miss.

## 3. Preserve caching and consumer compatibility

- [x] 3.1 Keep existing fetch-and-persist behavior for unknown plants so newly downloaded plant info is stored for future lookups.
- [x] 3.2 Verify that resolved plant info contract remains stable for downstream study/quiz consumers.
- [x] 3.3 Ensure existing auto-cache behavior remains intact while avoiding re-download for already known plants.

## 4. Verification

- [x] 4.1 Add or update tests for known-plant searches to assert no remote download call is made.
- [x] 4.2 Add or update tests for unknown-plant searches to assert remote download occurs and result is returned.
- [ ] 4.3 Run project lint, typecheck, and relevant test suites; fix regressions if any.
