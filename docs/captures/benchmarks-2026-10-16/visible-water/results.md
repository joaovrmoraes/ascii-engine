# Visible-water preparation: before and after

[Protocol and validation](README.md). Every point uses the same seed, dt, view and scene, two rounds × five fresh Chromium processes × 600 warm-up/600 measured frames. No vsync, CPU 6, no extensions, ANGLE GL, 1920×1080/DPR 1. CPU/GPU overlap; GPU ranges can include submission gaps. No WASM.

| Version | Largest measured at 60 fps | Largest measured at 30 fps | End condition |
| --- | ---: | ---: | --- |
| before | 2 (12.530 ms worst-round p95) | 4 (27.260 ms worst-round p95) | both-budgets-crossed |
| after | ≥2 (14.160 ms worst-round p95) | ≥2 (14.160 ms worst-round p95) | numeric-target-gate |

A ≥ mark is a tested lower bound. Qualification stops further collection for owner review; it is not an observed FPS ceiling. No interpolation between measured loads.

## Full frame and bottleneck

All times are p50 / p95 ms; the separate worse-round p95 controls capacity.

| Waters | Version | Frame | Worst round p95 ms | Active CPU | GPU range | Bottleneck | Frame-p50 round difference | Raw rounds |
| ---: | --- | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 1 | before | 7.835 / 10.375 | 10.395 | 4.625 / 6.990 | 4.432 / 6.740 | mixed | 1.34% | [1](before-capacity/water-visible-1-round-1/water-visible-1.json), [2](before-capacity/water-visible-1-round-2/water-visible-1.json) |
| 2 | before | 10.420 / 12.430 | 12.530 | 10.045 / 11.695 | 5.010 / 7.246 | CPU | 1.54% | [1](before-capacity/water-visible-2-round-1/water-visible-2.json), [2](before-capacity/water-visible-2-round-2/water-visible-2.json) |
| 4 | before | 22.085 / 26.890 | 27.260 | 21.650 / 26.385 | 9.639 / 13.726 | CPU | 2.52% | [1](before-capacity/water-visible-4-round-1/water-visible-4.json), [2](before-capacity/water-visible-4-round-2/water-visible-4.json) |
| 8 | before | 41.365 / 49.315 | 49.880 | 40.955 / 48.805 | 11.836 / 17.863 | CPU | 2.37% | [1](before-capacity/water-visible-8-round-1/water-visible-8.json), [2](before-capacity/water-visible-8-round-2/water-visible-8.json) |
| 1 | after | 8.345 / 10.935 | 11.650 | 3.310 / 5.235 | 4.490 / 5.682 | GPU | 4.47% | [1](after-capacity/water-visible-1-round-1/water-visible-1.json), [2](after-capacity/water-visible-1-round-2/water-visible-1.json) |
| 2 | after | 9.580 / 13.710 | 14.160 | 8.340 / 12.540 | 4.312 / 7.622 | CPU | 1.30% | [1](after-capacity/water-visible-2-round-1/water-visible-2.json), [2](after-capacity/water-visible-2-round-2/water-visible-2.json) |

## CPU cost per visible water

Normalize each frame by its water count, then compute percentiles. Remainder is computed per sample from active CPU minus the three disjoint water sections, before taking percentiles. It includes shared scene/render work amortized across waters. Do not add independent medians as if they were a measured CPU percentile. Preparation builds texture arrays/deforms geometry/rebuilds normals and bounds; actual GPU transfer happens during render submission. Reflection includes uniforms, culling, mirror selection and reflection submission.

| Waters | Version | Simulation | Geometry/texture preparation | Mirrors/reflection | Remainder | Active CPU per water |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | before | 0.755 / 1.210 | 2.995 / 4.795 | 0.410 / 0.655 | 0.365 / 0.570 | 4.625 / 6.990 |
| 2 | before | 1.385 / 1.712 | 3.072 / 3.620 | 0.352 / 0.482 | 0.175 / 0.235 | 5.023 / 5.848 |
| 4 | before | 1.484 / 1.855 | 3.321 / 4.103 | 0.406 / 0.540 | 0.176 / 0.237 | 5.413 / 6.596 |
| 8 | before | 1.422 / 1.712 | 3.194 / 3.816 | 0.366 / 0.478 | 0.132 / 0.181 | 5.119 / 6.101 |
| 1 | after | 0.795 / 1.220 | 1.605 / 2.450 | 0.430 / 0.865 | 0.425 / 0.770 | 3.310 / 5.235 |
| 2 | after | 1.587 / 2.480 | 1.810 / 2.688 | 0.450 / 0.750 | 0.280 / 0.447 | 4.170 / 6.270 |

## Frame p50 improvement at matched loads

| Waters | Before ms | After ms | Reduction | State hash |
| ---: | ---: | ---: | ---: | --- |
| 1 | 7.835 | 8.345 | -6.51% | a902d504 (identical) |
| 2 | 10.420 | 9.580 | 8.06% | 301f5d49 (identical) |

## Owner review gate

Stopped after 2 visible waters: numeric step p50 3.175 ms / frame p50 9.580 ms = 33.14%. Active CPU dominates GPU range in the aggregate and both rounds. This passes the original ≥15% numeric-CPU qualification rule after optimized JS. No WASM prototype, additional optimization or higher-load search was started beyond this gate. Qualification is not adoption: 2× isolated, ≥15% frame gain without p95 regression, parity and fallback remain unproven for any alternative.
