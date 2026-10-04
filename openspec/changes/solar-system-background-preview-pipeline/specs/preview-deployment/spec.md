# Spec Delta

## Purpose

Defines the `[PREVIEW]` pull-request pipeline that deploys the site to `dev.ethantrevizo.com`,
the dev infrastructure it manages, its Lighthouse performance gate and its isolation from prod.

## ADDED Requirements

### Requirement: Dev hosting stack
A CloudFormation stack in `us-east-2` SHALL create a new S3 bucket, a CloudFront distribution
and a Route 53 record for `dev.ethantrevizo.com` in the existing `ethantrevizo.com` hosted zone
in the same account. [M-4]

#### Scenario: Stack serves the dev domain
- **WHEN** the dev stack has been created and a build published
- **THEN** `https://dev.ethantrevizo.com` serves the site through the new CloudFront
  distribution from the new bucket

### Requirement: Certificate stack in us-east-1
A separate CloudFormation stack in `us-east-1` SHALL hold only the ACM certificate for
`dev.ethantrevizo.com`, which the dev CloudFront distribution uses. [M-5]

#### Scenario: Certificate region
- **WHEN** the stacks are deployed
- **THEN** the certificate for `dev.ethantrevizo.com` lives in a `us-east-1` stack that
  contains no other resources

### Requirement: Preview trigger
A GitHub Actions workflow in `.github/workflows/` SHALL run for pull requests into `main` whose
title starts with `[PREVIEW]`, and SHALL NOT deploy for other pull requests. [M-3]

#### Scenario: Preview PR opened
- **WHEN** a pull request into `main` is opened with a title starting with `[PREVIEW]`
- **THEN** the workflow creates or updates both stacks, builds the static export and publishes
  it to the dev bucket

#### Scenario: Ordinary PR
- **WHEN** a pull request into `main` has a title that does not start with `[PREVIEW]`
- **THEN** no preview deployment happens

### Requirement: Redeploy on new commits
The preview SHALL redeploy automatically on every new commit pushed to the `[PREVIEW]` pull
request. [M-5]

#### Scenario: Commit pushed
- **WHEN** a new commit is pushed to an open `[PREVIEW]` pull request
- **THEN** the workflow rebuilds and republishes the preview

### Requirement: Single serialized preview
Only one dev preview SHALL exist at a time. Deploys SHALL be serialized so the newest one wins,
and a preview SHALL stay live until the next preview replaces it. [M-4]

#### Scenario: Newer deploy wins
- **WHEN** two preview deploys are triggered close together
- **THEN** they do not run concurrently, and `dev.ethantrevizo.com` ends up serving the newer one

#### Scenario: New preview PR replaces the old one
- **WHEN** a new `[PREVIEW]` pull request is opened
- **THEN** its build replaces whatever was live on `dev.ethantrevizo.com`

#### Scenario: Preview persists
- **WHEN** the `[PREVIEW]` pull request is closed or merged
- **THEN** the preview stays live until the next preview deploy

### Requirement: Lighthouse performance gate
After publishing, the workflow SHALL run Lighthouse with the desktop preset against
`dev.ethantrevizo.com` and SHALL fail if the performance score is below a configurable threshold
whose initial value is 90. [M-4]

#### Scenario: Score below threshold
- **WHEN** the Lighthouse desktop performance score is below the configured threshold
- **THEN** the workflow run fails and reports the score

#### Scenario: Score at or above threshold
- **WHEN** the score is at or above the configured threshold
- **THEN** the Lighthouse step passes

#### Scenario: Threshold changed
- **WHEN** the configured threshold value is changed
- **THEN** the gate uses the new value without workflow logic changes

### Requirement: Prod isolation
The pipeline SHALL NOT read from, write to or modify the prod S3 bucket `ethantrevizo.com` or the
CloudFront distribution `E130ND0ZBIO9C6`, and SHALL NOT perform any production deployment.
[M-3, M-4]

#### Scenario: After pipeline runs
- **WHEN** any number of preview pipeline runs have completed
- **THEN** the bucket `ethantrevizo.com` and distribution `E130ND0ZBIO9C6` are unchanged

#### Scenario: Merge to main
- **WHEN** a pull request is merged into `main`
- **THEN** no production deployment is triggered
