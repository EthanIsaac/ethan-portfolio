# Spec Delta

## MODIFIED Requirements

### Requirement: Frame-rate targets as configuration
The frame-rate targets SHALL be stored as config values: at least 30 fps while scrolling on a
phone and 60 fps on desktop. [M-4] They are targets to measure against. The scene SHALL NOT
lower its quality automatically while running, whatever the frame rate. [M-8] The team SHALL
measure the phone target in Chrome DevTools, with a phone-sized screen, the CPU slowed down
4x, while scrolling, and SHALL post the result on the PR. [M-10]

#### Scenario: Targets are configurable
- **WHEN** the background's configuration is inspected
- **THEN** it contains the mobile target (30) and desktop target (60) as values, not literals
  scattered through rendering code

#### Scenario: No automatic quality reduction
- **WHEN** the frame rate drops below a configured target while the page is open
- **THEN** the scene keeps the same quality and does not change its rendering settings

#### Scenario: Desktop scrolling
- **WHEN** the landing page is scrolled on desktop
- **THEN** it holds at least 60 fps

#### Scenario: Phone scrolling measured in DevTools
- **WHEN** the team scrolls the landing page in Chrome DevTools with a phone-sized screen and
  the CPU slowed down 4x
- **THEN** it holds at least 30 fps
- **AND** the result is posted on the PR

### Requirement: Planetary rings
Jupiter, Saturn, Uranus and Neptune SHALL each be rendered with rings, and no other body SHALL
have a ring. [M-3, M-8]

#### Scenario: Giant planets have rings
- **WHEN** Jupiter, Saturn, Uranus or Neptune is in view
- **THEN** its ring system is visible

#### Scenario: No ring on other bodies
- **WHEN** any other body, including Haumea, is in view
- **THEN** it has no ring
