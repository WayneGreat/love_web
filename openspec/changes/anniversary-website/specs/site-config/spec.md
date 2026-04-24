## ADDED Requirements

### Requirement: Centralized configuration file
The system SHALL read all customizable content from a single TypeScript configuration file (`src/config.ts`), including timeline entries, letter text, music URL, and theme settings.

#### Scenario: Config file structure
- **WHEN** the site loads
- **THEN** it reads from a typed configuration object containing fields: bgMusic, themeColor, timeline (array of entries), and letter (string)

### Requirement: Timeline entry configuration
The system SHALL support configuring each timeline entry with date, title, description, and image path.

#### Scenario: Entry fields
- **WHEN** a timeline entry is defined in config with date "2023-05-20", title "第一次见面", description "那天阳光很好", and image "pic1.jpg"
- **THEN** all four fields are rendered in the corresponding timeline section

### Requirement: Image asset management
The system SHALL reference images from the `public/images/` directory using relative paths in the configuration.

#### Scenario: Image path resolution
- **WHEN** a timeline entry's image is configured as "pic1.jpg"
- **THEN** the image is loaded from `public/images/pic1.jpg` and displayed in the timeline section

### Requirement: Theme color configuration
The system SHALL allow configuring the primary theme color and gradient through the configuration file.

#### Scenario: Custom theme colors
- **WHEN** the configuration specifies themeColor as "#fce4ec" and a gradient definition
- **THEN** the site applies these colors to backgrounds, accents, and particle effects

### Requirement: Letter text configuration
The system SHALL allow configuring the letter content displayed inside the envelope.

#### Scenario: Custom letter text
- **WHEN** the configuration specifies letter as "亲爱的，这是写给你的信..."
- **THEN** the envelope displays exactly this text when opened
