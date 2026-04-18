## ADDED Requirements

### Requirement: Automatic caching on external detail browse
The application SHALL automatically persist external plant detail data for offline use when a user opens an external plant detail page.

#### Scenario: Open external plant detail
- **WHEN** a user navigates to an external plant detail
- **THEN** the app fetches and stores the external plant detail data without requiring a manual download action

#### Scenario: Already cached external detail
- **WHEN** a user opens an external plant detail that is already cached
- **THEN** the app reuses cached data without requiring duplicate manual interaction

### Requirement: No manual download action on detail page
The application SHALL not render a manual “Download plant info” action on the plant detail page for external plants.

#### Scenario: External detail page controls
- **WHEN** a user views an external plant detail page
- **THEN** no explicit “Download plant info” button is shown

### Requirement: Non-blocking fallback on auto-cache failure
The application SHALL keep detail viewing usable if automatic cache persistence fails.

#### Scenario: Storage or network error during auto-cache
- **WHEN** automatic persistence fails while loading an external detail
- **THEN** the app does not crash and continues showing available detail content with graceful degradation
