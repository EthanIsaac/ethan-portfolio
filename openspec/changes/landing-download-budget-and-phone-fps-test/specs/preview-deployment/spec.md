# Spec Delta

## ADDED Requirements

### Requirement: Landing page download limits
The `[PREVIEW]` pipeline SHALL measure the landing page's uncompressed files in `out/`
[M-18, M-20] and SHALL fail when their total or their JavaScript is over its limit. The limits
start at 1,000 KB (1,024,000 bytes) total and 500 KB (512,000 bytes) JavaScript, and are
settings outside the workflow logic. [M-10]

#### Scenario: Starting limits
- **WHEN** the limit settings are inspected before any change
- **THEN** the total limit is 1,000 KB (1,024,000 bytes) and the JavaScript limit is 500 KB
  (512,000 bytes)

#### Scenario: Measurement basis
- **WHEN** a `[PREVIEW]` run measures the landing page after `yarn build`
- **THEN** it adds up the uncompressed sizes of the landing page's files in `out/`
- **AND** every file the landing page loads counts, including the deferred Solar System scene
  code
- **AND** it converts sizes and limits with 1 KB = 1,024 bytes

#### Scenario: Total download over the limit
- **WHEN** a `[PREVIEW]` run measures a landing page total above the configured total limit
- **THEN** the run fails and reports the measured total and the limit

#### Scenario: JavaScript over the limit
- **WHEN** a `[PREVIEW]` run measures landing page JavaScript above the configured JavaScript
  limit
- **THEN** the run fails and reports the measured JavaScript size and the limit

#### Scenario: Within both limits
- **WHEN** the landing page is within both the total and the JavaScript limit
- **THEN** the download-limit check passes

#### Scenario: Limits changed through settings
- **WHEN** either limit setting is changed
- **THEN** the check uses the new value, with no code or workflow logic changes
- **AND** the README preview section names where both settings live
