## ADDED Requirements

### Requirement: Search external plants via Wikipedia API
The system SHALL search for plants not in the bundled dataset.

#### Scenario: Searching external plants
- **WHEN** user searches for term not in bundled data
- **AND** user selects "Search Wikipedia" option
- **THEN** the system SHALL query Wikipedia search API
- **AND** the system SHALL display matching results
- **AND** results SHALL include title, snippet, and thumbnail if available

### Requirement: Fetch detailed plant information from Wikipedia
The system SHALL retrieve full plant details from Wikipedia when needed.

#### Scenario: Fetching plant details
- **WHEN** user taps external plant result
- **THEN** the system SHALL fetch page content from Wikipedia API
- **AND** the system SHALL extract description, categories, and images
- **AND** the system SHALL enrich with GBIF taxonomy data

### Requirement: Cache external plant data in IndexedDB
The system SHALL persist fetched external plant data locally.

#### Scenario: Caching plant data
- **WHEN** external plant data is fetched
- **THEN** the system SHALL store data in IndexedDB
- **AND** the system SHALL include timestamp for cache tracking
- **AND** the cache SHALL persist indefinitely until user clears

#### Scenario: Retrieving cached plant
- **WHEN** user searches for previously fetched plant
- **THEN** the system SHALL retrieve from IndexedDB cache
- **AND** the system SHALL NOT make additional API calls
- **AND** cached data SHALL display immediately

### Requirement: Fetch Wikimedia Commons images
The system SHALL retrieve images from Wikimedia Commons for external plants.

#### Scenario: Fetching plant images
- **WHEN** displaying external plant detail page
- **THEN** the system SHALL query Wikimedia Commons API for images
- **AND** the system SHALL extract image URLs and metadata
- **AND** the system SHALL extract photographer credits and licenses

### Requirement: Implement request throttling
The system SHALL rate-limit API requests to avoid being blocked.

#### Scenario: Making multiple API requests
- **WHEN** application makes Wikipedia API calls
- **THEN** requests SHALL be throttled to maximum 1 request per second
- **AND** concurrent requests SHALL be queued
- **AND** failed requests SHALL be retried with exponential backoff

### Requirement: Handle API failures gracefully
The system SHALL continue functioning when external APIs are unavailable.

#### Scenario: Wikipedia API timeout
- **WHEN** Wikipedia API request times out
- **THEN** the system SHALL display error message to user
- **AND** the system SHALL suggest trying again later
- **AND** bundled plants SHALL remain fully functional

#### Scenario: No internet connectivity
- **WHEN** device has no network connection
- **THEN** the system SHALL detect offline state
- **AND** external search SHALL be disabled
- **AND** cached external plants SHALL remain accessible

### Requirement: Fetch images with fallback strategy
The system SHALL attempt multiple sources for plant images.

#### Scenario: Primary image source fails
- **WHEN** Wikimedia Commons has no images for plant
- **THEN** the system SHALL attempt iNaturalist API
- **AND** if iNaturalist fails, display generated placeholder

### Requirement: Extract attribution metadata
The system SHALL capture image attribution information.

#### Scenario: Extracting image credits
- **WHEN** fetching Wikimedia Commons images
- **THEN** the system SHALL extract photographer name
- **AND** the system SHALL extract license type
- **AND** the system SHALL extract source URL
- **AND** attribution SHALL be displayed on detail page
