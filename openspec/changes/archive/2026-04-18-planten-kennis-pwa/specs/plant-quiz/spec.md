## ADDED Requirements

### Requirement: Generate 10-question quiz
The system SHALL generate a quiz with exactly 10 questions.

#### Scenario: Starting a new quiz
- **WHEN** user taps "Start Quiz" button
- **THEN** the system SHALL generate 10 random questions
- **AND** the system SHALL select questions from bundled and cached plants only
- **AND** the system SHALL randomize question order

### Requirement: Support image-to-Latin-name question type
The system SHALL generate questions showing an image with Latin name options.

#### Scenario: Type A question displayed
- **WHEN** a Type A question is presented
- **THEN** the system SHALL display a plant image prominently
- **AND** the system SHALL display 4 Latin name options
- **AND** exactly one option SHALL be correct

#### Scenario: Answering Type A question correctly
- **WHEN** user selects correct Latin name for displayed image
- **THEN** the system SHALL mark answer as correct
- **AND** the system SHALL show visual confirmation
- **AND** the system SHALL proceed to next question

#### Scenario: Answering Type A question incorrectly
- **WHEN** user selects incorrect Latin name
- **THEN** the system SHALL mark answer as incorrect
- **AND** the system SHALL highlight correct answer
- **AND** the system SHALL show visual indication of wrong choice

### Requirement: Support name-to-image question type
The system SHALL generate questions showing a name with image options.

#### Scenario: Type B question displayed
- **WHEN** a Type B question is presented
- **THEN** the system SHALL display plant common name (localized) and Latin name
- **AND** the system SHALL display 4 image options
- **AND** exactly one image SHALL be correct

#### Scenario: Answering Type B question
- **WHEN** user selects an image
- **THEN** the system SHALL evaluate correctness
- **AND** provide visual feedback
- **AND** proceed to next question

### Requirement: Randomize question types
The system SHALL mix Type A and Type B questions randomly.

#### Scenario: Quiz with mixed question types
- **WHEN** quiz is generated
- **THEN** approximately 50% of questions SHALL be Type A
- **AND** approximately 50% of questions SHALL be Type B
- **AND** question types SHALL be randomly distributed

### Requirement: Display quiz progress
The system SHALL show user's progress through the quiz.

#### Scenario: Viewing quiz progress
- **WHEN** user is taking quiz
- **THEN** the system SHALL display current question number (e.g., "Question 3 of 10")
- **AND** the system SHALL display progress bar or indicator

### Requirement: Calculate and display final score
The system SHALL calculate and display score after quiz completion.

#### Scenario: Completing quiz
- **WHEN** user answers 10th question
- **THEN** the system SHALL calculate score (correct answers / 10)
- **AND** display score as percentage
- **AND** display number of correct answers

#### Scenario: Viewing high score
- **WHEN** user views quiz page
- **THEN** the system SHALL display previous best score
- **AND** the system SHALL store high score in local storage
- **AND** new high scores SHALL replace old ones

### Requirement: Allow quiz review
The system SHALL allow users to review quiz answers after completion.

#### Scenario: Reviewing quiz results
- **WHEN** user completes quiz
- **THEN** the system SHALL offer "Review Answers" option
- **AND** review mode SHALL show each question with user's answer
- **AND** review mode SHALL indicate correct/incorrect for each answer
- **AND** review mode SHALL show correct answer for wrong responses

### Requirement: Generate appropriate distractors
The system SHALL generate plausible incorrect answer options.

#### Scenario: Distractor selection for Type A
- **WHEN** generating options for Type A question
- **THEN** 3 distractors SHALL be randomly selected from plant pool
- **AND** distractors SHALL exclude the correct answer

#### Scenario: Distractor selection for Type B
- **WHEN** generating options for Type B question
- **THEN** 3 distractor images SHALL be randomly selected
- **AND** system SHALL prefetch images to avoid loading delays

### Requirement: Handle missing images gracefully
The system SHALL display placeholders when images are not available.

#### Scenario: Type B question with unloaded images
- **WHEN** Type B question requires images not yet cached
- **THEN** the system SHALL display colored placeholder with family icon
- **AND** the system SHALL display plant initials on placeholder
- **AND** the system SHALL load actual images in background
