## Context

The quiz currently alternates between identifying a plant from an image and selecting an image from a plant name. Plant metadata already includes properties such as taxonomy and additional structured traits, but quiz generation does not use this data. We need to extend the quiz system to include property-focused questions without breaking existing flows for play, scoring, review, and progress indicators.

## Goals / Non-Goals

**Goals:**
- Add property-based quiz questions that test botanical attributes (for example family and growth-related properties) alongside existing question types.
- Keep one shared quiz flow for generation, rendering, answer submission, and scoring.
- Ensure property questions degrade gracefully when a plant lacks usable property data.
- Keep compatibility with current review/results screens.

**Non-Goals:**
- Reworking overall quiz navigation or phase structure.
- Introducing new backend APIs or data ingestion pipelines.
- Designing a new spaced-repetition or adaptive-learning system.

## Decisions

1. Introduce explicit property-based quiz question variants in quiz types.
   - Rationale: Makes rendering and correctness checks deterministic for each question category and avoids implicit shape checks.
   - Alternative considered: keep one generic question type with inferred behavior from payload shape; rejected due to brittle runtime branching.

2. Generate property questions only from plants with valid property values and enough distractors.
   - Rationale: Prevents low-quality questions and avoids cases where all options are equivalent or empty.
   - Alternative considered: fallback placeholder options; rejected because it reduces educational value.

3. Reuse existing answer/scoring pipeline by storing canonical option indices for property questions.
   - Rationale: Minimizes impact to score calculation and review behavior by preserving selectedIndex/correctIndex contract.
   - Alternative considered: custom property-scoring branch; rejected due to duplicated logic.

4. Keep existing UI shell and add property-specific prompt/option rendering within current quiz screen.
   - Rationale: Delivers feature with minimal UX churn and preserves testable phase behavior.
   - Alternative considered: separate property-question component tree; deferred until question types grow further.

## Risks / Trade-offs

- [Risk] Plants with sparse metadata reduce available property-question pool → Mitigation: dynamically mix existing question types when property candidates are insufficient.
- [Risk] Distractor generation could create ambiguous options → Mitigation: enforce uniqueness and minimum option quality checks before including a question.
- [Risk] Added question variants increase rendering branch complexity → Mitigation: keep variant handling centralized and covered by targeted tests.

## Migration Plan

1. Extend quiz question type definitions to include property-based variants.
2. Update question generation to produce a mixed set of existing and property-based questions.
3. Update quiz rendering for property prompts and options.
4. Update/extend tests for generation, scoring, and review compatibility.
5. Run lint/tests/build and fix regressions before merge.

## Open Questions

- Which exact property set should be enabled initially (family only vs family + growth/native range)?
- Should property-question weighting be fixed or configurable per quiz session?
