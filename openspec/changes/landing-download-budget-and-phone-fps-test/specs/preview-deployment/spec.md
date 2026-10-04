# Spec Delta

## ADDED Requirements

### Requirement: Landing page download limits
The `[PREVIEW]` pipeline SHALL fail when the landing page download is over a total limit or
over a JavaScript limit. The total limit starts at 1,000 KB and the JavaScript limit starts at
500 KB. Both limits SHALL be settings that can be changed without changing code. [M-10]

#### Scenario: Total download over the limit
- **WHEN** a `[PREVIEW]` run measures a landing page download above the configured total limit
- **THEN** the run fails and reports the measured total and the limit

#### Scenario: JavaScript over the limit
- **WHEN** a `[PREVIEW]` run measures landing page JavaScript above the configured JavaScript
  limit
- **THEN** the run fails and reports the measured JavaScript size and the limit

#### Scenario: Within both limits
- **WHEN** the landing page download is within both the total and the JavaScript limit
- **THEN** the download-limit check passes

#### Scenario: Limits changed through settings
- **WHEN** either limit setting is changed
- **THEN** the check uses the new value, with no code or workflow logic changes
