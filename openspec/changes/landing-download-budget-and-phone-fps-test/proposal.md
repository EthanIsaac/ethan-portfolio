# Proposal: Landing page download limits + phone and desktop fps test

## Why

The merged change `solar-system-background-preview-pipeline` left four open questions:
Haumea's ring, how the mid-range phone 30 fps target is measured, whether the fps config
values drive runtime behaviour, and whether the pipeline enforces a numeric load budget
(`openspec/changes/solar-system-background-preview-pipeline/proposal.md`, "Open Questions").
The stakeholder answered them [M-8, M-10] and asked for the answers to be captured as a
separate follow-up change [M-10]. The measurement details were settled in [M-18, M-20].

## What Changes

- **Separate follow-up change.** This is a new change. The merged change
  `solar-system-background-preview-pipeline` stays as it is [M-10].
- **Landing page download limits.** The landing page downloads at most 1,000 KB in total,
  and at most 500 KB of that is JavaScript [M-10]. Sizes are uncompressed, and
  1 KB = 1,024 bytes, so the starting limits are 1,024,000 bytes in total and 512,000 bytes of
  JavaScript. Every file the landing page loads counts, including the Solar System scene code
  it loads later [M-18, M-20]. Both limits are settings that can be changed without changing
  code [M-10].
- **[PREVIEW] pipeline gate.** For now, the `[PREVIEW]` pipeline measures the build output in
  `out/` after `yarn build` [M-18]. It fails if the landing page goes over either limit,
  reporting the measured size and the limit, and passes when the page is within both [M-10].
- **Phone fps test.** The team records fps in the Chrome DevTools Performance panel during one
  scroll from the top of the landing page to the bottom, with the 'Pixel 7' preset (412×915)
  and the CPU slowed 4x. It passes when the average is at least 30 fps; the lowest value is
  reported too. The result is posted on the PR [M-10; method chosen by the PM as delegated in
  M-18]. This replaces the open "mid-range phone" definition.
- **Desktop fps test.** Measured the same way, but in a 1920×1080 window with no CPU slowdown.
  It passes when the average is at least 60 fps, and the result is posted on the PR
  [M-18, M-20].
- **Fps figures are measurement targets only.** The 30 fps phone and 60 fps desktop figures
  are targets to measure against. The scene does not lower its quality automatically while
  running [M-8].
- **Rings on four planets only.** Rings stay on Jupiter, Saturn, Uranus and Neptune, and no
  other body has one (Haumea included) [M-8].

### Out of scope

- Changing anything else in the merged change `solar-system-background-preview-pipeline` [M-10].
- Automatically lowering scene quality based on frame rate [M-8].
- A ring on Haumea or on any body other than Jupiter, Saturn, Uranus and Neptune [M-8].
- Measuring the deployed `dev.ethantrevizo.com` page for the download limits (for now) [M-18].

## Capabilities

### New Capabilities
_None._

### Modified Capabilities
- `preview-deployment` (introduced by `solar-system-background-preview-pipeline`): adds the
  landing page download-limit gate.
- `landing-background` (introduced by `solar-system-background-preview-pipeline`): changes
  "Frame-rate targets as configuration" (phone and desktop measurement method, no automatic
  quality changes) and "Planetary rings" (no ring on any other body).

The merged change has not been archived yet, so `openspec/specs/` is still empty. This
change's MODIFIED deltas assume that `solar-system-background-preview-pipeline` is archived
first.

## Impact

- CI: the `[PREVIEW]` workflow in `.github/workflows/` gets a step after `yarn build` that adds
  up the landing page's files in `out/` (including the deferred scene code), with two limit
  settings kept outside the workflow logic. CI paths are human-merge (`.office/README.md`,
  `.office/office.yaml`).
- Background code (`src/components/background/`): no fps-driven runtime quality changes, and
  ring flags on the four planets only.
- PR process: the `[PREVIEW]` PR that carries the background work gets a comment with the
  phone and desktop fps results (average, lowest, viewport, throttling) and the sizes the
  download-limit step reported.
- Docs: the README preview section says where the two limits are set.
- Data and API changes: none.

## Risks

- Uncompressed sizes in `out/` can differ from what visitors actually download (which is
  compressed). Accepted for now [M-18].
- The scene code counts towards the limits, so a heavy scene can fail the gate even when the
  page itself is small.
- An average fps can hide short stutters, so the lowest value is reported alongside it.

## Open Questions

None. All answered in M-18 and M-20.
