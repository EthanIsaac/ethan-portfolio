# Proposal: Landing page download limits + phone fps test

## Why

The merged change `solar-system-background-preview-pipeline` left four open questions:
Haumea's ring, how the mid-range phone 30 fps target is measured, whether the fps config
values drive runtime behaviour, and whether the pipeline enforces a numeric load budget
(`openspec/changes/solar-system-background-preview-pipeline/proposal.md`, "Open Questions").
The stakeholder answered them [M-8, M-10] and asked for the answers to be captured as a
separate follow-up change [M-10].

## What Changes

- **Separate follow-up change.** This is a new change. The merged change
  `solar-system-background-preview-pipeline` stays as it is [M-10].
- **Landing page download limits.** The landing page downloads at most 1,000 KB in total,
  and at most 500 KB of that is JavaScript. Both limits are settings that can be changed
  without changing code [M-10].
- **[PREVIEW] pipeline gate.** The `[PREVIEW]` pipeline fails if the landing page goes over
  either download limit, and passes when it is within both [M-10].
- **Phone fps measurement method.** The team measures the 30 fps phone target in Chrome
  DevTools, with a phone-sized screen and the CPU slowed down 4x, while scrolling. The team
  posts the result on the PR [M-10]. This replaces the open "mid-range phone" definition.
- **Fps figures are measurement targets only.** The 30 fps phone and 60 fps desktop figures
  are targets to measure against. The scene does not lower its quality automatically while
  running [M-8].
- **Rings on four planets only.** Rings stay on Jupiter, Saturn, Uranus and Neptune, and no
  other body has one (Haumea included) [M-8].

### Out of scope

- Changing anything else in the merged change `solar-system-background-preview-pipeline` [M-10].
- Automatically lowering scene quality based on frame rate [M-8].
- A ring on Haumea or on any body other than Jupiter, Saturn, Uranus and Neptune [M-8].

## Capabilities

### New Capabilities
_None._

### Modified Capabilities
- `preview-deployment` (introduced by `solar-system-background-preview-pipeline`): adds the
  landing page download-limit gate.
- `landing-background` (introduced by `solar-system-background-preview-pipeline`): changes
  "Frame-rate targets as configuration" (measurement method, no automatic quality changes)
  and "Planetary rings" (no ring on any other body).

The merged change has not been archived yet, so `openspec/specs/` is still empty. This
change's MODIFIED deltas assume that `solar-system-background-preview-pipeline` is archived
first.

## Impact

- CI: the `[PREVIEW]` workflow in `.github/workflows/` gets a download-limit step and two
  settings. CI paths are human-merge (`.office/README.md`, `.office/office.yaml`).
- Background code (`src/components/background/`): no fps-driven runtime quality changes, and
  ring flags on the four planets only.
- PR process: the `[PREVIEW]` PR carries the Chrome DevTools phone fps result.
- Docs: the README preview section says where the two limits are set.

## Open Questions

1. **What counts as the "download".** Should the limits apply to the compressed bytes
   transferred over the network, or to the uncompressed file sizes? Should files that load
   after the page has loaded count (for example, a deferred scene bundle)? [M-10] does not say.
2. **KB definition.** Is 1 KB 1,000 bytes or 1,024 bytes?
3. **What the gate measures.** Should the gate measure the deployed `dev.ethantrevizo.com`
   page (for example, as part of the existing Lighthouse run) or the build output in `out/`?
   The two can give different numbers.
4. **"Phone-sized screen".** Which viewport or DevTools device preset should the phone fps
   test use? [M-10] says only "phone-sized". Is "at least 30 fps" judged on the average
   frame rate, or must every point of the scroll stay at or above 30 fps?
5. **Desktop 60 fps measurement.** [M-10] sets the phone method only. Should the 60 fps
   desktop target be measured a specific way and posted on the PR too, or stay as the merged
   change describes it?
