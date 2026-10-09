# Spec Delta

## MODIFIED Requirements

### Requirement: Frame-rate targets as configuration
The frame-rate targets SHALL be stored as config values: at least 30 fps while scrolling on a
phone and 60 fps on desktop. [M-4] They are targets to measure against. The scene SHALL NOT
lower its quality automatically while running, whatever the frame rate. [M-8] The team SHALL
record fps in the Chrome DevTools Performance panel during one scroll from the top of the
landing page to the bottom:
- Phone: the 'Pixel 7' device preset (412×915) with the CPU slowed 4x; passes when the average
  is at least 30 fps. [M-10; method chosen by the PM as delegated in M-18]
- Desktop: a 1920×1080 window with no CPU slowdown; passes when the average is at least
  60 fps. [M-18, M-20]

For each, the team SHALL post the average and lowest fps, the viewport and the throttling used
on the PR. [M-10, M-18, M-20]

#### Scenario: Targets are configurable
- **WHEN** the background's configuration is inspected
- **THEN** it contains the phone target (30) and desktop target (60) as values, not literals
  scattered through rendering code

#### Scenario: No automatic quality reduction
- **WHEN** the frame rate drops below a configured target while the page is open
- **THEN** the scene keeps the same quality and does not change its rendering settings

#### Scenario: Desktop scrolling measured in DevTools
- **WHEN** the team records fps in the Chrome DevTools Performance panel in a 1920×1080 window
  with no CPU slowdown, during one scroll from the top of the landing page to the bottom
- **THEN** the average fps is at least 60
- **AND** the average and lowest fps, viewport and throttling are posted on the PR

#### Scenario: Phone scrolling measured in DevTools
- **WHEN** the team records fps in the Chrome DevTools Performance panel with the 'Pixel 7'
  preset (412×915) and the CPU slowed 4x, during one scroll from the top of the landing page
  to the bottom
- **THEN** the average fps is at least 30
- **AND** the average and lowest fps, viewport and throttling are posted on the PR

### Requirement: Planetary rings
Jupiter, Saturn, Uranus and Neptune SHALL each be rendered with rings, and no other body SHALL
have a ring. [M-3, M-8]

#### Scenario: Giant planets have rings
- **WHEN** Jupiter, Saturn, Uranus or Neptune is in view
- **THEN** its ring system is visible

#### Scenario: No ring on other bodies
- **WHEN** any other body, including Haumea, is in view
- **THEN** it has no ring
