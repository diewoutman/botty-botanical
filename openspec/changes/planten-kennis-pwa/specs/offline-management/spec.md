## ADDED Requirements

### Requirement: Detect online/offline status
The system SHALL monitor and respond to network connectivity changes.

#### Scenario: Going offline
- **WHEN** device loses network connection
- **THEN** the system SHALL display offline indicator
- **AND** external search functionality SHALL be disabled
- **AND** cached content SHALL remain accessible

#### Scenario: Going online
- **WHEN** device regains network connection
- **THEN** the system SHALL hide offline indicator
- **AND** external search functionality SHALL be enabled
- **AND** the system SHALL sync any pending operations

### Requirement: Cache visited external plants automatically
The system SHALL automatically cache external plants when visited.

#### Scenario: Caching on detail view
- **WHEN** user views external plant detail page
- **THEN** the system SHALL cache plant data automatically
- **AND** the system SHALL cache images automatically
- **AND** cached data SHALL be available offline immediately

### Requirement: Provide bulk offline download
The system SHALL allow users to download multiple plants for offline use.

#### Scenario: Initiating bulk download
- **WHEN** user taps "Download all for offline" in settings
- **THEN** the system SHALL display storage requirement estimate
- **AND** the system SHALL request user confirmation
- **AND** upon confirmation, start downloading all cached external plants

#### Scenario: Download progress tracking
- **WHEN** bulk download is in progress
- **THEN** the system SHALL display progress indicator
- **AND** the system SHALL show items downloaded / total items
- **AND** the system SHALL allow cancellation

### Requirement: Display storage usage
The system SHALL show user how much storage is being used.

#### Scenario: Viewing storage usage
- **WHEN** user opens settings page
- **THEN** the system SHALL display total storage used
- **AND** the system SHALL display breakdown by type (bundled, cached images, data)
- **AND** the system SHALL display available storage space

### Requirement: Allow manual cache clearing
The system SHALL provide option to clear cached data.

#### Scenario: Clearing cache
- **WHEN** user taps "Clear cached data" in settings
- **THEN** the system SHALL display confirmation dialog
- **AND** upon confirmation, delete all cached external plant data
- **AND** the system SHALL NOT delete bundled data
- **AND** the system SHALL NOT delete quiz scores or user settings

### Requirement: Implement cache size limits
The system SHALL enforce reasonable cache size limits.

#### Scenario: Approaching storage limit
- **WHEN** cache size exceeds 80% of available quota
- **THEN** the system SHALL display warning to user
- **AND** the system SHALL suggest clearing cache or downloading selectively

#### Scenario: Cache eviction
- **WHEN** cache exceeds maximum allowed size
- **THEN** the system SHALL evict least recently used items
- **AND** the system SHALL preserve favorited/downloaded plants

### Requirement: Support selective offline download
The system SHALL allow downloading specific plants for offline use.

#### Scenario: Downloading single plant
- **WHEN** user views external plant detail page
- **THEN** the system SHALL provide "Download for offline" button
- **AND** tapping button SHALL cache that specific plant
- **AND** system SHALL display confirmation when complete

### Requirement: Persist quiz scores and user preferences
The system SHALL store user data locally and persistently.

#### Scenario: Saving quiz results
- **WHEN** user completes quiz
- **THEN** the system SHALL store score in local storage
- **AND** the system SHALL store high score if applicable
- **AND** data SHALL persist across app restarts

#### Scenario: Saving user preferences
- **WHEN** user changes language setting
- **THEN** the system SHALL persist language preference
- **AND** preference SHALL apply on next app launch
