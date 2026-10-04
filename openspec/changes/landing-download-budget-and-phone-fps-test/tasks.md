# Tasks

All tasks are owned by the `implementer` role (the only owner in `.office/office.yaml`).
`office.yaml` defines no working test command, so each task names its own verification.
The download measurement basis (proposal open questions 1–3) must be answered before 1.1 starts.

## 1. Download-limit gate

- [ ] 1.1 Add a step to the `[PREVIEW]` workflow that measures the landing page download (total and JavaScript) and fails the run when either is over its limit, reporting the measured sizes and limits. The limits are two settings outside workflow logic, starting at 1,000 KB total and 500 KB JavaScript [M-10]. Add the location of both settings to the README preview section. Satisfies preview-deployment "Landing page download limits" (all scenarios). Verify: `actionlint` passes. On a `[PREVIEW]` test run, setting the total limit, and separately the JavaScript limit, below the measured size fails the run. With both at their starting values and the page within them, the step passes. The settings are changed without editing workflow logic, and the README names where they live.

## 2. Background behaviour

- [ ] 2.1 Make sure the background never changes its rendering quality based on measured frame rate, keeps the 30/60 fps targets as config values only, and sets ring flags on Jupiter, Saturn, Uranus and Neptune only (none on Haumea or any other body) [M-8]. Satisfies landing-background "Frame-rate targets as configuration" (scenarios "Targets are configurable" and "No automatic quality reduction") and "Planetary rings" (both scenarios). Verify: `yarn build` passes. A code review shows no code path that reads frame rate or fps targets to change quality settings, and exactly 4 bodies in the config have a ring flag. In `yarn dev`, rings show only on those four planets.

## 3. Integration acceptance

- [ ] 3.1 On the `[PREVIEW]` PR that carries the background work, measure scrolling in Chrome DevTools with a phone-sized screen and the CPU slowed down 4x, and post the result (fps while scrolling, viewport used and throttling setting) as a PR comment, along with the download-limit step's reported sizes [M-10]. Satisfies landing-background "Phone scrolling measured in DevTools" and preview-deployment "Within both limits". Verify: the PR comment shows at least 30 fps while scrolling under those settings, and the pipeline run, including the download-limit step, is green.
