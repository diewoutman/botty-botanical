## ADDED Requirements

### Requirement: Fetch plant data from multiple sources
The system SHALL aggregate plant data from Waarneming.nl, GBIF, Wikipedia, and iNaturalist.

#### Scenario: Fetching observation data
- **WHEN** pipeline runs
- **THEN** the system SHALL fetch observation counts from Waarneming.nl API
- **AND** the system SHALL fetch observation counts from iNaturalist API
- **AND** the system SHALL fetch observation counts from GBIF API

#### Scenario: Fetching Wikipedia page data
- **WHEN** processing popular plants
- **THEN** the system SHALL fetch page content from Wikipedia API
- **AND** the system SHALL extract descriptions and structured data
- **AND** the system SHALL fetch page view statistics

### Requirement: Implement Dutch-weighted popularity scoring
The system SHALL prioritize Dutch and European flora in the bundled dataset.

#### Scenario: Calculating plant popularity
- **WHEN** aggregating observation data
- **THEN** Dutch observations SHALL have weight 2.0
- **AND** European observations SHALL have weight 1.5
- **AND** global observations SHALL have weight 1.0
- **AND** manual priority boosts SHALL be applied for iconic plants

#### Scenario: Ranking plants by popularity
- **WHEN** generating top plant list
- **THEN** plants SHALL be sorted by weighted popularity score
- **AND** top 500-1000 plants SHALL be selected for bundling

### Requirement: Enrich plant data with taxonomy
The system SHALL fetch and include taxonomic information for each plant.

#### Scenario: Fetching taxonomy from GBIF
- **WHEN** enriching plant data
- **THEN** the system SHALL query GBIF species match API
- **AND** the system SHALL extract kingdom, phylum, class, order, family, genus
- **AND** the system SHALL extract synonyms and accepted name

### Requirement: Extract multi-language names
The system SHALL extract common names in multiple languages.

#### Scenario: Extracting names from Wikipedia
- **WHEN** processing Wikipedia data
- **THEN** the system SHALL extract names from page titles and redirects
- **AND** the system SHALL identify language-specific common names
- **AND** the system SHALL populate names_i18n object with available translations

### Requirement: Generate plant thumbnails
The system SHALL download and optimize images for bundled plants.

#### Scenario: Processing plant images
- **WHEN** pipeline processes image data
- **THEN** the system SHALL download images from Wikimedia Commons
- **AND** the system SHALL resize images to 400x400 pixels
- **AND** the system SHALL compress images to ~6KB each
- **AND** the system SHALL save as JPEG with 80% quality

#### Scenario: Handling missing images
- **WHEN** image download fails for a plant
- **THEN** the system SHALL log the error
- **AND** the system SHALL mark plant as having no thumbnail
- **AND** the pipeline SHALL continue with other plants

### Requirement: Categorize plants
The system SHALL assign category tags to each plant.

#### Scenario: Categorizing by growth form
- **WHEN** processing plant data
- **THEN** the system SHALL categorize as tree, shrub, herb, flower, grass, fern, or other
- **AND** categories SHALL be derived from taxonomy and Wikipedia categories

### Requirement: Generate search index
The system SHALL create optimized search index for client-side search.

#### Scenario: Building search index
- **WHEN** pipeline completes data enrichment
- **THEN** the system SHALL generate search-index.json
- **AND** index SHALL include all searchable terms (names, taxonomy)
- **AND** index SHALL include preview data for quick display

### Requirement: Split data into core and detail files
The system SHALL separate data into core (always loaded) and detail (lazy loaded) files.

#### Scenario: Generating output files
- **WHEN** pipeline finalizes
- **THEN** the system SHALL create plants-core.json with essential data
- **AND** the system SHALL create plants-detail.json with extended information
- **AND** the system SHALL store thumbnails in assets/images/thumbs/

### Requirement: Support incremental updates
The system SHALL support updating only changed data in future runs.

#### Scenario: Re-running pipeline
- **WHEN** pipeline runs on existing data
- **THEN** the system SHALL compare with previous output
- **AND** the system SHALL update only changed records when possible
- **AND** the system SHALL preserve manual overrides
