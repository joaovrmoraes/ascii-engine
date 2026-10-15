# ADR 0004 — WebAssembly for simulation

Status: **Proposed**

Date: 2026-10-15. The owner confirmed the numerical decision rule before the
original measurements, then requested the uncapped bottleneck amendment below
after reviewing Phase 1. This draft authorizes Phase 1 measurement only.

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

## Scope and stopping point

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
confirm or correct this bottleneck inference. No Phase 2 work is authorized.

## Uncapped Phase 1 measurements (current)

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
