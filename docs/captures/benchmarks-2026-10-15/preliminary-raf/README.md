> Preliminary data: frameMs below measures scheduled rAF cadence, not actual callback wall time. Retained for audit; use the parent directory for the final report.

# Simulation performance study — Phase 1

Status: measurement only. ADR 0004 remains Proposed; no optimized JS, WASM or GPU implementation was attempted.

1920×1080 CSS pixels, DPR 1, dt 1/60 s, fixed camera and seeded scene. Each round uses five fresh scene loads with 600 warm-up and 600 measured frames per run by default. Raw files record the actual counts. Frame time is the observed presentation interval; CPU work and asynchronous GPU elapsed ranges are reported separately. Neither CPU submission nor GPU elapsed time alone is the full frame.

Percentiles use nearest rank over equally sized runs. Share = subsystem p50 CPU / full-frame p50. The 15% gate also requires transferable numeric CPU work. Water upload combines array preparation with Three.js geometry updates; its total alone cannot establish a portable numeric kernel. Effects use JS objects; carpet/body uniforms and remaining submission fail the numeric-array condition. Skinned vertex math can qualify, with GPU skinning the preferred comparison.

## water

Frame p50/p95/p99: **16.665 / 16.670 / 16.670 ms**. Active CPU p50/p95: 4.705 / 6.220 ms. GPU range p50/p95: 8.948 / 10.149 ms. Draw calls p50/p95: 7.000 / 7.000.

Round frame p50: 16.665 vs 16.665 ms; symmetric difference **0.00%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 0.995 | 1.450 | 5.97% | 21.15% | 1.01% | Below 15% |
| Water upload / geometry preparation | 2.950 | 3.975 | 17.70% | 62.70% | 0.51% | Mixed geometry/upload; kernel not established |
| Skinned vertex math | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Effects | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Carpet | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Remaining render submission | 0.430 | 0.580 | 2.58% | 9.14% | 3.47% | Below 15% |

Final state hash: df981f46 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [round-1](round-1/water.json), [round-2](round-2/water.json).

## particles

Frame p50/p95/p99: **16.665 / 16.670 / 16.670 ms**. Active CPU p50/p95: 0.900 / 1.225 ms. GPU range p50/p95: 11.071 / 11.647 ms. Draw calls p50/p95: 4.000 / 4.000.

Round frame p50: 16.665 vs 16.665 ms; symmetric difference **0.00%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Water upload / geometry preparation | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Skinned vertex math | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Effects | 0.500 | 0.810 | 3.00% | 55.56% | 8.00% | Below 15% |
| Carpet | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Remaining render submission | 0.345 | 0.475 | 2.07% | 38.33% | 17.65% | Below 15% |

Final state hash: b595c690 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [round-1](round-1/particles.json), [round-2](round-2/particles.json).

## skinning

Frame p50/p95/p99: **16.665 / 16.670 / 16.670 ms**. Active CPU p50/p95: 14.480 / 16.360 ms. GPU range p50/p95: 7.858 / 8.978 ms. Draw calls p50/p95: 51.000 / 51.000.

Round frame p50: 16.665 vs 16.665 ms; symmetric difference **0.00%** (within 5%).

| Subsystem | CPU p50 ms | CPU p95 ms | Frame share | CPU-frame share | Round p50 difference | Qualification |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Water step | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Water upload / geometry preparation | 0.000 | 0.000 | 0.00% | 0.00% | 0.00% | Below 15% |
| Skinned vertex math | 13.715 | 15.560 | 82.30% | 94.72% | 2.22% | Qualifies; compare GPU skinning |
| Effects | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Carpet | 0.005 | 0.005 | 0.03% | 0.03% | 0.00% | Below 15% |
| Body uniforms | 0.000 | 0.005 | 0.00% | 0.00% | 0.00% | Below 15% |
| Remaining render submission | 0.710 | 0.865 | 4.26% | 4.90% | 2.11% | Below 15% |

Final state hash: 9c18f5c9 in all 10 runs. GPU samples: 6000/6000. Timer quantum: 0.004999998956918716 ms.

Raw data: [round-1](round-1/skinning.json), [round-2](round-2/skinning.json).

## Interpretation and limits

The full-frame stability gate is assessed separately from tiny subsystem timings. Sections near the timer quantum can have large relative variation; raw CPU percentiles and per-run distributions remain available. Subsystem medians are independent percentiles and need not add to the median frame. GPU and CPU ranges overlap and must not be added.

Passing the qualification gate authorizes no prototype by itself. Owner review is required before Phase 2. The 2× isolated-step gain, 15% full-frame gain, p95, cross-implementation parity and JS fallback adoption gates remain untested.

Full-frame repeatability: **PASS**. See [round 1 environment](round-1/environment.json) and [round 2 environment](round-2/environment.json) for CPU/GPU/OS/Chromium/flags/power/revision.
