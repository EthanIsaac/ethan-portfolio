# Proposal: Solar System background + [PREVIEW] dev pipeline

## Why

The landing page background on `development` is a random, rotating star field
(`src/components/background/index.tsx` on `origin/development`). The stakeholder wants it
replaced by a procedurally generated three.js Solar System [M-1, M-2], and wants every change
to be reviewable on a live dev site (`dev.ethantrevizo.com`) built by a `[PREVIEW]` pull-request
pipeline before anything else happens [M-3, M-4]. `main` must first become the source of truth
by merging `development` into it [M-3].

## What Changes

- **Branch consolidation**: merge `development` into `main`, keeping the office files that
  were added on `main` in commit `4efbcbd` (`.office/`, `openspec/`) and taking everything else
  from `development` [M-3].
- **Landing background**: replace the random star field with a three.js Solar System scene
  behind the landing page (`src/app/page.tsx`), using the existing `three`,
  `@react-three/fiber` and `@react-three/drei` dependencies [M-1, M-2]. Only the background
  changes. Layout, typography, colours, nav bar and content stay as they are on `development` [M-3].
  - Bodies: the Sun, the 8 planets, the dwarf planets Pluto, Ceres, Eris, Haumea and Makemake,
    and the 19 major moons (Moon, Io, Europa, Ganymede, Callisto, Titan, Rhea, Iapetus, Dione,
    Tethys, Enceladus, Mimas, Miranda, Ariel, Umbriel, Titania, Oberon, Triton, Charon), and no
    others [M-4].
  - A photo-realistic look with accurate real colours and shapes, balanced against performance
    ("good enough as a background") [M-2]. All surfaces are procedural, with no texture or model
    files [M-2].
  - Rings on Jupiter, Saturn, Uranus and Neptune [M-3]. Atmosphere glow only on Venus, Earth,
    Mars, Jupiter, Saturn, Uranus and Neptune [M-4]. Background stars with a realistic glow [M-2].
  - Compressed, artistic scale with correct order and rough relative sizes [M-3].
  - Camera drifts smoothly with page scroll on a path the developers choose. No per-section
    framing [M-4]. Bodies don't move on their own and clicking does nothing [M-2]. With the OS
    "reduce motion" setting the view is still [M-3].
  - Mobile gets the same scene [M-2]. The page stays lean (about 1 s load on Wi-Fi) [M-3].
    Frame-rate targets of ≥30 fps (mid-range phone, while scrolling) and 60 fps (desktop) are
    stored as config values [M-4].
- **AWS access bootstrap**: a one-time CloudFormation template (GitHub OIDC provider + IAM role)
  and step-by-step instructions the stakeholder follows to deploy it and add the role ARN to the
  repo, with no long-lived AWS keys [M-4].
- **Dev infrastructure**: a CloudFormation stack in `us-east-2` with a new S3 bucket, a
  CloudFront distribution and a Route 53 record for `dev.ethantrevizo.com` in the existing
  `ethantrevizo.com` hosted zone (same account) [M-4]. A separate small stack in `us-east-1`
  holds only the ACM certificate for `dev.ethantrevizo.com` [M-5].
- **[PREVIEW] pipeline**: a new GitHub Actions workflow in `.github/workflows/` that runs on PRs
  into `main` whose title starts with `[PREVIEW]`. It creates or updates both stacks, builds the
  static export (`next.config.js` `output: 'export'`) and publishes it to the dev bucket [M-3].
  It redeploys on every new commit [M-5]. Deploys are serialized so the newest wins, and a
  single preview stays live until the next one replaces it [M-4]. It runs Lighthouse (desktop
  preset) against `dev.ethantrevizo.com` and fails below a configurable performance threshold
  that starts at 90 [M-4].
- **Guard rails**: the pipeline never touches the hand-made prod bucket `ethantrevizo.com` or
  CloudFront distribution `E130ND0ZBIO9C6` (the targets of the `deploy` script in
  `package.json`) [M-3].
- **Team process (documented, not automated)**: never more than one open PR with `[PREVIEW]`
  in its title [M-5]. When Lighthouse fails, the team fixes it and escalates to the stakeholder
  only after the check passes or after 3 failed fix attempts [M-4].

### Out of scope

- Any change beyond the background: layout, typography, colours, nav bar, content [M-3].
- Bringing the existing prod resources into CloudFormation or the pipeline. The stakeholder
  will delete them manually later [M-3].
- Deploying to prod on merge to `main`, or any production deployment [M-4].
- Retiring or changing the manual `deploy` script in `package.json` [M-4].
- Upgrading three.js, Next or other dependencies beyond what the planets strictly need [M-4].
- AWS monitoring, alerts and cost controls [M-4].
- Asteroid belt, Kuiper belt, and moons or small bodies outside the agreed list [M-4].
- Pages other than the landing page [M-2].

## Capabilities

### New Capabilities
- `landing-background`: the Solar System scene rendered behind the landing page: which bodies
  appear, how they look, how the camera responds to scroll and reduced motion, and its
  performance budget.
- `preview-deployment`: the `[PREVIEW]` pull-request pipeline and the dev infrastructure it
  manages (`dev.ethantrevizo.com`), including the Lighthouse gate and prod isolation.
- `ci-aws-access`: how GitHub Actions obtains AWS access (OIDC bootstrap template and the
  stakeholder's setup instructions).

### Modified Capabilities
_None. `openspec/specs/` has no existing capabilities._

## Impact

- Code: `src/components/background/` (rewritten), possibly new modules under it for bodies,
  shaders and config. `src/app/page.tsx` only as far as the background needs props.
- New files: `.github/workflows/` (preview workflow), CloudFormation templates and setup
  documentation (CI and infra paths are human-merge per `.office/README.md` / `office.yaml`).
- AWS (same account as `ethantrevizo.com`): new S3 bucket, CloudFront distribution, Route 53
  record, ACM certificate, IAM OIDC provider and role. Prod resources untouched.
- Dependencies: none added or upgraded unless strictly required for the planets [M-4].
- `.office/office.yaml` has no `commands.test` set, so task verification relies on
  `yarn build`, the pipeline and manual checks.

## Open Questions

1. **Haumea's ring.** Rings are requested on Jupiter, Saturn, Uranus and Neptune [M-3], and the
   bodies should have accurate real shapes [M-2]. Haumea really has a ring. Should Haumea get a
   ring too, or should rings appear on exactly those four planets? The draft specs only require
   the four planets and say nothing about Haumea.
2. **Mid-range phone for the 30 fps target.** Which device (or device class / browser
   throttling profile) counts as "a mid-range phone" for the acceptance check [M-4], and who
   measures it (stakeholder or team, and with which tool)?
3. **Use of the frame-rate config values.** The 30/60 fps targets are to be stored as config
   values [M-4]. Should the scene use them at runtime (for example, to lower quality adaptively
   when the frame rate falls below target), or are they reference values for measurement only?
   The draft only requires them to exist as config.
4. **Load-time measurement.** The "about 1 second on Wi-Fi" goal [M-3] is checked by the
   stakeholder. Should the pipeline also enforce a numeric budget (for example, a Lighthouse
   metric or a bundle-size limit)? None is drafted.
