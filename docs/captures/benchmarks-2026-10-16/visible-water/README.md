# Visible-water CPU investigation

Status: **stopped for owner review at the remaining numeric-CPU gate**.
The protocol below was recorded before optimization and accepted after samples.
Original capacity data remain in
[the previous study](../../benchmarks-2026-10-15/capacity/results.md).

[Matched results and all percentiles](results.md), [derived JSON](summary.json),
[before raw manifest](before-capacity/manifest.json), [after raw manifest](after-capacity/manifest.json),
[updated capacity curve](../../benchmarks-2026-10-15/charts/capacity-water-visible.svg).
Hardware: Intel i5-12450H / Mesa Intel ADL GT2 / Chromium 152.0.7977.82 headless /
ANGLE GL / Linux. Each raw round includes its environment, browser flags and source.

Keep the accepted protocol unchanged: seeded 129×129 waters at 28 m/32 m spacing,
fitted camera, all waters visible and updated, dt 1/60 s, 1920×1080/DPR 1,
uncapped MessageChannel scheduling with two GPU frames in flight, active main
thread on CPU 6, fresh Chromium/profile per execution, no extensions, two rounds
of five runs with 600 warm-up/600 measured frames. Frame-p50 round difference
must stay within 5%; capacity uses the worse round p95 and 16.7/33.3 ms budgets.
Do not relax parity (≤1e-5 per value and identical images) or budgets. Preserve
complete repeatability failures and investigate them before repeating.

Before and after collection uses the same reflection CPU instrumentation:
`waterStep`, `waterUpload` (texture preparation, surface deformation, normals and
bounds), `waterReflection` (uniforms, culling, mirror selection and reflection
render submission), and remainder (`active CPU - these disjoint sections`).
Actual transfers occur during renderer submission/GPU work, not during texture
array preparation. GPU ranges overlap CPU and can contain CPU feeding gaps;
do not add them. Medians of sections need not sum to the CPU median.

`profile-visible-water.mjs` captures CPU/heap sampling as diagnostics, not
benchmark percentiles. The initial four-water profile shows repeated generic
attribute/vector work in normal reconstruction; optimize the largest measured
preparation component before considering a language change. Physics, reflection
levels/passes, mesh density, shader inputs, camera and update counts must stay
unchanged. New numeric bottleneck qualification is reported under ADR 0004;
no WASM prototype or toolchain is authorized.

Benchmark pages never load the editor IndexedDB draft. The preserved original
core is served from a Git-ignored copy on port 1445 for parity only; accepted
measurements run source committed before samples on port 1440. No baselines
are regenerated and no push occurs.

## Measured before baseline

All 1/2/4/8-water points pass the unchanged round-p50 gate (1.34%, 1.54%,
2.52%, 2.37%). The clean measured source is `5880837`; raw rounds and full
machine/environment records are in [before-capacity/manifest.json](before-capacity/manifest.json).
At two visible waters, per-water CPU p50 is 5.023 ms: step 1.385 ms,
preparation 3.072 ms, reflection 0.352 ms and remainder 0.175 ms. These are
independent medians, not an additive CPU percentile. Remainder is derived per
frame before percentiles. [Per-water p50/p95](before-breakdown.json).
Fresh before capacity remains two waters at 60 fps / four at 30 fps.

## Optimized search stop rule (registered before after measurements)

Only normal reconstruction is changed, retaining float32 accumulation order and
Three compatibility fallbacks. Simulation, texture preparation, deformation,
bounds and reflection passes remain unchanged. Use `--stop-numeric-gate` for the
after search: stop after the first complete stable point whose numeric water
step occupies ≥15% of frame p50 and whose CPU dominance is established in the
aggregate and both rounds. This follows the owner's conditional stop instruction.
Report untested higher loads as lower bounds, rather than implying a maximum.
No WASM or further optimization is authorized past that gate.

## Result

The largest preparation component was generic indexed normal reconstruction.
Direct float32-array reads/writes keep the exact face accumulation and rounding
order; custom/nonstandard attributes and methods retain Three's path. No
simulation, deformation, texture, bounds, camera or reflection-pass change.
The clean after timing source is `da5b85b` (before: `5880837`).

At two visible waters, preparation p50 per water falls 3.072 → 1.810 ms
(41.09%), active CPU 5.023 → 4.170 ms (16.97%), frame p50 10.420 → 9.580 ms
(8.06%). **Frame p95 worsens 12.430 → 13.710 ms** (10.30%); worse-round p95
is 12.530 → 14.160 ms. One-water frame timing also worsens despite lower
active CPU. The result does not establish a general frame/tail improvement
or higher maximum capacity. CPU/GPU ranges overlap and contain scheduling effects.

The remaining numeric step is 3.175 ms / frame 9.580 ms = **33.14%**, with CPU
dominance in both rounds and the aggregate. The preregistered gate stops
collection after two waters; four/eight optimized waters are **not timed**.
Both new capacity entries are **≥2**, compared with before two/four at 60/30 fps.
This is a qualification for owner review, not evidence for adopting WASM:
2× isolated, ≥15% frame gain without p95 regression, parity and fallback for
an alternative remain unproven. No prototype, GPU skinning, toolchain or push.

## Scheduling diagnostics and selection rule

Four complete failed points are preserved in
[scheduling-diagnostic/failures.json](scheduling-diagnostic/failures.json),
with manifests, every raw run, environments and runner logs in `attempt-0` through
`attempt-3`. The frame-p50 round differences are 5.06% (one water), then 10.76%,
6.30% and 8.34% (two waters). No threshold relaxation or within-point filtering.

Retain the **first complete passing point at each load**. The one-water point
is copied unchanged from attempt 1, before the later two-water retries; its
round difference is 4.47%. Each failed two-water point is repeated as a new full
two-round cohort. The next passing cohort has 1.30% difference. Accepted raw
data are in `after-capacity`; [runner log](after-runner.log). Do not combine
individual fast runs from different cohorts or choose the fastest valid point.

The owner confirmed the machine was idle. Passive 10-second host sampling
records CPU 6/7 load, frequency, temperatures and benchmark-thread scheduling
statistics, without URLs, window captures or system changes. CPUs 6/7 are SMT
siblings. [Overlap analysis](scheduling-diagnostic/noise-analysis.json) of the
first failed two-water cohort observes CPU 7 busy 16.28–42.61% while CPU 6 is
near 4.1 GHz; sampled renderer run-delay shares reach 2.51–4.54%. This supports
scheduling/SMT contention as a contributor, not a unique cause for every spike.
The original single-run spike has no conclusive process attribution.
[Host samples](scheduling-diagnostic/host-samples.jsonl) and the passive sampler
are retained. No application was stopped and no affinity/power setting was
changed beyond the already accepted benchmark renderer pinning.

CPU/heap profiles are diagnostics including warm-up/final fingerprint work:
[before summary](profile/before-4.json), [after summary](profile/after-4.json),
and their sibling compressed raw profiles. Do not substitute their perturbed
timings for the accepted rounds. `profile-visible-water.mjs` reproduces sampling.

## Validation

- `pnpm check`: 193 tests pass, package boundaries/typecheck/build pass.
- [Fourteen water parity cases](parity/visible-water.json): 11,073,154 values,
  maximum error **0**, every image RMSE **0**. Counts 1/2/4/8 at 1/60/1,200 steps,
  plus grids 65/257 at 1,200 steps; all waters' arrays and reflection matrices.
  These correctness runs are not higher-load performance measurements.
- [Seven area/GLTF comparisons](area-parity/results.json): every RMSE **0**.
- [Compare log](validation/compare.log): the same four historical failures
  (reference, forest, snow, cathedral); marsh/mine pass. No baseline regeneration.
- Orca page `0025528d-b904-4204-9ec1-840854944689`, always explicit `--page`:
  [two-water normal check](validation/orca-normal-parity.json), 99,846 values,
  maximum error 0 and matching state hash. Benchmark URL never opens the draft.
  Page screenshot still times out; temporary zero-dt redraw was stopped.
  [Capture error](validation/orca-capture-error.json), inspected page-only
  [cdpshot](validation/cdpshot-cathedral.png). No desktop/private-window capture.
- `pnpm bench:charts`: log2 capacity axes, faint reading-guide connectors;
  two runs produce byte-identical SVGs and derived reports. Final layout and
  idempotence evidence are in `presentation-final/`.

## Reproduction

Start `pnpm dev`. For a new after cohort with the stop rule, use
`pnpm bench:capacity --axes=water-visible --stop-numeric-gate --out=.cache/new-visible-study`.
The collector writes outside Git watchers while measuring; source must be clean.
Never overwrite retained rounds. Correctness/visual tests use a preserved
original core on port 1445; only accepted live timing source uses port 1440.

`node scripts/bench-visible-water-report.mjs` recomputes the tables/JSON from
raw samples. `pnpm bench:charts` also invokes it through the explicit
[chart input index](../../benchmarks-2026-10-15/chart-inputs.json). The original
October 15 capacity manifest/tables remain historical; only the visible-water
SVG consumes this follow-up alongside its fresh before control.
