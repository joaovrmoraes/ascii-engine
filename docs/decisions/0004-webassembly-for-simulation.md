# ADR 0004 — WebAssembly for simulation

Status: **Proposed**

Date: 2026-10-15. The owner confirmed the numerical decision rule before the
original measurements, then requested the uncapped bottleneck amendment below
after reviewing Phase 1. The owner subsequently authorized Phase 2 JS skinning
and optional offscreen water scheduling. Status remains Proposed; no WASM/GPU
implementation, toolchain installation or default water behavior change is authorized.

## Decision rule

A target qualifies for a prototype only if, in its fixed reference scene:

1. Its CPU time is at least **15% of the median frame time**.
2. It is CPU-bound numeric work over arrays, rather than waiting on GPU/DOM
   operations or updating Three.js objects.

Adoption requires all of the following against an optimized JavaScript baseline:

1. The isolated target step is at least **2× faster at p50**.
2. The full reference frame time improves by at least **15% at p50**, with
   **no regression at p95**.
3. Numeric parity holds from identical initial state and fixed steps, comparing
   every output array: maximum absolute difference **≤ 1e-5 per float32 value**.
   Visual parity is also required.
4. A JavaScript fallback remains, with the same API and the same tests.

GPU skinning may be the appropriate comparison for skinned glyphs. Qualifying
does not require choosing WASM when GPU execution is more suitable.

## Phase 2 — Optimized JS baseline and water at scale

Owner-authorized scope: optimize JS skinning and test optional water scheduling.
Both use the accepted uncapped protocol: seeded fixtures, fixed dt 1/60 s,
1920×1080/DPR 1, two rounds × five fresh loads × 600 warm-up/600 measured frames.
Two GPU frames overlap through asynchronous fences; all samples complete.
Skinning uses OS-default affinity; final water pairs use the same verified
P-core CPU 6 affinity with extensions disabled. Water measurements block by map
size, reversing off/pause order in round 2. Machine power, GPU flags, dt, counts
and gates stay fixed. These numbers apply to the **i5-12450H, Chromium
headless, ANGLE GL** profile.
They are not extrapolated to other hardware or browsers. The owner confirmed
no heavy external GPU use; normal background desktop activity is not isolated.

### Skinning: stop after the JS optimization

The original 18,179 letters call getVertexPosition 54,537 times per frame for
2,302 distinct source vertices. CPU/allocation profiles identify repeated bone
products and Three's Vector3 generator/spread in applyBoneTransform. Skin each
source vertex once, compute bone matrices once, keep double intermediates and
write existing float32 attributes directly. Nonstandard attributes/custom
methods retain a cached Three fallback. No per-frame allocation in the standard
kernel. Positions, normals and image pixels remain exact in fixed-step tests.

| Implementation        | Skinning p50/p95 ms | Active CPU p50 ms | GPU range p50 ms | Frame p50/p95 ms | Bottleneck |
| --------------------- | ------------------: | ----------------: | ---------------: | ---------------: | ---------- |
| Original JS           |       13.840/15.545 |            14.565 |            6.461 |    14.855/16.750 | CPU        |
| Optimized JS baseline |         0.305/0.485 |             1.115 |            3.650 |     7.070/10.225 | GPU        |

JS isolated gain 45.38×, full-frame p50 gain 52.41%, with improved p95.
Skinning is now 4.31% of a GPU-dominant frame. It no longer meets the
qualifying CPU/share rule.
Stop this front; no GPU skinning/WASM alternative is justified by this fixture.
A later alternative must be compared against this optimized JS baseline.

### Water: map size changes the decision; scheduling comes first

A seeded 1,024 m map loads 1/2/4/8 independent 28 m waters, each 129×129 cells,
64 m apart. One is visible; the others are offscreen. Both modes use source
4f5120c and identical initial state; their renderer main threads
are pinned to P-core CPU 6 to control observed P/E migration. Each execution
uses a new Chromium process/profile to avoid observed cross-variant history
sensitivity; the pre-warm-up CPU probe does not advance simulation. The original
5×2 unpinned data fail two frame gates (6.16%, 5.79%) and remain as diagnostics.
Fresh-process full-matrix data still fail five light-case gates and are retained.
The fresh benchmark browser was loading system extensions; the final protocol
disables them, checks absent extension targets and blocks by map-size pair with
reversed policy order in round 2. No old/new runs are spliced. Off preserves unconditional integration
and preparation for every water; pause updates only the visible one. All
variants retain five draw calls and exact visible arrays/images.

| Loaded waters | Frame p50/p95 ms off → pause | Active CPU p50 ms off → pause | GPU range p50 ms off → pause | Bottleneck off → pause |
| ------------: | ---------------------------: | ----------------------------: | ---------------------------: | ---------------------- |
|             1 |  7.970/10.725 → 7.980/10.645 |                 4.605 → 4.650 |                4.445 → 4.444 | mixed → mixed          |
|             2 | 10.340/13.190 → 8.055/10.540 |                 9.945 → 5.245 |                4.820 → 4.438 | CPU → mixed            |
|             4 | 19.645/23.750 → 8.170/11.395 |                19.295 → 5.390 |                8.124 → 4.438 | CPU → CPU              |
|             8 | 37.010/42.990 → 7.915/10.620 |                36.660 → 5.130 |                9.580 → 4.434 | CPU → mixed            |

The [Phase 2 report](../captures/benchmarks-2026-10-15/phase-2/README.md)
contains separate water step/preparation p50/p95, frame shares, per-case
qualification, repeatability, state hashes, raw JSON and environment.
CPU preparation includes texture arrays, deformation, normals and bounds;
it is not pure GPU upload. Three already culls offscreen draw work. The GPU
elapsed range starts at the first reflection and can include feeding gaps
while CPU updates later waters; it must not be treated as exclusive GPU busy
time or added to CPU time. The large unoptimized maps are CPU-dominant.

With update-all, the numeric step passes the CPU/share gate at 2/4/8 waters
(27.66%/28.94%/29.83% of frame); one water is mixed and below 15%.
After pausing, four waters still narrowly pass: step 1.265 ms, 15.48% of the
8.170 ms frame, CPU 5.390 ms versus GPU range 4.438 ms (21.45% separation,
close to the descriptive 20% boundary). Both rounds have that classification,
but this is a borderline candidate, not adoption evidence. Paused two/eight
waters are mixed despite step shares above 15%; their CPU bottleneck is not
established. No alternative implementation is selected for these cases.

Therefore the original single-water GPU result does not generalize to a large
map. Numeric water steps can meet the CPU/share gate at scale, but avoidable
updates should first be reduced algorithmically. The optional policy removes
hidden integration/preparation; any remaining case near 15% or the CPU/GPU
boundary needs its actual run distributions. Qualification is not adoption:
no alternate target step or measured 15% macro improvement versus optimized JS
has been established for WASM. No WASM/toolchain/Phase 3 work is authorized.

### Optional scheduling and deterministic documents

Runtime offscreenWater={mode:'pause',margin:4} is **absent by default**.
A complete transformed bounding sphere must miss the frustum plus four world
metres before engine-driven physics, preparation/dirtying and actor contacts
skip. On return only the current dt advances; there is no catch-up. Global
shader/ring clocks continue, and explicit rain/disturb/refresh calls are not
intercepted. Depth/flows/foam and their queries therefore depend on camera
history and external calls; wind phase may jump. Visible water kept active
has exact parity. The pause/return test compares 166,410 values with max
difference 0 against one fresh step. Default enablement remains the owner's
decision; editor/player and SceneDoc behavior stay unchanged for v0.2.

Validation: pnpm check passes (177 tests). Every compared position/normal and
water array has max difference 0 (required ≤1e-5); benchmark and controlled
area/GLTF images have RMSE 0. pnpm compare retains the four known historical
failures, without new ones or baseline changes. Frame p50 repeats within 5%
for all ten before/after cases. Orca page runs complete with explicit page id.
Earlier page screenshots time out; the final JPEG attempt reports a missing
page although evaluation on the same page succeeds immediately afterward.
The Orca capture remains unverified; page-only cdpshot/CDP evidence is retained.
Status stays **Proposed**, stopped after Phase 2. No push.

## Original paced Phase 1 method (superseded for qualification)

- Three URL-addressable, seeded fixtures: water, particles and skinning. No
  editor IndexedDB access; each run starts from a fresh page/scene.
- 1920×1080 CSS pixels, device pixel ratio 1, fixed camera and 1/60 s steps.
- At least 600 measured frames after warm-up, five independent runs per scene,
  repeated in two complete rounds. Record raw data and p50/p95/p99.
- Primary full-frame time is the `performance.now()` interval between actual
  animation-frame callbacks, including pacing and dispatch jitter. Record native
  rAF timestamps separately: their scheduled cadence can hide dispatch jitter.
  Also record active CPU frame work separately; do not
  mistake CPU submission time for GPU completion or uncapped throughput.
- Qualification share is subsystem p50 CPU time divided by p50 full-frame
  interval. Report the active CPU-frame share as additional context.
- Separate water simulation step from texture preparation/upload submission,
  then skinned glyph updates, effects, carpet, body uniforms and remaining
  render submission. Upload timing is CPU time, not a claim of GPU transfer time.
- Optional GPU timer queries are asynchronous. Record unsupported, disjoint or
  missing results explicitly, without forcing GPU synchronization.
- Record CPU, GPU, OS, Chromium, launch flags, power mode, source revision,
  fixture parameters and timer resolution. Preserve default renderer behavior.
- Two rounds must have full-frame p50 values within 5%; investigate unstable
  results and report subsystem variation and timer precision as well.
  Relative round difference uses the absolute p50 difference divided by their
  arithmetic mean. Percentiles use nearest rank over equally sized runs.

Candidate classification is fixed before the main runs: water step and skinned
vertex math can qualify as numeric CPU work. The combined water upload also
updates Three.js geometry and submits buffer changes; its aggregate alone does
not prove a transferable numeric kernel. Effects manipulate JS object state;
carpet/body uniforms and render submission do not meet the numeric-array rule.

## Original Phase 1 scope and stopping point

No implementation has been selected. Phase 1 does not optimize the JavaScript,
write WASM/GPU alternatives, install a toolchain or claim the adoption thresholds
have been met. Record the measurements and candidate qualifications, then stop
for owner review before Phase 2. The confirmed original study plan is preserved
byte for byte in `docs/wasm-performance-study-plan.md`.

## Methodology amendment — uncapped measurement

The owner requested this amendment after reviewing the paced results, before
Phase 2. Display-paced frame medians near 16.665 ms and their stability measure
presentation cadence, not uncapped workload cost. Preserve the original paced
report/raw data for context; do not use their frame shares as decision evidence.

Before collecting the additional rounds:

- Add Chromium `--disable-gpu-vsync` and `--disable-frame-rate-limit`. Keep the
  existing scenes, seeds, viewport, 1/60 simulation step, warm-up and run counts.
  Measure actual callback wall intervals without synchronous GPU waits.
  Unbounded callbacks can outrun GPU completion: a partial diagnostic round is
  retained under submission-diagnostic/. Therefore bound in-flight GPU frames
  to two with asynchronous WebGL fences and nonblocking polls. CPU frame N can
  overlap GPU frame N-1; do not call gl.finish or serialize every CPU/GPU frame.
  Record actual step intervals, CPU-observed completion intervals, latency and
  fence/scheduler overhead separately. All measured GPU frames must complete.
  A subsequent complete rAF-bounded experiment failed water submission p50
  repeatability (6.40%) while completion p50 varied 1.08%, CPU 1.05% and GPU
  0.38%. Preserve it in raf-bounded-diagnostic/. The final uncapped scheduler
  uses free-running MessageChannel tasks, not rAF, so the benchmark loop is
  independent of compositor callback cadence. Keep rAF for the ordinary editor
  and paced benchmark. Record rafIntervalMs as null in task mode; do not invent
  rAF timestamps. Collect two fresh rounds with unchanged counts/thresholds.
  Also report mean step/completion intervals as throughput context, without
  substituting means for the specified percentiles or hiding the failed gate.
- Collect two uncapped rounds, each five fresh loads and 600 measured frames
  per scene after 600 warm-up frames. Check uncapped full-frame p50 repeatability
  within 5%; preserve and investigate unstable rounds.
- Compare active CPU p50 with asynchronous GPU-range p50. A separation of at
  least 20% describes CPU or GPU dominance; closer values are mixed, and missing
  GPU timing is unknown. This descriptive band is not an adoption threshold.
  CPU submission may include driver backpressure, and GPU ranges exclude the
  browser compositor. Do not add the overlapping CPU and GPU durations.
- Qualification considers the scene bottleneck as well as numeric work and
  the 15% target share of the uncapped frame. A large active-CPU fraction alone
  cannot qualify a CPU target in a GPU-limited scene. Mixed/unknown bottlenecks
  need more evidence before qualification.
- Adoption still requires a measured 2× isolated gain and at least 15% uncapped
  full-frame p50 improvement, no p95 regression, parity and the JS fallback.
  CPU time saved in a GPU-limited scene does not count as a frame gain.

The original water step is 1.000 / 4.790 = **20.9% of active CPU**, although only
6.00% of the display-paced frame. Original GPU p50 is 8.959 ms versus 4.790 ms
CPU. Moving the step to WASM would shorten the smaller side of an overlapping
pipeline and does not establish a frame improvement. The uncapped data must
confirm or correct this bottleneck inference. This was the stopping point before the subsequent Phase 2 authorization.

## Uncapped Phase 1 measurements (original JS)

Runtime source: `af0413f`, with clean tracked trees at the start of both rounds.
Each scene has ten fresh loads in total, 600 warm-up and 600 measured frames
per load. The 18,000 measured frames all have completed GPU fences and timer
samples, no disjoint/dropped queries or visibility changes, and the same final
state/configuration as the original paced fixtures. No simulation code changed.

| Scene     | Uncapped frame p50 / p95 ms | Active CPU p50 / p95 ms | GPU range p50 / p95 ms | Dominant measured work |
| --------- | --------------------------: | ----------------------: | ---------------------: | ---------------------- |
| Water     |             10.890 / 13.450 |           4.885 / 7.690 |          6.934 / 9.920 | GPU                    |
| Particles |             16.805 / 18.330 |           0.860 / 1.330 |        13.326 / 14.337 | GPU                    |
| Skinning  |             14.820 / 16.675 |         14.510 / 16.295 |          4.589 / 8.451 | CPU                    |

Observed completion interval p50 is respectively 10.890, 16.805 and 14.820 ms,
matching render-step p50. Sustained mean step/completion intervals also agree
within 0.01 ms. Full-frame p50 repeatability is 2.71%, 1.52% and 2.69%, all
within 5%. This is unpaced throughput under a two-frame GPU queue, including
browser scheduling; it does not measure physical display scanout. GPU ranges
exclude the browser compositor. Dominance compares measured CPU/GPU work and
does not assign every remaining millisecond exclusively to that processor.

| Target in its reference scene      | CPU p50 / p95 ms | Uncapped frame share | Bottleneck-aware qualification                                                |
| ---------------------------------- | ---------------: | -------------------: | ----------------------------------------------------------------------------- |
| Water step                         |    1.005 / 1.525 |                9.23% | GPU-dominant scene; no demonstrated frame benefit from CPU acceleration       |
| Water texture/geometry preparation |    2.985 / 5.025 |               27.41% | GPU-dominant scene and mixed Three.js updates; no portable kernel established |
| Effects                            |    0.515 / 0.870 |                3.06% | GPU-dominant scene; JS object work                                            |
| Skinned vertex math                |  13.715 / 15.350 |               92.54% | CPU-dominant numeric work; qualifies for later baseline/comparison            |

The original water step's **20.9% of active CPU** is not a frame-gain estimate.
The uncapped data confirm GPU dominance: 6.934 ms GPU versus 4.885 ms CPU.
The current step is 20.57% of CPU, but only 9.23% of the uncapped frame. A faster
CPU step does not establish faster GPU throughput or the required 15% macro
gain. WASM is not justified for this reference scene by either CPU percentage.

Skinning remains the only qualifying target. GPU skinning is a suitable later
comparison, but no alternative is selected or implemented. Candidate CPU step
medians repeat within 3.96%; mixed water preparation varies 5.02%, effects
12.44% and remaining submission up to 13.11%. Do not infer stable optimization
gains from those latter sections. See the [full report](../captures/benchmarks-2026-10-15/README.md)
and [uncapped validation](../captures/benchmarks-2026-10-15/uncapped-notes.md).

`pnpm check` and clean-source profiling/state/image verification pass. The
benchmark's saved images are byte-identical to the original paced captures.
Orca completed 120 water steps and captured the page using the explicit editor
page id. Historical `pnpm compare` baselines still fail in the same four areas;
renderer/scene code outside the benchmark is unchanged, and baselines remain
untouched. Status stays **Proposed**, stopped before Phase 2. No optimized JS,
WASM/GPU alternative, adoption gain or fallback comparison was performed.

## Original display-paced Phase 1 measurements (context only)

Measured source: `d105af5`, two rounds of five fresh loads per scene, each with
600 warm-up and 600 measured frames. The [report](../captures/benchmarks-2026-10-15/README.md)
will contain the revised uncapped results. The original [paced report](../captures/benchmarks-2026-10-15/vsync-report.md)
retains subsystem p50/p95, paced frame shares, p99, raw data and environment. See
[provenance and validation](../captures/benchmarks-2026-10-15/study-notes.md) for
the retained preliminary clock diagnostic and visual comparison limitations.

| Reference scene / target                          | CPU p50 / p95 ms | Median frame share | Phase 1 qualification                                  |
| ------------------------------------------------- | ---------------: | -----------------: | ------------------------------------------------------ |
| Water / shallow-water step                        |    1.000 / 1.485 |              6.00% | Below 15%                                              |
| Water / combined texture and geometry preparation |    2.995 / 4.495 |             17.97% | Mixed Three.js updates; numeric kernel not established |
| Particles / effects                               |    0.510 / 0.825 |              3.06% | Below 15%; JS object state                             |
| Skinning / skinned vertex math                    |  14.015 / 16.935 |             84.12% | Qualifies; consider GPU skinning comparison            |

Full-frame p50 differences between rounds are 0.00%, 0.03% and 0.00%; candidate
section p50 differences are at most 2.50%. Remaining submission varies by
5.65–11.43%, so no stable kernel or speedup is inferred from that residual.
All 18,000 measured frames have valid GPU samples and no visibility changes;
each scene's final state hash agrees across its ten runs.

`pnpm check` passes. Historical `pnpm compare` baselines fail in the same four
areas before and after this work; they were not changed. A controlled comparison
with identical clocks gives RMSE 0 in all six existing areas. Benchmark profiling
on/off has exact state and screenshot parity. The owner confirmed the lake is
visible in Orca; automated Orca reads/captures still time out.

The scenes' full-frame p50 is paced near 60 Hz. Qualification does not demonstrate
the required 15% full-frame improvement. No optimized JS, GPU/WASM alternative,
adoption gain, cross-implementation parity or fallback comparison was performed.
Status remains **Proposed**, stopped for owner review before Phase 2.
