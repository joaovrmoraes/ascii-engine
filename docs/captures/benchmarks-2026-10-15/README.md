# Simulation performance study — Phase 1

> Historical report. The final [performance page](../../performance.md) and
> [ADR 0004](../../decisions/0004-webassembly-for-simulation.md) initially closed the study
> as **Rejected for now**; the October 16 visible-water follow-up qualified its
> numeric target before the owner **deferred** its JS step baseline and WASM
> prototype by project priority. Live editor/player water pausing is now enabled by
> the owner; the measurements and original stopping-point text below are preserved.

> Phase 2 follow-up: [optimized JS skinning and optional water scheduling](phase-2/README.md). This report preserves the original Phase 1 measurements.

Status: measurement only. ADR 0004 remains Proposed; no optimized JS, WASM or GPU implementation was attempted.

Methodology amendment: the original display-paced measurements were limited by presentation cadence near 16.665 ms. Their frame shares and repeatability do not establish workload cost. The original [vsync report](vsync-report.md), [summary](vsync-summary.json) and round-1/round-2 raw data are preserved. The measurements below disable GPU vsync and the frame-rate limit; qualification uses these uncapped results and the observed CPU/GPU bottleneck.

1920×1080 CSS pixels, DPR 1, dt 1/60 s, unchanged fixed camera and seeded scenes. Chromium adds --disable-gpu-vsync and --disable-frame-rate-limit. Each round uses five fresh scene loads with 600 warm-up and 600 measured frames per run by default. The uncapped harness submits free-running MessageChannel tasks instead of requestAnimationFrame; rafIntervalMs is null. Frame time is the performance.now() interval between actual simulation/render steps with at most two GPU frames in flight. Asynchronous fences apply backpressure and all frames drain at the end; CPU frame N can overlap GPU frame N-1. Completion-observation intervals, latency, CPU/GPU ranges, scheduler cost and sustained mean frame time are reported separately. No gl.finish, synchronous GPU wait or per-frame CPU/GPU serialization is used. Completion observation includes polling delay; neither metric claims physical scanout time.

Percentiles use nearest rank over equally sized runs. Frame share = subsystem CPU p50 / uncapped frame p50; CPU share = subsystem CPU p50 / active CPU frame p50. Classification compares active CPU p50 with GPU-range p50: at least 20% separation means CPU- or GPU-dominant, otherwise mixed; missing GPU timing means unknown. This is a descriptive inference, not proof of an exclusive bottleneck. CPU submission can include driver backpressure. CPU/GPU overlap and must not be added. A target requires numeric-array work, at least 15% of the uncapped frame and evidence of a CPU bottleneck. A CPU speedup in a GPU-limited scene is not a measured frame gain. Water upload includes Three.js geometry updates; its aggregate does not establish a portable kernel.

## water

Frame p50/p95/p99: **10.890 / 13.450 / 14.330 ms**. Active CPU p50/p95: 4.885 / 7.690 ms. GPU range p50/p95: 6.934 / 9.920 ms. Draw calls p50/p95: 7.000 / 7.000.

**Bottleneck classification: GPU**. Active CPU / GPU p50 ratio: 0.70. Original paced frame p50/p95: 16.665 / 16.840 ms (context only).

Asynchronously observed GPU-completion interval p50/p95: 10.890 / 13.460 ms. In-flight frame latency p50/p95: 21.665 / 25.010 ms (latency is not throughput). Fence/scheduler CPU p50/p95: 0.060 / 0.105 ms, reported separately from active scene CPU.

Sustained mean step / completion interval: 10.904 / 10.905 ms per frame. These means are additional throughput context, not relabeled p50 values.

Round frame p50: 11.050 vs 10.755 ms; symmetric difference **2.71%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 1.005 | 1.525 | 9.23% | 20.57% | 3.96% | GPU bottleneck; CPU gain is not a frame gain |
| Water upload / geometry preparation | 2.985 | 5.025 | 27.41% | 61.11% | 5.02% | Mixed geometry/upload; kernel not established |
| Skinned vertex math | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | GPU bottleneck; CPU gain is not a frame gain |
| Effects | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Carpet | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Remaining render submission | 0.495 | 0.860 | 4.55% | 10.13% | 9.90% | Not numeric-array work |

Final state hash: df981f46 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [uncapped-round-1](uncapped-round-1/water.json), [uncapped-round-2](uncapped-round-2/water.json).

## particles

Frame p50/p95/p99: **16.805 / 18.330 / 19.080 ms**. Active CPU p50/p95: 0.860 / 1.330 ms. GPU range p50/p95: 13.326 / 14.337 ms. Draw calls p50/p95: 4.000 / 4.000.

**Bottleneck classification: GPU**. Active CPU / GPU p50 ratio: 0.06. Original paced frame p50/p95: 16.670 / 16.925 ms (context only).

Asynchronously observed GPU-completion interval p50/p95: 16.805 / 18.350 ms. In-flight frame latency p50/p95: 33.590 / 35.710 ms (latency is not throughput). Fence/scheduler CPU p50/p95: 0.120 / 0.205 ms, reported separately from active scene CPU.

Sustained mean step / completion interval: 16.790 / 16.794 ms per frame. These means are additional throughput context, not relabeled p50 values.

Round frame p50: 16.945 vs 16.690 ms; symmetric difference **1.52%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | GPU bottleneck; CPU gain is not a frame gain |
| Water upload / geometry preparation | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Mixed geometry/upload; kernel not established |
| Skinned vertex math | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | GPU bottleneck; CPU gain is not a frame gain |
| Effects | 0.515 | 0.870 | 3.06% | 59.88% | 12.44% | Not numeric-array work |
| Carpet | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Remaining render submission | 0.305 | 0.465 | 1.81% | 35.47% | 13.11% | Not numeric-array work |

Final state hash: b595c690 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [uncapped-round-1](uncapped-round-1/particles.json), [uncapped-round-2](uncapped-round-2/particles.json).

## skinning

Frame p50/p95/p99: **14.820 / 16.675 / 18.845 ms**. Active CPU p50/p95: 14.510 / 16.295 ms. GPU range p50/p95: 4.589 / 8.451 ms. Draw calls p50/p95: 51.000 / 51.000.

**Bottleneck classification: CPU**. Active CPU / GPU p50 ratio: 3.16. Original paced frame p50/p95: 16.660 / 18.165 ms (context only).

Asynchronously observed GPU-completion interval p50/p95: 14.820 / 16.675 ms. In-flight frame latency p50/p95: 29.635 / 33.015 ms (latency is not throughput). Fence/scheduler CPU p50/p95: 0.020 / 0.030 ms, reported separately from active scene CPU.

Sustained mean step / completion interval: 15.033 / 15.028 ms per frame. These means are additional throughput context, not relabeled p50 values.

Round frame p50: 15.070 vs 14.670 ms; symmetric difference **2.69%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% of uncapped frame |
| Water upload / geometry preparation | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Mixed geometry/upload; kernel not established |
| Skinned vertex math | 13.715 | 15.350 | 92.54% | 94.52% | 2.47% | Qualifies; compare GPU skinning |
| Effects | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Carpet | 0.005 | 0.005 | 0.03% | 0.03% | 0.00% | Not numeric-array work |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Remaining render submission | 0.735 | 0.975 | 4.96% | 5.07% | 5.44% | Not numeric-array work |

Final state hash: 9c18f5c9 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [uncapped-round-1](uncapped-round-1/skinning.json), [uncapped-round-2](uncapped-round-2/skinning.json).

## Why water CPU share is not a WASM case

In the original paced data, water step p50 was 1.000 ms out of 4.790 ms active CPU: **20.9% of CPU time** (20.9% rounded). Its 6.00% share of the paced frame used a vsync-dependent denominator. Neither percentage establishes a frame bottleneck. Original GPU p50 was 8.959 ms, already above active CPU. In an ideal overlapping pipeline, shortening CPU work while it remains below GPU service time need not change throughput. Even a 2× water step is only a CPU saving, not evidence of the required 15% full-frame gain. The uncapped CPU/GPU measurements above decide whether that inference holds.

## Clock diagnostic

Earlier preliminary rounds used native rAF timestamp differences, which hide dispatch jitter. Those raw rounds remain under [preliminary-raf/](preliminary-raf/README.md), with [diagnostic samples](clock-diagnostic.json). Subsequent paced rounds fixed the wall clock but retained display pacing; see [vsync-report.md](vsync-report.md). The current uncapped rounds retain the same wall clock, simulation steps and workloads and additionally remove the presentation cap.

## Interpretation and limits

The uncapped full-frame stability gate is assessed separately from tiny subsystem timings. Sections near the timer quantum can have large relative variation; raw CPU percentiles and per-run distributions remain available. Subsystem medians are independent percentiles and need not add to the median frame. GPU ranges exclude browser compositor/presentation work; active CPU measures elapsed submission and may include driver waiting. Bottleneck labels describe this workload and environment, not every scene that uses the subsystem.

Passing the qualification gate authorizes no prototype by itself. Owner review is required before Phase 2. The 2× isolated-step gain, 15% full-frame gain, p95, cross-implementation parity and JS fallback adoption gates remain untested.

Full-frame repeatability: **PASS**. See [round 1 environment](uncapped-round-1/environment.json) and [round 2 environment](uncapped-round-2/environment.json) for CPU/GPU/OS/Chromium/flags/power/revision.

See [uncapped study notes](uncapped-notes.md) for validation, visual evidence and measurement limitations; [original notes](study-notes.md) describe the prior paced stage.

A partial [submission-only diagnostic](submission-diagnostic/README.md) is also preserved: simply removing the cap allowed CPU callbacks to outrun GPU completion and drop timer queries. Those data are excluded; every accepted uncapped run bounds the queue to two and completes all GPU frames and available timer samples.

A complete [rAF-bounded experiment](raf-bounded-diagnostic/README.md) also remains available: water callback p50 failed repeatability (6.40%) despite stable CPU/GPU medians and mean throughput. The accepted method removes rAF/compositor scheduling from uncapped render steps; that failure is not silently reported as a pass or discarded.
