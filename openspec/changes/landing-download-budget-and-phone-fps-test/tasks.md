# Tasks

All tasks are owned by the `implementer` role (the only owner in `.office/office.yaml`).
`office.yaml` defines no working test command, so each task names its own verification.

## 1. Download-limit gate (EP-32)

- [ ] 1.1 Add a step to the `[PREVIEW]` workflow, after `yarn build`, that adds up the uncompressed sizes of every file in `out/` that the landing page loads, including the Solar System scene code it loads later, and measures the total and the JavaScript on its own, with 1 KB = 1,024 bytes [M-18, M-20]. The step fails the run when either is over its limit and reports the measured sizes next to the limits. The limits are two settings kept outside the workflow logic, starting at 1,000 KB (1,024,000 bytes) total and 500 KB (512,000 bytes) JavaScript [M-10]. Add the location of both settings to the README preview section. Satisfies preview-deployment "Landing page download limits" (all scenarios). Verify: `actionlint` passes. On a `[PREVIEW]` test run, the step's reported sizes are uncompressed byte counts from `out/` and include the deferred scene chunk. Setting the total limit, and separately the JavaScript limit, below the measured size fails the run and reports the measured size and the limit. With both at their starting values and the page within them, the step passes. The settings are changed without editing workflow logic, and the README names where they live.

## 2. Background behaviour (EP-33)

- [ ] 2.1 Make sure the background never changes its rendering quality based on measured frame rate, keeps the 30 (phone) and 60 (desktop) fps targets as config values only, and sets ring flags on Jupiter, Saturn, Uranus and Neptune only (none on Haumea or any other body) [M-8]. Satisfies landing-background "Frame-rate targets as configuration" (scenarios "Targets are configurable" and "No automatic quality reduction") and "Planetary rings" (both scenarios). Verify: `yarn build` passes. A code review shows no code path that reads frame rate or fps targets to change rendering settings, and exactly 4 bodies in the config have a ring flag. In `yarn dev`, rings show only on those four planets.

## 3. Integration acceptance (EP-34)

- [ ] 3.1 On the `[PREVIEW]` PR that carries the background work, record fps in the Chrome DevTools Performance panel during one scroll from the top of the landing page to the bottom, twice: phone with the 'Pixel 7' preset (412×915) and the CPU slowed 4x, and desktop in a 1920×1080 window with no CPU slowdown [M-10, M-18, M-20]. Post a PR comment with, for phone and desktop, the average and lowest fps, the viewport and the throttling used, plus the sizes the download-limit step reported. Satisfies landing-background "Phone scrolling measured in DevTools" and "Desktop scrolling measured in DevTools", and preview-deployment "Within both limits". Verify: the PR comment shows a phone average of at least 30 fps and a desktop average of at least 60 fps, with the lowest fps, viewport and throttling for each and the reported sizes, and the `[PREVIEW]` pipeline run, including the download-limit step, is green.
