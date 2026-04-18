## 1. Shared data composition for learning flows

- [x] 1.1 Add a shared Study/Quiz plant-data composition utility/service that merges bundled plant data with downloaded cached detail.
- [x] 1.2 Define and implement explicit field-precedence rules for overlapping bundled vs downloaded values.
- [x] 1.3 Ensure composition path handles missing/corrupt cache entries safely and falls back to bundled data.

## 2. Study and quiz integration

- [x] 2.1 Integrate shared composition into Study plant loading so downloaded info is reused when available.
- [x] 2.2 Integrate shared composition into Quiz plant/question source loading so downloaded info is reused when available.
- [x] 2.3 Ensure both flows avoid unnecessary refetches for already-downloaded plant info.

## 3. Verification

- [x] 3.1 Add/update tests for Study cache-hit reuse and fallback behavior.
- [x] 3.2 Add/update tests for Quiz cache-hit reuse, fallback behavior, and precedence consistency with Study.
- [x] 3.3 Run lint, tests, and production build; fix regressions.
