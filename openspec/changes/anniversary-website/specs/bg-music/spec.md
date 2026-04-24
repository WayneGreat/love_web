## ADDED Requirements

### Requirement: Background music playback
The system SHALL play background music from a configurable audio URL using the HTML5 audio element.

#### Scenario: Music source from config
- **WHEN** the site configuration specifies bgMusic as "music.mp3"
- **THEN** the audio element's src is set to the configured URL

### Requirement: Play/pause control
The system SHALL provide a floating play/pause button that allows the user to control background music at any time.

#### Scenario: Toggle playback
- **WHEN** user clicks the music control button while music is playing
- **THEN** the music pauses and the button icon changes to "play"

#### Scenario: Resume playback
- **WHEN** user clicks the music control button while music is paused
- **THEN** the music resumes and the button icon changes to "pause"

### Requirement: Auto-play with browser policy handling
The system SHALL attempt to auto-play music on site load, and if blocked by browser policy, SHALL start playback on the first user interaction.

#### Scenario: Auto-play succeeds
- **WHEN** the site loads and browser allows auto-play
- **THEN** background music starts automatically

#### Scenario: Auto-play blocked
- **WHEN** the site loads and browser blocks auto-play
- **THEN** the music control button shows "play" state and music starts on the first user interaction (scroll, click, etc.)

### Requirement: Music control visibility
The system SHALL display the music control button as a fixed-position element that remains visible during scrolling.

#### Scenario: Button always visible
- **WHEN** user scrolls to any position on the page
- **THEN** the music control button is visible in a fixed corner of the viewport
