## ADDED Requirements

### Requirement: Display plant hero image
The system SHALL display a large hero image at the top of the detail page.

#### Scenario: Viewing detail page with bundled plant
- **WHEN** user opens detail page for bundled plant
- **THEN** the system SHALL display the bundled thumbnail as hero image
- **AND** the image SHALL be 100% width with 16:9 aspect ratio

#### Scenario: Viewing detail page with external plant
- **WHEN** user opens detail page for external (API-fetched) plant
- **THEN** the system SHALL display the fetched image or a placeholder
- **AND** the system SHALL cache the image for future offline use

### Requirement: Display multi-language plant names
The system SHALL display plant names in all configured languages.

#### Scenario: Viewing plant with full translations
- **WHEN** user views a plant with translations in all 5 languages
- **THEN** the system SHALL display the Dutch name prominently
- **AND** the system SHALL display other language names below
- **AND** the Latin name SHALL always be displayed prominently

#### Scenario: Viewing plant with partial translations
- **WHEN** user views a plant missing some translations
- **THEN** the system SHALL display available translations
- **AND** the system SHALL NOT display missing translations
- **AND** the Latin name SHALL always be visible

### Requirement: Tab navigation for General and Deep information
The system SHALL provide tabbed interface for switching between information depths.

#### Scenario: Switching to General tab
- **WHEN** user taps "General" tab
- **THEN** the system SHALL display general plant information
- **AND** the General tab SHALL be visually highlighted

#### Scenario: Switching to Deep tab
- **WHEN** user taps "Deep" tab
- **THEN** the system SHALL display deep plant information
- **AND** previously loaded General content SHALL be preserved

### Requirement: Display General tab content
The system SHALL display comprehensive general information about the plant.

#### Scenario: Viewing General information
- **WHEN** user is on General tab
- **THEN** the system SHALL display description paragraph
- **AND** the system SHALL display taxonomy (family, genus, etc.)
- **AND** the system SHALL display trait badges (sun, water, hardiness, etc.)
- **AND** the system SHALL display native range information
- **AND** the system SHALL display growth habit

### Requirement: Display Deep tab content
The system SHALL display in-depth historical and cultural information.

#### Scenario: Viewing Deep information
- **WHEN** user is on Deep tab
- **THEN** the system SHALL display history section
- **AND** the system SHALL display etymology (name origin)
- **AND** the system SHALL display cultural significance
- **AND** the system SHALL display traditional uses
- **AND** the system SHALL display modern uses
- **AND** the system SHALL display conservation status

### Requirement: Display image gallery
The system SHALL display multiple images when available.

#### Scenario: Viewing image gallery
- **WHEN** user views detail page with multiple images
- **THEN** the system SHALL display thumbnail gallery
- **AND** tapping a thumbnail SHALL enlarge the image
- **AND** user SHALL be able to swipe between images

### Requirement: Display attribution and sources
The system SHALL display image attribution and data sources.

#### Scenario: Viewing bundled plant attribution
- **WHEN** user scrolls to bottom of detail page
- **THEN** the system SHALL display image photographer credits
- **AND** the system SHALL display image licenses
- **AND** the system SHALL display data sources (Wikipedia, GBIF, etc.)

#### Scenario: Viewing external plant attribution
- **WHEN** user views external plant detail page
- **THEN** the system SHALL display full Wikimedia Commons attribution
- **AND** the system SHALL provide link to Wikipedia source page
- **AND** the system SHALL display all applicable licenses

### Requirement: Provide offline download option
The system SHALL allow users to download external plants for offline use.

#### Scenario: Downloading external plant for offline
- **WHEN** user views external plant NOT in bundled set
- **THEN** the system SHALL display "Download for offline" button
- **AND** tapping the button SHALL cache all plant data and images
- **AND** the system SHALL display download progress
