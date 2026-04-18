## ADDED Requirements

### Requirement: Support multiple UI languages
The system SHALL provide UI translations for Dutch, English, German, French, and Spanish.

#### Scenario: Switching UI language
- **WHEN** user selects different language in settings
- **THEN** the system SHALL immediately switch all UI text
- **AND** the system SHALL persist language preference
- **AND** the system SHALL reload current page with new translations

#### Scenario: Auto-detecting language
- **WHEN** app launches for first time
- **THEN** the system SHALL detect browser language
- **AND** the system SHALL use Dutch if browser is Dutch
- **AND** the system SHALL fall back to English for unsupported languages

### Requirement: Provide complete translation files
The system SHALL maintain translation files for all supported languages.

#### Scenario: Loading translations
- **WHEN** app initializes
- **THEN** the system SHALL load translation file for selected language
- **AND** the system SHALL load English as fallback
- **AND** missing translations SHALL display in English

### Requirement: Display plant names in multiple languages
The system SHALL show plant common names in all available languages.

#### Scenario: Viewing plant with translations
- **WHEN** user views plant detail page
- **THEN** the system SHALL display common name in current UI language prominently
- **AND** the system SHALL display other available language names
- **AND** the Latin name SHALL always be displayed

#### Scenario: Plant missing translation for current language
- **WHEN** user views plant without translation in current UI language
- **THEN** the system SHALL display English name as fallback
- **AND** the system SHALL indicate name is not available in current language

### Requirement: Support RTL languages (future-proofing)
The system SHALL be architected to support RTL languages.

#### Scenario: RTL layout support
- **WHEN** future RTL language is added
- **THEN** the system SHALL support RTL text direction
- **AND** layouts SHALL adapt to RTL direction
- **AND** icons and directional elements SHALL flip appropriately

### Requirement: Maintain Latin names consistently
The system SHALL always display Latin names regardless of UI language.

#### Scenario: Latin name visibility
- **WHEN** user views any plant
- **THEN** the Latin name SHALL be displayed
- **AND** the Latin name SHALL be prominently styled
- **AND** the Latin name SHALL be used as identifier

### Requirement: Support language-specific search
The system SHALL allow searching using any supported language.

#### Scenario: Searching in Dutch
- **WHEN** UI language is set to English
- **AND** user searches using Dutch term "zonnebloem"
- **THEN** the system SHALL find matching plants
- **AND** the system SHALL search across all language names

### Requirement: Format dates and numbers locally
The system SHALL format locale-specific content appropriately.

#### Scenario: Displaying dates
- **WHEN** displaying dates (e.g., last updated)
- **THEN** the system SHALL format according to locale conventions
- **AND** Dutch locale SHALL use DD-MM-YYYY format

### Requirement: Handle missing translations gracefully
The system SHALL never break when translations are incomplete.

#### Scenario: Missing UI translation key
- **WHEN** translation key is missing for current language
- **THEN** the system SHALL display English fallback
- **AND** the system SHALL log missing translation for development
- **AND** the app SHALL continue functioning normally
