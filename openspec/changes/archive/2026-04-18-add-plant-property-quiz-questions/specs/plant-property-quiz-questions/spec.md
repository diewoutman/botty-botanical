## ADDED Requirements

### Requirement: Quiz includes plant property question types
The system SHALL generate quiz questions that test plant properties in addition to existing name/image question types.

#### Scenario: Mixed question generation
- **WHEN** a quiz is started with sufficient plant data
- **THEN** the generated question set includes at least one property-based question and can include existing question types

#### Scenario: Insufficient property data
- **WHEN** available plants do not have enough valid property values or distractors for a property question
- **THEN** the system skips invalid property questions and continues generating remaining quiz questions from supported types

### Requirement: Property question answers are scored in existing flow
The system MUST evaluate property-question answers using the same scoring flow used by other question types.

#### Scenario: Correct property answer
- **WHEN** a user selects the correct option for a property-based question
- **THEN** the answer is recorded as correct and contributes to final score

#### Scenario: Incorrect property answer
- **WHEN** a user selects an incorrect option for a property-based question
- **THEN** the answer is recorded as incorrect and contributes to final score accordingly

### Requirement: Quiz UI renders property prompts and options
The system SHALL render readable prompts and answer options for property-based quiz questions.

#### Scenario: Property question presentation
- **WHEN** the active quiz question is property-based
- **THEN** the quiz screen shows the plant context and property prompt with selectable options

#### Scenario: Review compatibility
- **WHEN** a completed quiz contains property-based questions
- **THEN** quiz review/results views render without errors and preserve answer correctness feedback
