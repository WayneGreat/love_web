## ADDED Requirements

### Requirement: Envelope appearance
The system SHALL render a visually recognizable envelope component after the last timeline entry, styled with CSS (no images required for the envelope shape).

#### Scenario: Envelope visible at bottom
- **WHEN** user scrolls past all timeline entries
- **THEN** an envelope component is displayed in the center of the viewport

### Requirement: Envelope open animation
The system SHALL animate the envelope opening when the user clicks or interacts with it, using a flap rotation (rotateX) and letter slide-up animation.

#### Scenario: Click to open envelope
- **WHEN** user clicks the closed envelope
- **THEN** the envelope flap rotates upward (rotateX) and the letter paper slides up from inside

#### Scenario: Animation timing
- **WHEN** the envelope opens
- **THEN** the flap rotates first, then the letter slides up with a staggered delay

### Requirement: Letter content display
The system SHALL display configurable letter text inside the opened envelope, using a handwriting-style font.

#### Scenario: Show configured letter text
- **WHEN** the envelope is opened and configuration contains letter text "亲爱的，这封信是写给你的..."
- **THEN** the letter text is displayed inside the envelope in a handwriting font

### Requirement: Envelope close
The system SHALL allow the user to close the opened envelope and return to the closed state.

#### Scenario: Click to close
- **WHEN** user clicks the opened envelope or a close indicator
- **THEN** the letter slides back down, the flap closes, and the envelope returns to closed state
