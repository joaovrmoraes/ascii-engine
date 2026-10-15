# Superseded rAF-bounded uncapped experiment

This complete dataset is retained unchanged. The water submission-interval p50
failed the 5% repeatability gate (6.40%), while CPU/GPU medians and observed
completion cadence were much more stable. The final method removes rAF from
the uncapped submission scheduler; it does not change simulation work. The
report below is historical diagnostic evidence, not final qualification.

# Simulation performance study — Phase 1

Status: measurement only. ADR 0004 remains Proposed; no optimized JS, WASM or GPU implementation was attempted.

Methodology amendment: the original display-paced measurements were limited by presentation cadence near 16.665 ms. Their frame shares and repeatability do not establish workload cost. The original [vsync report](../vsync-report.md), [summary](../vsync-summary.json) and round-1/round-2 raw data are preserved. The measurements below disable GPU vsync and the frame-rate limit; qualification uses these uncapped results and the observed CPU/GPU bottleneck.

1920×1080 CSS pixels, DPR 1, dt 1/60 s, unchanged fixed camera and seeded scenes. Chromium adds --disable-gpu-vsync and --disable-frame-rate-limit. Each round uses five fresh scene loads with 600 warm-up and 600 measured frames per run by default. Frame time is the performance.now() interval between actual simulation/render submissions with at most two GPU frames in flight. Asynchronous WebGL fences apply backpressure and all frames drain at the end; CPU frame N can overlap GPU frame N-1. Completion-observation intervals, native rAF cadence, CPU work, GPU ranges and scheduler CPU cost are also recorded. No gl.finish, synchronous GPU wait or per-frame CPU/GPU serialization is used. Completion observation includes polling delay; neither metric claims physical scanout time.

Percentiles use nearest rank over equally sized runs. Frame share = subsystem CPU p50 / uncapped frame p50; CPU share = subsystem CPU p50 / active CPU frame p50. Classification compares active CPU p50 with GPU-range p50: at least 20% separation means CPU- or GPU-dominant, otherwise mixed; missing GPU timing means unknown. This is a descriptive inference, not proof of an exclusive bottleneck. CPU submission can include driver backpressure. CPU/GPU overlap and must not be added. A target requires numeric-array work, at least 15% of the uncapped frame and evidence of a CPU bottleneck. A CPU speedup in a GPU-limited scene is not a measured frame gain. Water upload includes Three.js geometry updates; its aggregate does not establish a portable kernel.

## water

Frame p50/p95/p99: **10.465 / 24.255 / 26.015 ms**. Active CPU p50/p95: 4.765 / 7.555 ms. GPU range p50/p95: 6.666 / 9.841 ms. Draw calls p50/p95: 7.000 / 7.000.

**Bottleneck classification: GPU**. Active CPU / GPU p50 ratio: 0.71. Original paced frame p50/p95: 16.665 / 16.840 ms (context only).

Asynchronously observed GPU-completion interval p50/p95: 13.920 / 21.090 ms. In-flight frame latency p50/p95: 22.335 / 31.290 ms (latency is not throughput). Fence/scheduler CPU p50/p95: 0.035 / 0.085 ms, reported separately from active scene CPU.

Round frame p50: 10.060 vs 10.725 ms; symmetric difference **6.40%** (UNSTABLE; investigate before concluding).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 0.995 | 1.505 | 9.51% | 20.88% | 1.01% | GPU bottleneck; CPU gain is not a frame gain |
| Water upload / geometry preparation | 2.975 | 5.070 | 28.43% | 62.43% | 0.17% | Mixed geometry/upload; kernel not established |
| Skinned vertex math | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | GPU bottleneck; CPU gain is not a frame gain |
| Effects | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Carpet | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Remaining render submission | 0.440 | 0.675 | 4.20% | 9.23% | 4.55% | Not numeric-array work |

Final state hash: df981f46 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [uncapped-round-1](uncapped-round-1/water.json), [uncapped-round-2](uncapped-round-2/water.json).

## particles

Frame p50/p95/p99: **18.815 / 19.680 / 20.380 ms**. Active CPU p50/p95: 0.875 / 1.370 ms. GPU range p50/p95: 13.291 / 14.299 ms. Draw calls p50/p95: 4.000 / 4.000.

**Bottleneck classification: GPU**. Active CPU / GPU p50 ratio: 0.07. Original paced frame p50/p95: 16.670 / 16.925 ms (context only).

Asynchronously observed GPU-completion interval p50/p95: 16.780 / 18.325 ms. In-flight frame latency p50/p95: 26.000 / 34.120 ms (latency is not throughput). Fence/scheduler CPU p50/p95: 0.075 / 0.170 ms, reported separately from active scene CPU.

Round frame p50: 18.840 vs 18.790 ms; symmetric difference **0.27%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | GPU bottleneck; CPU gain is not a frame gain |
| Water upload / geometry preparation | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Mixed geometry/upload; kernel not established |
| Skinned vertex math | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | GPU bottleneck; CPU gain is not a frame gain |
| Effects | 0.520 | 0.875 | 2.76% | 59.43% | 0.96% | Not numeric-array work |
| Carpet | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Remaining render submission | 0.315 | 0.505 | 1.67% | 36.00% | 1.57% | Not numeric-array work |

Final state hash: b595c690 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [uncapped-round-1](uncapped-round-1/particles.json), [uncapped-round-2](uncapped-round-2/particles.json).

## skinning

Frame p50/p95/p99: **15.085 / 20.085 / 25.330 ms**. Active CPU p50/p95: 14.790 / 19.645 ms. GPU range p50/p95: 4.832 / 8.604 ms. Draw calls p50/p95: 51.000 / 51.000.

**Bottleneck classification: CPU**. Active CPU / GPU p50 ratio: 3.06. Original paced frame p50/p95: 16.660 / 18.165 ms (context only).

Asynchronously observed GPU-completion interval p50/p95: 15.085 / 20.060 ms. In-flight frame latency p50/p95: 30.245 / 39.290 ms (latency is not throughput). Fence/scheduler CPU p50/p95: 0.020 / 0.035 ms, reported separately from active scene CPU.

Round frame p50: 15.350 vs 14.925 ms; symmetric difference **2.81%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% of uncapped frame |
| Water upload / geometry preparation | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Mixed geometry/upload; kernel not established |
| Skinned vertex math | 14.000 | 18.575 | 92.81% | 94.66% | 2.46% | Qualifies; compare GPU skinning |
| Effects | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Carpet | 0.005 | 0.010 | 0.03% | 0.03% | 0.00% | Not numeric-array work |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Not numeric-array work |
| Remaining render submission | 0.730 | 1.120 | 4.84% | 4.94% | 5.48% | Not numeric-array work |

Final state hash: 9c18f5c9 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [uncapped-round-1](uncapped-round-1/skinning.json), [uncapped-round-2](uncapped-round-2/skinning.json).

## Why water CPU share is not a WASM case

In the original paced data, water step p50 was 1.000 ms out of 4.790 ms active CPU: **20.9% of CPU time** (20.9% rounded). Its 6.00% share of the paced frame used a vsync-dependent denominator. Neither percentage establishes a frame bottleneck. Original GPU p50 was 8.959 ms, already above active CPU. In an ideal overlapping pipeline, shortening CPU work while it remains below GPU service time need not change throughput. Even a 2× water step is only a CPU saving, not evidence of the required 15% full-frame gain. The uncapped CPU/GPU measurements above decide whether that inference holds.

## Clock diagnostic

Earlier preliminary rounds used native rAF timestamp differences, which hide dispatch jitter. Those raw rounds remain under [preliminary-raf/](../preliminary-raf/README.md), with [diagnostic samples](../clock-diagnostic.json). Subsequent paced rounds fixed the wall clock but retained display pacing; see [vsync-report.md](../vsync-report.md). The current uncapped rounds retain the same wall clock, simulation steps and workloads and additionally remove the presentation cap.

## Interpretation and limits

The uncapped full-frame stability gate is assessed separately from tiny subsystem timings. Sections near the timer quantum can have large relative variation; raw CPU percentiles and per-run distributions remain available. Subsystem medians are independent percentiles and need not add to the median frame. GPU ranges exclude browser compositor/presentation work; active CPU measures elapsed submission and may include driver waiting. Bottleneck labels describe this workload and environment, not every scene that uses the subsystem.

Passing the qualification gate authorizes no prototype by itself. Owner review is required before Phase 2. The 2× isolated-step gain, 15% full-frame gain, p95, cross-implementation parity and JS fallback adoption gates remain untested.

Full-frame repeatability: **FAIL**. See [round 1 environment](uncapped-round-1/environment.json) and [round 2 environment](uncapped-round-2/environment.json) for CPU/GPU/OS/Chromium/flags/power/revision.

See [uncapped study notes](../uncapped-notes.md) for validation, visual evidence and measurement limitations; [original notes](../study-notes.md) describe the prior paced stage.

A partial [submission-only diagnostic](../submission-diagnostic/README.md) is also preserved: simply removing the cap allowed CPU callbacks to outrun GPU completion and drop timer queries. Those data are excluded; every accepted uncapped run bounds the queue to two and completes all GPU frames and available timer samples.
