## MODIFIED Requirements

### Requirement: Automatic caching on external detail browse
The application SHALL automatically persist external plant detail data for offline use when a user opens an external plant detail page, and SHALL reuse existing known plant data without re-downloading when that plant is already available locally.

#### Scenario: Open external plant detail
- **WHEN** a user navigates to an external plant detail
- **THEN** the app fetches and stores the external plant detail data without requiring a manual download action

#### Scenario: Already cached external detail
- **WHEN** a user opens an external plant detail that is already cached
- **THEN** the app reuses cached data without requiring duplicate manual interaction

#### Scenario: Already known plant during lookup
- **WHEN** a plant lookup resolves to an existing known local plant record
- **THEN** the app serves the local record and does not trigger a new remote plant-information download
