## ADDED Requirements

### Requirement: Search uses local-first plant info resolution
The system SHALL resolve searched plant information from known local data before attempting any remote plant-information download.

#### Scenario: Known plant search
- **WHEN** a user searches for a plant that already exists in known local data
- **THEN** the system returns the local plant information and does not initiate a remote download

### Requirement: Remote download only on local miss
The system SHALL attempt remote plant-information download only when no known local record is found for the searched plant.

#### Scenario: Unknown plant search
- **WHEN** a user searches for a plant that is not found in known local data
- **THEN** the system initiates remote plant-information download and returns the fetched result
