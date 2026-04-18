## 1. Quiz model and generation updates

- [x] 1.1 Extend quiz question type definitions to represent property-based question variants and prompts.
- [x] 1.2 Implement property-question candidate selection from plants with valid properties and unique distractors.
- [x] 1.3 Update quiz question generation to produce a mixed set of existing and property-based questions with safe fallback when property data is insufficient.

## 2. Quiz UI and scoring integration

- [x] 2.1 Update quiz play UI to render property-question prompts and options using existing interaction patterns.
- [x] 2.2 Ensure answer submission and correctness evaluation for property questions reuse current selectedIndex/correctIndex scoring flow.
- [x] 2.3 Verify quiz review/results rendering handles property questions without breaking correctness feedback.

## 3. Verification

- [x] 3.1 Add/update tests for mixed question generation and fallback behavior when property data is insufficient.
- [x] 3.2 Add/update tests for property-question scoring and review compatibility.
- [x] 3.3 Run lint, tests, and production build; fix regressions.
