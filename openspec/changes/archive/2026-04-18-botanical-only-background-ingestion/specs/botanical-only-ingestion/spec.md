## ADDED Requirements

### Requirement: Only taxonomy-validated plants are admitted
The system SHALL admit background-ingested entries into the searchable plant catalog only when the candidate is validated as botanical (Plantae) through taxonomy verification.

#### Scenario: Candidate accepted after validation
- **WHEN** a background ingestion candidate is discovered from an external source
- **AND** taxonomy validation resolves the candidate to kingdom Plantae with acceptable confidence
- **THEN** the candidate is added to the in-app searchable plant dataset

#### Scenario: Candidate rejected when taxonomy is not botanical
- **WHEN** a background ingestion candidate is discovered
- **AND** taxonomy validation resolves to a non-Plantae kingdom or no valid match
- **THEN** the candidate is not added to the searchable plant dataset

### Requirement: Validation gate precedes user-visible inclusion
The system MUST complete botanical validation before any newly discovered background candidate is exposed to study/search views.

#### Scenario: Pending candidates are hidden
- **WHEN** a candidate has been discovered but validation has not completed
- **THEN** the candidate remains excluded from user-visible search and study result lists

#### Scenario: Failed validation prevents visibility
- **WHEN** candidate validation fails due to taxonomy mismatch or insufficient confidence
- **THEN** the candidate never appears in user-visible plant lists

### Requirement: Background ingestion remains incremental and non-blocking
The system SHALL continue background ingestion in batches while preserving responsive UI behavior for study and search interactions.

#### Scenario: Core dataset is available immediately
- **WHEN** the app starts
- **THEN** bundled core plant data is shown without waiting for background ingestion completion

#### Scenario: Validated external plants appear incrementally
- **WHEN** background ingestion processes new valid botanical candidates
- **THEN** they are merged into the searchable dataset incrementally without blocking active user interactions
