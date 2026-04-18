## Why

The quiz currently focuses on image/name recognition but does not test plant properties like family, growth habit, or native range. Adding property-based questions improves learning depth and helps users retain practical botanical knowledge.

## What Changes

- Add new quiz question formats that ask about plant properties (for example: family, growth habit, and native range).
- Extend quiz question generation to include property-based prompts alongside existing question types.
- Update quiz UI rendering and answer validation to support property-based options and correctness feedback.
- Ensure quiz review/results flows remain compatible with mixed question types.
- Add tests for generation, rendering, and scoring behavior of property-based questions.

## Capabilities

### New Capabilities
- `plant-property-quiz-questions`: Adds quiz behavior for generating, presenting, and evaluating questions about plant properties.

### Modified Capabilities
- None.

## Impact

- Affected code: quiz question generation logic, quiz page rendering, and quiz review/scoring components.
- Affected types: quiz question/answer models to represent property-based questions.
- Affected tests: quiz generation and UI behavior tests need coverage for new property question flows.
