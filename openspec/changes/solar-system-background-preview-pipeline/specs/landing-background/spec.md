# Spec Delta

## Purpose

Defines the procedurally generated Solar System scene rendered behind the landing page: which
bodies appear, how they look, how the view responds to scrolling and reduced motion, and the
performance it must hold.

## ADDED Requirements

### Requirement: Solar System scene replaces the star field
The landing page (`src/app/page.tsx`) SHALL render a three.js Solar System scene as its
background in place of the random star field, using the existing `three`, `@react-three/fiber`
and `@react-three/drei` dependencies. [M-1, M-2]

#### Scenario: Landing page shows the Solar System
- **WHEN** a visitor opens the landing page
- **THEN** the background shows the Solar System scene behind the page content
- **AND** the previous randomly generated rotating star field is no longer rendered

#### Scenario: Other pages unaffected
- **WHEN** any page other than the landing page is rendered
- **THEN** it does not render the Solar System scene

### Requirement: Foreground unchanged
The change SHALL NOT alter layout, typography, colours, nav bar or content of the site compared
with `development`. [M-3]

#### Scenario: Foreground matches development
- **WHEN** the landing page is compared with the `development` version
- **THEN** only the background differs

### Requirement: Exact set of bodies
The scene SHALL contain exactly these bodies and no others: the Sun; Mercury, Venus, Earth,
Mars, Jupiter, Saturn, Uranus, Neptune; the dwarf planets Pluto, Ceres, Eris, Haumea, Makemake;
and the moons Moon, Io, Europa, Ganymede, Callisto, Titan, Rhea, Iapetus, Dione, Tethys,
Enceladus, Mimas, Miranda, Ariel, Umbriel, Titania, Oberon, Triton, Charon. [M-4]

#### Scenario: All listed bodies present
- **WHEN** the scene's body list is inspected
- **THEN** it contains each of the 33 listed bodies exactly once

#### Scenario: No extra bodies
- **WHEN** the scene is rendered
- **THEN** no asteroid belt, Kuiper belt, or any moon or small body outside the list appears

### Requirement: Realistic procedural appearance
Each body SHALL have a photo-realistic look with accurate real colours and shapes, at a quality
good enough for a background rather than pixel-perfect. All surfaces SHALL be generated in code,
with no texture or model files. [M-2]

#### Scenario: No asset files loaded
- **WHEN** the landing page loads
- **THEN** the scene requests no image texture or 3D model files

#### Scenario: Recognisable bodies
- **WHEN** the stakeholder views the preview
- **THEN** each body's colour and shape resemble the real body

### Requirement: Planetary rings
Jupiter, Saturn, Uranus and Neptune SHALL each be rendered with rings. [M-3]

#### Scenario: Giant planets have rings
- **WHEN** Jupiter, Saturn, Uranus or Neptune is in view
- **THEN** its ring system is visible

### Requirement: Atmosphere glow on atmospheric planets only
An atmosphere glow SHALL be rendered on Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune,
and on no other body. [M-4]

#### Scenario: Glow on listed planets
- **WHEN** one of the seven listed planets is in view
- **THEN** it shows an atmosphere glow

#### Scenario: No glow elsewhere
- **WHEN** Mercury, a dwarf planet or a moon is in view
- **THEN** it shows no atmosphere glow

### Requirement: Glowing background stars
The scene SHALL include background stars with a realistic glow in addition to the Solar System
bodies. [M-2]

#### Scenario: Stars behind the bodies
- **WHEN** the scene is rendered
- **THEN** glowing stars are visible behind the bodies

### Requirement: Compressed artistic scale
Bodies SHALL be placed on a compressed, artistic scale that keeps their correct order from the
Sun and rough relative sizes, not true distances. [M-3]

#### Scenario: Order preserved
- **WHEN** the planets' distances from the Sun in the scene are compared
- **THEN** they increase in the real order Mercury through Neptune

#### Scenario: Relative sizes preserved
- **WHEN** two bodies' rendered sizes are compared
- **THEN** the larger real body is rendered larger

### Requirement: Scroll-driven camera drift
The camera SHALL drift smoothly as the page scrolls, along a path the developers choose. No body
needs to be framed for a particular section. [M-4]

#### Scenario: Camera moves with scroll
- **WHEN** the visitor scrolls the landing page
- **THEN** the camera moves smoothly through the scene in step with the scroll position

### Requirement: Static bodies and no interaction
Bodies SHALL NOT move on their own, and clicking a body SHALL do nothing. [M-2]

#### Scenario: Idle scene
- **WHEN** the page is open and the visitor does not scroll
- **THEN** no body moves

#### Scenario: Click on a body
- **WHEN** the visitor clicks a body
- **THEN** nothing happens

### Requirement: Reduced motion
When the OS "reduce motion" preference is enabled, the background SHALL show a still view with no
scroll-driven camera movement. [M-3]

#### Scenario: Reduce motion enabled
- **WHEN** a visitor with "reduce motion" enabled scrolls the landing page
- **THEN** the background view stays still

### Requirement: Same scene on mobile
Mobile visitors SHALL get the same scene as desktop visitors. [M-2]

#### Scenario: Mobile visitor
- **WHEN** the landing page is opened on a phone
- **THEN** the same bodies, rings, glow and stars are shown as on desktop

### Requirement: Frame-rate targets as configuration
The frame-rate targets SHALL be stored as config values: at least 30 fps while scrolling on a
mid-range phone and 60 fps on desktop. Scrolling SHALL meet those targets. [M-4]

#### Scenario: Targets are configurable
- **WHEN** the background's configuration is inspected
- **THEN** it contains the mobile target (30) and desktop target (60) as values, not literals
  scattered through rendering code

#### Scenario: Desktop scrolling
- **WHEN** the landing page is scrolled on desktop
- **THEN** it holds at least 60 fps

#### Scenario: Phone scrolling
- **WHEN** the landing page is scrolled on a mid-range phone
- **THEN** it holds at least 30 fps

### Requirement: Lean page load
The landing page SHALL stay lean enough to load in about 1 second on Wi-Fi. [M-3]

#### Scenario: Load on Wi-Fi
- **WHEN** the stakeholder opens the preview on Wi-Fi
- **THEN** the page loads in about 1 second, not minutes

### Requirement: Browser support
The landing page SHALL work on the latest desktop Chrome, Safari and Firefox, iOS Safari and
Android Chrome. [M-5]

#### Scenario: Supported browsers
- **WHEN** the landing page is opened in any of the listed browsers
- **THEN** the scene and page content render and scrolling works
