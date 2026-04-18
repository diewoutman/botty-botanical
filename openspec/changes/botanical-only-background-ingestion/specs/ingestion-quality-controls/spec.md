## ADDED Requirements

### Requirement: Ingestion applies deterministic rejection filters
The system SHALL apply deterministic pre-validation rejection rules to eliminate obviously non-botanical candidates before expensive taxonomy validation.

#### Scenario: Candidate rejected by blacklist term
- **WHEN** a candidate title or snippet matches a configured non-botanical rejection pattern
- **THEN** the candidate is rejected before taxonomy lookup

#### Scenario: Disambiguation/list pages are rejected
- **WHEN** a candidate is identified as a disambiguation or list-style page
- **THEN** the candidate is rejected and excluded from ingestion

### Requirement: Rejection and acceptance reasons are tracked
The system SHALL record ingestion outcomes with categorized reasons for both accepted and rejected candidates.

#### Scenario: Rejection reason is captured
- **WHEN** a candidate is rejected during ingestion
- **THEN** the system increments a rejection counter for the specific rejection reason category

#### Scenario: Acceptance is captured
- **WHEN** a candidate passes filtering and botanical validation
- **THEN** the system increments acceptance counters and includes the candidate in quality metrics

### Requirement: Ingestion guardrails are configurable
The system MUST support configurable ingestion guardrails for target count, batch size, and source query seeds.

#### Scenario: Target count limits ingestion
- **WHEN** the number of accepted background entries reaches the configured target
- **THEN** ingestion stops adding additional background entries for the current run

#### Scenario: Query seed configuration influences coverage
- **WHEN** ingestion starts
- **THEN** the configured seed set is used to drive candidate discovery order and breadth
