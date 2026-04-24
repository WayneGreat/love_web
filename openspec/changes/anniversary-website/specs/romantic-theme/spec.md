## ADDED Requirements

### Requirement: Pink gradient background
The system SHALL use a warm pink gradient background as the default theme, configurable via the site configuration.

#### Scenario: Default gradient background
- **WHEN** the site loads with default configuration
- **THEN** the background displays a pink gradient (e.g., #fce4ec to #f8bbd0)

#### Scenario: Custom theme color
- **WHEN** the site configuration specifies a different gradient
- **THEN** the background uses the configured gradient colors

### Requirement: Falling particle effects
The system SHALL display gently falling particles (hearts or petals) across the entire page using tsparticles.

#### Scenario: Particles visible on load
- **WHEN** the site loads
- **THEN** heart-shaped particles fall gently across the viewport with random positions and speeds

#### Scenario: Particle density
- **WHEN** the site loads with default configuration
- **THEN** approximately 30-50 particles are visible at any time, creating a subtle but noticeable effect

### Requirement: Handwriting font for letter content
The system SHALL use a handwriting-style Google Font (e.g., Dancing Script) for letter and timeline description text.

#### Scenario: Letter uses handwriting font
- **WHEN** letter text is displayed
- **THEN** the font family is a handwriting-style Google Font

### Requirement: Consistent warm color palette
The system SHALL apply a consistent warm/romantic color palette across all components (backgrounds, text, accents, buttons).

#### Scenario: Warm color consistency
- **WHEN** any component is rendered
- **THEN** its colors (backgrounds, borders, text accents) use the warm pink/rose palette defined in the theme configuration
