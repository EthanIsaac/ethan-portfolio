# Design

## Context

- `main` (6a45086) holds an older Pages-router layout plus the office files from `4efbcbd`
  (`.office/`, `openspec/`). `origin/development` holds the current App-router site under `src/`.
  Their merge base is `699bdae`, and `development` has deleted the root-level `components/`,
  `pages/`, `styles/` and `utils/` since then. A normal merge therefore yields development's tree
  plus the office files. The expected conflict is `package.json` (main's `ee60305` changed the
  `deploy` script), resolved by taking development's version.
- `next.config.js` on `development` already sets `output: 'export'` and unoptimized images, so
  `next build` writes a static site to `out/`.
- `three@^0.140`, `@react-three/fiber@^8`, `@react-three/drei@^9` are already present. Upgrades are
  out of scope unless the planets strictly need them.
- `.office/office.yaml` defines no test command, so verification uses `yarn build`, the
  pipeline and manual checks. CI (`.github/`) and infra paths are human-merge.

## Goals / Non-Goals

**Goals:** a visually convincing, cheap-to-render background, and a reproducible, keyless
preview pipeline that cannot reach prod.

**Non-Goals:** per-section camera framing, interactivity, orbital animation, and any prod or
monitoring work (see proposal, Out of scope).

## Decisions

The decisions below are starting points that the implementing developers own. None of them
adds a requirement.

- **Scene data in one config module.** Body catalogue (name, kind, parent, compressed distance,
  relative radius, colour palette, shape such as Haumea's elongation, ring/atmosphere flags) and
  tuning values (fps targets 30/60, star count, quality knobs) live in a single config module
  under `src/components/background/`. Rendering code reads from it. This makes the "exact body
  list", "rings" and "atmosphere" rules checkable in one place.
- **Procedural shading.** Use shader materials driven by noise functions (bands for gas giants,
  craters/maria for rocky bodies, a Fresnel shell for atmosphere glow, a radial-gradient ring
  disc, additive point sprites for glowing stars). Shared geometry with modest segment counts,
  instancing where it helps, and capped device pixel ratio on mobile. No texture or model
  files (spec: Realistic procedural appearance).
- **Camera path.** Map normalized scroll progress (0–1) to a spline through the scene, with
  damped interpolation for smoothness. Render on demand (`frameloop="demand"`) when there is no
  scroll, since bodies are static. Under `prefers-reduced-motion: reduce`, pin the camera at the
  path's start and ignore scroll.
- **Infra layout.** Templates in `infra/`: `bootstrap-oidc.yaml` (one-time),
  `dev-certificate.yaml` (us-east-1, ACM with DNS validation in the existing hosted zone) and
  `dev-site.yaml` (us-east-2: private S3 bucket with Origin Access Control, CloudFront using the
  certificate ARN passed from the us-east-1 stack's output, Route 53 alias records). The hosted
  zone is looked up by name `ethantrevizo.com` or passed as a parameter.
- **Least-privilege role.** The bootstrap role's trust policy is limited to this repository's
  pull-request workflow subject. Its permissions are scoped to the dev stacks' resources (dev
  bucket ARN, stacks by name, the hosted zone's record changes), with an explicit deny on
  `arn:aws:s3:::ethantrevizo.com*` and distribution `E130ND0ZBIO9C6`. This turns prod isolation
  into an IAM guarantee, not just a convention.
- **Workflow shape.** `on: pull_request` (types `opened`, `synchronize`, `reopened`, `edited`)
  targeting `main`, gated by `startsWith(github.event.pull_request.title, '[PREVIEW]')`.
  `concurrency: { group: dev-preview, cancel-in-progress: true }` serializes deploys so the newest
  wins. Steps: assume role (OIDC), deploy cert stack, deploy site stack, `yarn install
  --frozen-lockfile`, `yarn build`, `aws s3 sync out/ --delete` to the dev bucket, CloudFront
  invalidation of the dev distribution only, then Lighthouse.
- **Lighthouse gate.** Run Lighthouse CLI (or `treosh/lighthouse-ci-action`) with
  `--preset=desktop` against `https://dev.ethantrevizo.com`. The threshold lives in one config
  place (a repo variable with a default of 90, or a checked-in config file) that the step reads.
  The step's dependency is CI-only and does not touch the site's `package.json` dependencies.

## Risks / Trade-offs

- [Realism vs. performance on phones] → quality knobs in config. Measure on a real mid-range
  device (see proposal open question 2).
- [Lighthouse score dominated by WebGL main-thread work] → defer canvas mount until after first
  paint and code-split the scene. Keep the JS bundle small.
- [Cross-region stack dependency] → the workflow deploys the us-east-1 stack first and passes its
  output ARN as a parameter. The first ACM DNS validation can take minutes.
- [Lighthouse runs after publish, so a failing build is still live] → acceptable: the preview
  exists to be inspected, and the failure is visible on the PR.
- [Fork PRs get no OIDC token] → previews only work from branches in this repository.

## Migration Plan

1. Merge `development` → `main` (stakeholder `/merge`).
2. Stakeholder deploys the bootstrap template and sets the role ARN repo variable per the docs.
3. Land infra templates and the workflow. Open a `[PREVIEW]` PR to stand up the stacks.
4. Land background work. Each `[PREVIEW]` PR redeploys.

Rollback: delete the dev stacks. Prod is unaffected throughout.
