# 0004 — WebAssembly for simulation

Status: **Proposed — reopened for visible-water simulation review**. Updated: 2026-10-16.

The October 15 decision was **Rejected for now**. That remains the conclusion
for the reference skinning, rain-water and particle targets. The owner asked
to stop and notify them if numeric CPU work still qualifies after optimizing
visible-water JS. The October 16 follow-up reaches that gate; only that target
is reopened. No WASM prototype or adoption is authorized by this status.

## Question and confirmed decision rule

Does enough numeric CPU work remain in each real frame to justify a second
implementation in WebAssembly, compared with optimized JavaScript?

The owner confirmed these thresholds before measurements. A candidate needs
CPU-bound numeric array work taking **at least 15% of median frame time**.
A GPU-dominant scene does not qualify merely because the target occupies a
large fraction of active CPU. Mixed cases need more evidence. Adoption would
require **at least 2×** isolated p50 speedup **and at least 15%** full-frame
p50 improvement against optimized JS, **no p95 regression**, numeric parity
(maximum absolute error ≤1e-5), controlled image parity and a maintained,
tested JS fallback. These thresholds were never relaxed.

The follow-up stopped at the numeric-target gate after an optimized JS baseline.
No WASM, GPU skinning or Rust/WASM toolchain was implemented or installed.

## Decision by target

### Skinning: remove repeated work in JavaScript

The original fixed 16-creature scene performed 54,537 generic vertex calls for
2,302 distinct source vertices. Cache each skinned source vertex and bone
product once; retain double intermediates, existing float32 outputs and a
cached Three fallback for nonstandard attributes/custom mesh methods.

| Implementation        | Skinning p50 / p95 ms | CPU p50 ms | GPU range p50 ms | Frame p50 / p95 ms | Bottleneck |
| --------------------- | --------------------: | ---------: | ---------------: | -----------------: | ---------- |
| Original JS           |       13.840 / 15.545 |     14.565 |            6.461 |    14.855 / 16.750 | CPU        |
| Optimized JS baseline |         0.305 / 0.485 |      1.115 |            3.650 |     7.070 / 10.225 | GPU        |

The step is **45.38× faster** and frame p50 **52.41% lower**, with improved
p95, position/normal maximum error 0 and image RMSE 0. Skinning now takes 4.31%
of the reference frame; that scene no longer qualifies. Further implementations
must beat this optimized JS baseline, not the original repeated-vertex loop.

### Water: consider visibility, map size and preparation separately

The water-plus-rain reference is GPU-dominant: frame p50 10.890 ms, CPU 4.885 ms,
GPU range 6.934 ms. Its numeric step is 1.005 ms, only 9.23% of that frame.
The original paced step was **20.9% of active CPU**; this never established a
frame gain, because the GPU was already the longer side of the pipeline.

This does not mean every water scene is GPU-bound. One sloping 129×129 water
without rain is mixed (CPU 4.605 ms versus GPU 4.445 ms). With eight loaded
waters and only one visible, updating all costs frame p50/p95
37.010/42.990 ms (pooled percentiles), CPU 36.660 ms. Pausing hidden
integration/preparation reduces that to 7.915/10.620 ms, CPU 5.130 ms, without changing the visible water's
arrays or pixels. The first correction at scale is **algorithmic scheduling**.

The no-pause numeric step passes the CPU/share rule at 2/4/8 waters, but an
avoidable hidden update is not a reason to maintain a second language path.
The four-water paused case remains a borderline candidate (15.48% step share,
CPU/GPU separation 21.45%, close to the descriptive 20% boundary); qualification
alone is not adoption. No alternative has established the required isolated
and full-frame improvement against this baseline.

The original visible-water and larger geometry-grid capacity measurements exposed
additional CPU costs: geometry/normals/bounds preparation, reflection-level
selection and multiple mirrors. They are not automatically one portable numeric kernel.
The current solver caps width at 129; measurements above that width increase
mask/mesh resolution, not solver resolution. Pausing cannot remove visible-water work.

#### October 16: direct JS normals and a remaining numeric target

The fresh instrumented before control at two visible waters spends per-water
CPU p50 1.385 ms in simulation, 3.072 ms in geometry/texture preparation,
0.352 ms in mirror/reflection setup/submission and 0.175 ms in the remainder.
Active CPU is 5.023 ms per water; medians are not additive. Sampling identifies
generic indexed normal reconstruction as the largest preparation component.

Direct float32-array reconstruction preserves Three's accumulation/rounding
order and compatibility paths, without per-vertex generic calls or allocations.
Physics, deformation, textures, bounds and reflection passes remain unchanged.
Per-water preparation falls to 1.810 ms (**41.09% lower**) and active CPU to
4.170 ms (**16.97% lower**) at the matched two-water load.

| Visible waters | Before frame p50 / p95 ms | Optimized frame p50 / p95 ms | Optimized CPU / GPU p50 ms | Bottleneck |
| -------------: | ------------------------: | ---------------------------: | -------------------------: | ---------- |
|              1 |            7.835 / 10.375 |               8.345 / 10.935 |              3.310 / 4.490 | GPU        |
|              2 |           10.420 / 12.430 |               9.580 / 13.710 |              8.340 / 4.312 | CPU        |

Two-water frame p50 improves 8.06%, but p95 worsens 10.30%; one-water frame
timing also worsens despite lower active CPU. No broad throughput/tail gain
or increased maximum capacity is established. Four failed complete points
remain as scheduling diagnostics; accepted round-p50 differences are 4.47%
and 1.30%. Variable SMT-sibling activity and renderer scheduling delays were
observed, without proving one cause for every spike. No within-point runs
were dropped or spliced. Numeric parity is exact over 11,073,154 values;
fourteen water images and seven area/GLTF images are identical.

The unchanged solver now occupies **3.175 / 9.580 ms = 33.14%** of the median
frame. CPU dominates the GPU range in the aggregate and both complete rounds.
This passes the original ≥15% numeric-CPU qualification rule after optimized
JS. Collection stops at two waters under the owner's conditional instruction;
no further optimization, higher-load timing or prototype was started. The
optimized 60/30 fps entries are both **≥2**, not exact maxima.

This reopens a candidate, not an adoption decision: no alternative has shown
2× isolated acceleration, ≥15% frame improvement without p95 regression,
numeric/image parity and a maintained JS fallback. Owner review is the next
step. The worse tail in these JS measurements must remain visible in any
future comparison. [Report and raw links](../captures/benchmarks-2026-10-16/visible-water/results.md).

### Particles and effects: GPU-dominant reference

The reference has frame p50 16.805 ms, CPU 0.860 ms and GPU 13.326 ms; the JS
effect update is 0.515 ms (3.06% of frame). More CPU speed does not establish
faster rendering. Inspect overdraw, effect density and GPU costs before changing
language. Capacity keeps the existing live-letter/draw-buffer budgets and
records actual point counts; capped output cannot prove unlimited capacity.

## Capacity and triggers to re-evaluate

| Axis                                             | Maximum measured at 60 fps · p95 ≤16.7 ms | Maximum measured at 30 fps · p95 ≤33.3 ms |
| ------------------------------------------------ | ----------------------------------------: | ----------------------------------------: |
| Visible skinned creatures                        |                           128 · 15.000 ms |                           256 · 23.025 ms |
| Loaded waters, pause off                         |                             2 · 13.440 ms |                             4 · 24.375 ms |
| Loaded waters, pause on (one visible)            |                         2,048 · 15.865 ms |                        ≥4,096 · 21.510 ms |
| Simultaneously visible waters, optimized normals |                            ≥2 · 14.160 ms |                            ≥2 · 14.160 ms |
| Effect groups (three effects each)               |         4 groups = 12 effects · 15.795 ms |        24 groups = 72 effects · 32.720 ms |
| Water mesh/mask width                            |                       129×129 · 10.840 ms |                       257×257 · 18.110 ms |

Visible-water entries use the October 16 follow-up's worse-round p95 and stop
at owner review, not an FPS ceiling. Its fresh before control sustains two/four
waters at 60/30 fps (12.530/27.260 ms worst-round p95). All other rows retain
October 15 data; loaded-water and larger mesh-grid axes were not remeasured
after the normals change and are historical bounds for that implementation.

The paused-water 30 fps entry is a **lower bound**, not an observed FPS ceiling.
The next 8,192-water load was not allocated: projected renderer peak RSS was
13.173 GiB versus 11.595 GiB currently available, before the required 4 GiB
system reserve. Peak VmHWM includes state-fingerprint allocations outside timed
frames. Physics width remains capped at 129 even for larger mesh/mask grids.

These are the largest **measured** passing points under a worse-round frame
p95 budget, not interpolated exact limits. Consult the next failing load and
raw point tables. A ≥ mark is a tested-range/resource lower bound.

Historical October 15 triggers on this profile: 256 visible creatures miss 60 fps
(p95 23.025 ms), and 512 miss 30 fps (35.340 ms); before the normals change,
four visible waters miss 60 fps (23.515 ms), and eight miss 30 fps (48.695 ms); mesh width 257 misses
60 fps (18.110 ms), and 513 misses 30 fps (57.610 ms). These larger CPU-heavy
workloads can qualify for fresh profiling even though the optimized reference
skinning scene no longer does. They do not establish a WASM speedup.

Re-profile when the intended workload goes beyond the table: more simultaneous
visible waters/reflections, higher water geometry grids, greater creature/model
complexity, or substantially more overdraw from particles. Actual simulation
above 129 would be a new unmeasured workload. Also re-profile on weaker hardware,
mobile, another GPU/browser, and **Linux/Tauri WebKitGTK**, which were not tested.
A missed budget triggers profiling, not automatic adoption of WASM. A new
candidate must show a numeric CPU bottleneck and pass the original rule against
the optimized JS baseline, including the whole frame and p95.

## Owner-authorized water policy

The live editor and exported player now pause offscreen waters by default with
a 4 m margin. A whole transformed bounding sphere must miss the expanded
frustum. Engine-driven integration, geometry/texture preparation and actor
contacts pause. Returning water advances only the current dt; there is no
catch-up. Global shader/ring clocks and explicit rain/disturb/refresh calls
continue. Identical initial state, seed, fixed steps, external inputs and camera
path (including projection/viewport) repeat deterministically; another camera
history can yield another water state. This is an intentional behavior change, not full-simulation parity.

The Display control, URL override and engine runtime API keep the policy
configurable. Ordinary offline/parity URLs force full simulation, even if the
live policy was requested. Benchmarks default to full simulation, with explicit
pause variants for this study. The generic core default remains update-all.
The policy is not a SceneDoc format field. Stationary-view image parity and
camera-path behavior are validated separately.

## Cost avoided and evidence

Keeping JS without a separate WASM implementation avoids a Rust/WASM toolchain, an additional distributed
binary/interface, marshalling and memory ownership, two maintained execution
paths, cross-platform fallback selection, duplicate tests, and ongoing numeric
and visual parity work. Those costs should be paid only after demonstrated
frame benefit under the actual bottleneck. No push or deployment accompanies
this decision.

Numbers apply to **Intel i5-12450H, Mesa Intel ADL GT2, Chromium 152.0.7977.82
headless, ANGLE GL**,
1920×1080/DPR 1. They do not establish mobile, WebKitGTK or native Tauri behavior.
Full-frame intervals are uncapped tasks with two outstanding GPU frames and
asynchronous fences. CPU/GPU ranges overlap; water GPU ranges can contain
submission gaps. The accepted capacity protocol uses P-core CPU 6, fresh
Chromium processes/profiles and disabled extensions; the historical skinning
comparison uses the same original OS-default affinity on both sides. All points
need two rounds × five executions × 600 warm-up/600 measured frames, with frame
p50 repeatability ≤5%. Earlier failed diagnostics remain in their reports.

- [Performance page and capacity plots](../performance.md).
- [Visible-water follow-up protocol](../captures/benchmarks-2026-10-16/visible-water/README.md),
  [matched results](../captures/benchmarks-2026-10-16/visible-water/results.md),
  [before manifest](../captures/benchmarks-2026-10-16/visible-water/before-capacity/manifest.json),
  [after manifest](../captures/benchmarks-2026-10-16/visible-water/after-capacity/manifest.json)
  and [failed complete points](../captures/benchmarks-2026-10-16/visible-water/scheduling-diagnostic/failures.json).
- [Phase 1 report and raw-data links](../captures/benchmarks-2026-10-15/README.md).
- [Phase 2 before/after report, parity and raw-data links](../captures/benchmarks-2026-10-15/phase-2/README.md).
- [Capacity protocol](../captures/benchmarks-2026-10-15/capacity/README.md),
  [point tables](../captures/benchmarks-2026-10-15/capacity/results.md),
  [raw manifest](../captures/benchmarks-2026-10-15/capacity/manifest.json) and
  [derived summary](../captures/benchmarks-2026-10-15/capacity/summary.json).
- [Static SVGs and checksums](../captures/benchmarks-2026-10-15/charts/index.json),
  regenerated from raw JSON by `pnpm bench:charts` without external dependencies.
- [Original confirmed study plan](../wasm-performance-study-plan.md), preserved
  byte for byte; [development/validation log](../log.md).
