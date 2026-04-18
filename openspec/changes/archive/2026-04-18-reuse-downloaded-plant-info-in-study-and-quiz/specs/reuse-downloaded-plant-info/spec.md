## ADDED Requirements

### Requirement: Study reuses downloaded plant info
The system SHALL incorporate available downloaded plant detail data when preparing plant information for Study.

#### Scenario: Cached detail exists for plant in Study
- **WHEN** Study loads a plant that has downloaded cached detail data
- **THEN** Study uses the cached-enriched fields according to defined merge precedence without requiring refetch

#### Scenario: Cached detail missing or unreadable in Study
- **WHEN** Study cannot read downloaded cached detail for a plant
- **THEN** Study falls back to bundled plant data and remains usable

### Requirement: Quiz reuses downloaded plant info
The system SHALL incorporate available downloaded plant detail data when preparing Quiz questions and option labels.

#### Scenario: Cached detail exists for quiz candidate plants
- **WHEN** Quiz builds questions from plants with downloaded cached detail
- **THEN** Quiz uses cached-enriched fields according to defined merge precedence and avoids duplicate fetches

#### Scenario: Cached detail unavailable for quiz candidate plants
- **WHEN** Quiz cannot access downloaded cached detail for some or all candidate plants
- **THEN** Quiz continues generating and rendering questions from bundled data without failure

### Requirement: Shared merge behavior is consistent across learning flows
The system MUST use a shared merge behavior for Study and Quiz so the same plant fields resolve consistently.

#### Scenario: Field precedence consistency
- **WHEN** both bundled and downloaded values exist for the same field
- **THEN** Study and Quiz resolve that field using the same precedence rules
