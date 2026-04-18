## ADDED Requirements

### Requirement: Header back button is available on nested routes
The system SHALL provide an in-app back button in the header for pages configured as non-root routes.

#### Scenario: Nested route shows back button
- **WHEN** a page is configured to enable header back navigation
- **THEN** the header renders a visible back button control

#### Scenario: Root tab route hides back button
- **WHEN** the user is on a root tab route (study, quiz, settings)
- **THEN** the header does not render a back button

### Requirement: Back action respects navigation history with fallback
The system MUST navigate to the previous route when history is available, and MUST navigate to a configured fallback route when history is not available.

#### Scenario: Internal navigation returns to previous route
- **WHEN** the user opens a nested page from another app route and taps back
- **THEN** the app navigates to the previous route in history

#### Scenario: Direct deep link uses fallback route
- **WHEN** the user lands directly on a nested route without prior in-app history and taps back
- **THEN** the app navigates to the configured fallback route

### Requirement: Back button behavior is reusable through shared header API
The system SHALL expose back-button behavior through the shared header component API so pages can configure it consistently.

#### Scenario: Page opts into back behavior
- **WHEN** a page passes back-button configuration to the shared header component
- **THEN** the page receives standardized back button rendering and behavior
