## ADDED Requirements

### Requirement: Base-aware static asset URL resolution
The application SHALL resolve bundled static asset URLs using the configured runtime base path so assets load correctly when deployed under a repository subpath or non-root host path.

#### Scenario: JSON asset load on GitHub Pages
- **WHEN** the app is hosted under a GitHub Pages repository path and requests bundled JSON assets
- **THEN** the request URL includes the configured base path and the asset is loaded successfully

#### Scenario: Root deployment compatibility
- **WHEN** the app is hosted at domain root
- **THEN** base-aware URL resolution still produces valid asset URLs without requiring environment-specific code changes

### Requirement: Wikipedia request pacing and retry policy
The application SHALL apply a client-side request policy for Wikipedia lookups that limits request burst rate and retries HTTP 429/transient failures with bounded exponential backoff.

#### Scenario: Burst search input
- **WHEN** multiple Wikipedia lookups are initiated in rapid succession
- **THEN** outbound requests are paced according to the configured minimum interval

#### Scenario: HTTP 429 response received
- **WHEN** a Wikipedia request returns HTTP 429
- **THEN** the app retries using bounded exponential backoff and stops after the configured retry limit

### Requirement: Graceful fallback after retry exhaustion
The application SHALL provide a deterministic fallback state when Wikipedia requests continue failing after retry limits are exhausted.

#### Scenario: Persistent rate limiting
- **WHEN** all retry attempts fail due to continued 429 or transient upstream errors
- **THEN** the app returns a non-crashing fallback result/state and surfaces a user-appropriate message indicating temporary unavailability
