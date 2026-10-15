# Simulation performance study — Phase 1

Status: measurement only. ADR 0004 remains Proposed; no optimized JS, WASM or GPU implementation was attempted.

1920×1080 CSS pixels, DPR 1, dt 1/60 s, fixed camera and seeded scene. Each round uses five fresh scene loads with 600 warm-up and 600 measured frames per run by default. Raw files record the actual counts. Frame time is the performance.now() interval between actual callbacks, including pacing and dispatch jitter. Native rAF cadence, CPU work and asynchronous GPU elapsed ranges are recorded separately. Neither CPU submission nor GPU elapsed time alone is the full frame.

Percentiles use nearest rank over equally sized runs. Share = subsystem p50 CPU / full-frame p50. The 15% gate also requires transferable numeric CPU work. Water upload combines array preparation with Three.js geometry updates; its total alone cannot establish a portable numeric kernel. Effects use JS objects; carpet/body uniforms and remaining submission fail the numeric-array condition. Skinned vertex math can qualify, with GPU skinning the preferred comparison.

## water

Frame p50/p95/p99: **16.665 / 16.840 / 16.945 ms**. Active CPU p50/p95: 4.790 / 6.915 ms. GPU range p50/p95: 8.959 / 10.274 ms. Draw calls p50/p95: 7.000 / 7.000.

Round frame p50: 16.665 vs 16.665 ms; symmetric difference **0.00%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 1.000 | 1.485 | 6.00% | 20.88% | 1.50% | Below 15% |
| Water upload / geometry preparation | 2.995 | 4.495 | 17.97% | 62.53% | 2.50% | Mixed geometry/upload; kernel not established |
| Skinned vertex math | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Effects | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Carpet | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Remaining render submission | 0.440 | 0.660 | 2.64% | 9.19% | 5.65% | Below 15% |

Final state hash: df981f46 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [round-1](round-1/water.json), [round-2](round-2/water.json).

## particles

Frame p50/p95/p99: **16.670 / 16.925 / 19.900 ms**. Active CPU p50/p95: 0.910 / 1.295 ms. GPU range p50/p95: 11.099 / 13.585 ms. Draw calls p50/p95: 4.000 / 4.000.

Round frame p50: 16.670 vs 16.665 ms; symmetric difference **0.03%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Water upload / geometry preparation | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Skinned vertex math | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Effects | 0.510 | 0.825 | 3.06% | 56.04% | 1.96% | Below 15% |
| Carpet | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Remaining render submission | 0.345 | 0.505 | 2.07% | 37.91% | 11.43% | Below 15% |

Final state hash: b595c690 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [round-1](round-1/particles.json), [round-2](round-2/particles.json).

## skinning

Frame p50/p95/p99: **16.660 / 18.165 / 21.630 ms**. Active CPU p50/p95: 14.820 / 17.860 ms. GPU range p50/p95: 6.922 / 8.706 ms. Draw calls p50/p95: 51.000 / 51.000.

Round frame p50: 16.660 vs 16.660 ms; symmetric difference **0.00%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Water upload / geometry preparation | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Skinned vertex math | 14.015 | 16.935 | 84.12% | 94.57% | 0.36% | Qualifies; compare GPU skinning |
| Effects | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Carpet | 0.005 | 0.010 | 0.03% | 0.03% | 0.00% | Below 15% |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Remaining render submission | 0.745 | 1.090 | 4.47% | 5.03% | 8.70% | Below 15% |

Final state hash: 9c18f5c9 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [round-1](round-1/skinning.json), [round-2](round-2/skinning.json).

## Clock diagnostic

Preliminary rounds used native rAF timestamp differences. An independent clock diagnostic showed these scheduled timestamps hide dispatch jitter at p95. Those raw rounds and their original report are retained under [preliminary-raf/](preliminary-raf/README.md), with the [diagnostic samples](clock-diagnostic.json). The final rounds use actual callback wall intervals and also retain native rAF cadence. Thresholds and simulation steps were unchanged.

## Interpretation and limits

The full-frame stability gate is assessed separately from tiny subsystem timings. Sections near the timer quantum can have large relative variation; raw CPU percentiles and per-run distributions remain available. Subsystem medians are independent percentiles and need not add to the median frame. GPU and CPU ranges overlap and must not be added.

Passing the qualification gate authorizes no prototype by itself. Owner review is required before Phase 2. The 2× isolated-step gain, 15% full-frame gain, p95, cross-implementation parity and JS fallback adoption gates remain untested.

Full-frame repeatability: **PASS**. See [round 1 environment](round-1/environment.json) and [round 2 environment](round-2/environment.json) for CPU/GPU/OS/Chromium/flags/power/revision.
