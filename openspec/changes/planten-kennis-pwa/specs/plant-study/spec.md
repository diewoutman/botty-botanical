## ADDED Requirements

### Requirement: Display plant cards in grid layout
The system SHALL display plants in a responsive card grid on the study page.

#### Scenario: Viewing study page
- **WHEN** user navigates to the study page
- **THEN** the system SHALL display plant cards in a responsive grid
- **AND** each card SHALL show the plant thumbnail, primary common name, and Latin name
- **AND** cards SHALL display up to 4 trait badges (sun, water, hardiness, etc.)

### Requirement: Search plants by name
The system SHALL provide real-time search functionality across all plant names.

#### Scenario: Searching by Dutch name
- **WHEN** user types "zonnebloem" in the search field
- **THEN** the system SHALL display plants matching "zonnebloem" in any language
- **AND** the search SHALL match partial strings
- **AND** results SHALL update within 300ms of typing

#### Scenario: Searching by Latin name
- **WHEN** user types "helianthus" in the search field
- **THEN** the system SHALL display plants with Latin names containing "helianthus"
- **AND** Latin name matches SHALL be prioritized in results

#### Scenario: No search results in bundled data
- **WHEN** user searches for a term not found in bundled plants
- **THEN** the system SHALL display "No plants found"
- **AND** the system SHALL offer to "Search Wikipedia" for external plants

### Requirement: Filter plants by category
The system SHALL allow filtering plants by category (tree, flower, shrub, herb, etc.).

#### Scenario: Filtering by category
- **WHEN** user selects "Trees" from the category filter
- **THEN** the system SHALL display only plants with category "tree"
- **AND** the search results count SHALL update

#### Scenario: Combining search and filter
- **WHEN** user has active search term "eik" AND selects category "tree"
- **THEN** the system SHALL display only trees matching "eik"

### Requirement: Infinite scroll loading
The system SHALL implement infinite scroll for performance with large datasets.

#### Scenario: Scrolling through plants
- **WHEN** user scrolls to bottom of plant grid
- **THEN** the system SHALL load next 20 plants
- **AND** display a loading indicator during fetch
- **AND** loaded plants SHALL persist in view

### Requirement: Card interaction
The system SHALL navigate to detail page when user taps a plant card.

#### Scenario: Tapping a plant card
- **WHEN** user taps on any plant card
- **THEN** the system SHALL navigate to the plant detail page
- **AND** the detail page SHALL display the selected plant's full information
