## ADDED Requirements

### Requirement: Full-screen timeline sections
The system SHALL display each timeline entry as a full-viewport-height (100vh) section with scroll-snap alignment.

#### Scenario: Timeline takes full viewport
- **WHEN** user views any timeline entry
- **THEN** the entry section occupies exactly 100vh with no overflow from adjacent entries

#### Scenario: Scroll snap alignment
- **WHEN** user scrolls partially between two entries
- **THEN** the viewport snaps to the nearest entry boundary

### Requirement: Configurable timeline data
The system SHALL render timeline entries from the site configuration, where each entry contains date, title, description, and image URL.

#### Scenario: Display configured entry
- **WHEN** a timeline entry is configured with date "2023-05-20", title "第一次见面", description "那天阳光很好", and image "pic1.jpg"
- **THEN** the system displays the date, title, description, and image for that entry

#### Scenario: Multiple entries in order
- **WHEN** configuration contains 3 entries in chronological order
- **THEN** the system renders 3 full-screen sections in the same order

### Requirement: Scroll-driven entry animations
The system SHALL animate timeline content (title, description, image) as each entry scrolls into view using Framer Motion.

#### Scenario: Entry animates in on scroll
- **WHEN** a timeline entry scrolls into the viewport
- **THEN** the entry's title, description, and image animate from hidden to visible with a smooth transition

#### Scenario: Entry animates out on scroll away
- **WHEN** a timeline entry scrolls out of the viewport
- **THEN** the entry content transitions back to hidden state

### Requirement: Date indicator and navigation dots
The system SHALL display a side indicator showing the current position in the timeline with clickable navigation dots.

#### Scenario: Current position highlighted
- **WHEN** user is viewing the 2nd timeline entry
- **THEN** the 2nd navigation dot is highlighted and others are dimmed

#### Scenario: Click to navigate
- **WHEN** user clicks the 3rd navigation dot
- **THEN** the viewport scrolls to the 3rd timeline entry
