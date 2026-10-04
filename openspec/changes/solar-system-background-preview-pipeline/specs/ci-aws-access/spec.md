# Spec Delta

## Purpose

Defines how GitHub Actions gets access to AWS for the preview pipeline: through GitHub OIDC and an
IAM role created by a one-time bootstrap template, without long-lived AWS keys.

## ADDED Requirements

### Requirement: OIDC bootstrap template
The repository SHALL provide a one-time bootstrap CloudFormation template that creates the
GitHub OIDC identity provider and an IAM role that GitHub Actions assumes for this repository.
[M-4]

#### Scenario: Bootstrap deployed
- **WHEN** the stakeholder deploys the bootstrap template
- **THEN** the account has the GitHub OIDC provider and the role, and the role ARN is available
  as a stack output

### Requirement: Keyless workflow authentication
The preview workflow SHALL authenticate to AWS only by assuming the bootstrap role through GitHub
OIDC, with no long-lived AWS access keys stored in the repository or its secrets. [M-4]

#### Scenario: Workflow credentials
- **WHEN** the preview workflow runs
- **THEN** it obtains short-lived credentials by assuming the role via OIDC

### Requirement: Stakeholder setup instructions
The repository SHALL include step-by-step instructions for the stakeholder to deploy the bootstrap
template and add the role ARN to the repository. [M-4]

#### Scenario: Following the instructions
- **WHEN** the stakeholder follows the instructions from start to finish
- **THEN** the preview workflow can authenticate to AWS without any long-lived AWS keys
