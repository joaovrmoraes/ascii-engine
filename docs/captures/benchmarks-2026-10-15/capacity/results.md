# Optimized JavaScript capacity — measured results

See the [protocol](README.md), [raw manifest](manifest.json) and [machine/environment JSON beside every raw run](manifest.json).

Every fresh point: two rounds × five executions × 600 warm-up/600 measured frames; seed 4242, dt 1/60 s, uncapped Chromium, 1920×1080 DPR 1, ANGLE GL, active renderer main thread on P-core CPU 6, fresh process/profile, no extensions. Historical reuse is limited to exactly matched Phase 2 water points. Percentiles are nearest-rank over 6,000 measured frames. Capacity compares the worse of two round p95 values with 16.7/33.3 ms. CPU and GPU overlap and are not summed; a 20% separation describes dominance. GPU water ranges can contain CPU submission gaps.

The largest measured passing load is a measured bound, not an interpolated exact maximum. A ≥ symbol means the tested range ended without crossing that budget. Every accepted frame-p50 repeatability gate is ≤5%; final fixed-step hashes agree across ten executions per point.

| Axis | Largest measured at 60 fps | Largest measured at 30 fps | End condition |
| --- | ---: | ---: | --- |
| Visible skinned creatures | 128 (next tested failure: 256) | 256 (next tested failure: 512) | both-budgets-crossed |
| Loaded waters, pause off | 2 (next tested failure: 4) | 4 (next tested failure: 8) | both-budgets-crossed |
| Loaded waters, pause on | 2048 (next tested failure: 4096) | ≥4096 | resource-bound |
| Simultaneously visible waters | 2 (next tested failure: 4) | 4 (next tested failure: 8) | both-budgets-crossed |
| Simultaneous effect groups (3 effects each) | 4 (next tested failure: 8) | 24 (next tested failure: 32) | both-budgets-crossed |
| One visible water: geometry grid width | 129 (next tested failure: 257) | 257 (next tested failure: 513) | both-budgets-crossed |

## All measured points

CPU and GPU are elapsed ranges in milliseconds; they include the renderer/driver work captured by their respective instruments. The frame includes dispatch and GPU queue pacing, with no vsync. “Worst p95” controls the capacity result; pooled p95 is retained alongside it.

### Visible skinned creatures

| Load | Frame p50 / pooled p95 ms | Worst round p95 ms | CPU p50 / p95 ms | GPU p50 / p95 ms | Bottleneck | Frame p50 repeat difference | Raw rounds |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 1 | 7.715 / 10.445 | 10.640 | 0.410 / 0.650 | 3.501 / 6.741 | GPU | 1.04% | [1](skinning-1-round-1/skinning-1.json), [2](skinning-1-round-2/skinning-1.json) |
| 2 | 7.775 / 10.615 | 10.635 | 0.460 / 0.710 | 3.517 / 6.799 | GPU | 0.77% | [1](skinning-2-round-1/skinning-2.json), [2](skinning-2-round-2/skinning-2.json) |
| 4 | 8.055 / 10.895 | 11.065 | 0.655 / 1.055 | 3.519 / 6.850 | GPU | 1.93% | [1](skinning-4-round-1/skinning-4.json), [2](skinning-4-round-2/skinning-4.json) |
| 8 | 8.235 / 11.040 | 11.055 | 0.830 / 1.430 | 3.597 / 6.924 | GPU | 0.24% | [1](skinning-8-round-1/skinning-8.json), [2](skinning-8-round-2/skinning-8.json) |
| 16 | 8.635 / 11.345 | 11.530 | 1.215 / 2.060 | 3.768 / 7.075 | GPU | 0.23% | [1](skinning-16-round-1/skinning-16.json), [2](skinning-16-round-2/skinning-16.json) |
| 32 | 9.055 / 11.905 | 12.060 | 2.060 / 3.540 | 3.585 / 6.942 | GPU | 0.33% | [1](skinning-32-round-1/skinning-32.json), [2](skinning-32-round-2/skinning-32.json) |
| 64 | 10.125 / 13.200 | 13.330 | 3.845 / 6.515 | 4.037 / 7.119 | mixed | 2.47% | [1](skinning-64-round-1/skinning-64.json), [2](skinning-64-round-2/skinning-64.json) |
| 128 | 11.980 / 14.900 | 15.000 | 7.590 / 11.785 | 5.972 / 8.566 | CPU | 0.54% | [1](skinning-128-round-1/skinning-128.json), [2](skinning-128-round-2/skinning-128.json) |
| 256 | 16.935 / 22.745 | 23.025 | 15.770 / 19.865 | 9.882 / 14.098 | CPU | 0.71% | [1](skinning-256-round-1/skinning-256.json), [2](skinning-256-round-2/skinning-256.json) |
| 512 | 29.885 / 34.390 | 35.340 | 29.485 / 33.790 | 16.027 / 24.478 | CPU | 4.50% | [1](skinning-512-round-1/skinning-512.json), [2](skinning-512-round-2/skinning-512.json) |

| Creatures | Skinned letters | Creatures in frustum |
| ---: | ---: | ---: |
| 1 | 1094 | 1 |
| 2 | 2188 | 2 |
| 4 | 4708 | 4 |
| 8 | 9173 | 8 |
| 16 | 18179 | 16 |
| 32 | 36503 | 32 |
| 64 | 72325 | 64 |
| 128 | 144670 | 128 |
| 256 | 286366 | 256 |
| 512 | 571751 | 512 |

Configuration is recorded per point in [summary.json](summary.json). Sources: `4264ce1`.

### Loaded waters, pause off

| Load | Frame p50 / pooled p95 ms | Worst round p95 ms | CPU p50 / p95 ms | GPU p50 / p95 ms | Bottleneck | Frame p50 repeat difference | Raw rounds |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 1 | 7.970 / 10.725 | 10.840 | 4.605 / 7.250 | 4.445 / 7.017 | mixed | 1.32% | [1](../phase-2/water-scale-1-round-1/water-scale-1-off.json), [2](../phase-2/water-scale-1-round-2/water-scale-1-off.json) |
| 2 | 10.340 / 13.190 | 13.440 | 9.945 / 12.520 | 4.820 / 7.368 | CPU | 1.26% | [1](../phase-2/water-scale-2-round-1/water-scale-2-off.json), [2](../phase-2/water-scale-2-round-2/water-scale-2-off.json) |
| 4 | 19.645 / 23.750 | 24.375 | 19.295 / 23.350 | 8.124 / 11.981 | CPU | 2.42% | [1](../phase-2/water-scale-4-round-1/water-scale-4-off.json), [2](../phase-2/water-scale-4-round-2/water-scale-4-off.json) |
| 8 | 37.010 / 42.990 | 43.505 | 36.660 / 42.620 | 9.580 / 14.915 | CPU | 1.10% | [1](../phase-2/water-scale-8-round-1/water-scale-8-off.json), [2](../phase-2/water-scale-8-round-2/water-scale-8-off.json) |

| Load | Mesh / solver width | Visible waters | Reflection levels | Draw calls p50 |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 129 / 129 | 1 | not recorded (historical) | 5 |
| 2 | 129 / 129 | 1 | not recorded (historical) | 5 |
| 4 | 129 / 129 | 1 | not recorded (historical) | 5 |
| 8 | 129 / 129 | 1 | not recorded (historical) | 5 |

Configuration is recorded per point in [summary.json](summary.json). Sources: `4f5120c`.

### Loaded waters, pause on

| Load | Frame p50 / pooled p95 ms | Worst round p95 ms | CPU p50 / p95 ms | GPU p50 / p95 ms | Bottleneck | Frame p50 repeat difference | Raw rounds |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 1 | 7.980 / 10.645 | 10.745 | 4.650 / 7.460 | 4.444 / 7.062 | mixed | 1.50% | [1](../phase-2/water-scale-1-round-1/water-scale-1-pause.json), [2](../phase-2/water-scale-1-round-2/water-scale-1-pause.json) |
| 2 | 8.055 / 10.540 | 10.825 | 5.245 / 8.145 | 4.438 / 7.044 | mixed | 0.87% | [1](../phase-2/water-scale-2-round-1/water-scale-2-pause.json), [2](../phase-2/water-scale-2-round-2/water-scale-2-pause.json) |
| 4 | 8.170 / 11.395 | 11.855 | 5.390 / 8.410 | 4.438 / 7.145 | CPU | 0.12% | [1](../phase-2/water-scale-4-round-1/water-scale-4-pause.json), [2](../phase-2/water-scale-4-round-2/water-scale-4-pause.json) |
| 8 | 7.915 / 10.620 | 10.715 | 5.130 / 7.805 | 4.434 / 6.683 | mixed | 0.76% | [1](../phase-2/water-scale-8-round-1/water-scale-8-pause.json), [2](../phase-2/water-scale-8-round-2/water-scale-8-pause.json) |
| 16 | 9.180 / 12.165 | 12.345 | 5.575 / 8.835 | 4.494 / 7.946 | CPU | 2.13% | [1](water-scale-16-pause-round-1/water-scale-16-pause.json), [2](water-scale-16-pause-round-2/water-scale-16-pause.json) |
| 32 | 9.210 / 12.280 | 12.485 | 5.600 / 9.045 | 4.491 / 7.917 | CPU | 3.04% | [1](water-scale-32-pause-round-1/water-scale-32-pause.json), [2](water-scale-32-pause-round-2/water-scale-32-pause.json) |
| 64 | 9.045 / 11.780 | 12.000 | 5.505 / 8.700 | 4.482 / 7.912 | CPU | 2.77% | [1](water-scale-64-pause-round-1/water-scale-64-pause.json), [2](water-scale-64-pause-round-2/water-scale-64-pause.json) |
| 128 | 9.385 / 12.675 | 13.010 | 6.235 / 9.470 | 4.495 / 7.956 | CPU | 3.46% | [1](water-scale-128-pause-round-1/water-scale-128-pause.json), [2](water-scale-128-pause-round-2/water-scale-128-pause.json) |
| 256 | 9.100 / 11.950 | 11.975 | 6.140 / 9.300 | 4.483 / 7.906 | CPU | 0.33% | [1](water-scale-256-pause-round-1/water-scale-256-pause.json), [2](water-scale-256-pause-round-2/water-scale-256-pause.json) |
| 512 | 8.750 / 11.630 | 12.010 | 7.450 / 9.665 | 4.476 / 5.863 | CPU | 0.86% | [1](water-scale-512-pause-round-1/water-scale-512-pause.json), [2](water-scale-512-pause-round-2/water-scale-512-pause.json) |
| 1024 | 8.785 / 9.860 | 9.930 | 8.425 / 9.215 | 4.840 / 5.107 | CPU | 0.34% | [1](water-scale-1024-pause-round-1/water-scale-1024-pause.json), [2](water-scale-1024-pause-round-2/water-scale-1024-pause.json) |
| 2048 | 12.255 / 15.295 | 15.865 | 11.910 / 14.830 | 6.234 / 7.575 | CPU | 0.49% | [1](water-scale-2048-pause-round-1/water-scale-2048-pause.json), [2](water-scale-2048-pause-round-2/water-scale-2048-pause.json) |
| 4096 | 18.250 / 21.110 | 21.510 | 17.915 / 20.715 | 9.598 / 11.702 | CPU | 0.19% | [1](water-scale-4096-pause-round-1/water-scale-4096-pause.json), [2](water-scale-4096-pause-round-2/water-scale-4096-pause.json) |

| Load | Mesh / solver width | Visible waters | Reflection levels | Draw calls p50 |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 129 / 129 | 1 | not recorded (historical) | 5 |
| 2 | 129 / 129 | 1 | not recorded (historical) | 5 |
| 4 | 129 / 129 | 1 | not recorded (historical) | 5 |
| 8 | 129 / 129 | 1 | not recorded (historical) | 5 |
| 16 | 129 / 129 | 1 | 1 | 5 |
| 32 | 129 / 129 | 1 | 1 | 5 |
| 64 | 129 / 129 | 1 | 1 | 5 |
| 128 | 129 / 129 | 1 | 1 | 5 |
| 256 | 129 / 129 | 1 | 1 | 5 |
| 512 | 129 / 129 | 1 | 1 | 5 |
| 1024 | 129 / 129 | 1 | 1 | 5 |
| 2048 | 129 / 129 | 1 | 1 | 5 |
| 4096 | 129 / 129 | 1 | 1 | 5 |

**Resource stop:** load 8192 was not allocated. Projected renderer peak 13.173 GiB, available 11.595 GiB, reserve 4 GiB. This is an operational memory bound, not an observed frame-time ceiling.

Configuration is recorded per point in [summary.json](summary.json). Sources: `4f5120c`, `4264ce1`, `62ed9f7`.

### Simultaneously visible waters

| Load | Frame p50 / pooled p95 ms | Worst round p95 ms | CPU p50 / p95 ms | GPU p50 / p95 ms | Bottleneck | Frame p50 repeat difference | Raw rounds |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 1 | 7.970 / 10.725 | 10.840 | 4.605 / 7.250 | 4.445 / 7.017 | mixed | 1.32% | [1](../phase-2/water-scale-1-round-1/water-scale-1-off.json), [2](../phase-2/water-scale-1-round-2/water-scale-1-off.json) |
| 2 | 10.290 / 11.780 | 12.385 | 9.985 / 11.360 | 5.550 / 6.213 | CPU | 4.08% | [1](water-visible-2-round-1/water-visible-2.json), [2](water-visible-2-round-2/water-visible-2.json) |
| 4 | 20.180 / 23.295 | 23.515 | 19.840 / 22.920 | 10.405 / 12.362 | CPU | 0.27% | [1](water-visible-4-round-1/water-visible-4.json), [2](water-visible-4-round-2/water-visible-4.json) |
| 8 | 40.015 / 47.175 | 48.695 | 39.575 / 46.685 | 9.525 / 14.280 | CPU | 3.13% | [1](water-visible-8-round-1/water-visible-8.json), [2](water-visible-8-round-2/water-visible-8.json) |

| Load | Mesh / solver width | Visible waters | Reflection levels | Draw calls p50 |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 129 / 129 | 1 | not recorded (historical) | 5 |
| 2 | 129 / 129 | 2 | 2 | 7 |
| 4 | 129 / 129 | 4 | 4 | 11 |
| 8 | 129 / 129 | 8 | 8 | 19 |

Configuration is recorded per point in [summary.json](summary.json). Sources: `4f5120c`, `4264ce1`.

### Simultaneous effect groups (3 effects each)

| Load | Frame p50 / pooled p95 ms | Worst round p95 ms | CPU p50 / p95 ms | GPU p50 / p95 ms | Bottleneck | Frame p50 repeat difference | Raw rounds |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 1 | 9.260 / 11.620 | 11.660 | 0.450 / 0.740 | 4.610 / 7.863 | GPU | 0.65% | [1](particles-1-round-1/particles-1.json), [2](particles-1-round-2/particles-1.json) |
| 2 | 10.600 / 13.110 | 13.205 | 0.545 / 0.885 | 5.660 / 8.959 | GPU | 0.71% | [1](particles-2-round-1/particles-2.json), [2](particles-2-round-2/particles-2.json) |
| 4 | 13.760 / 15.720 | 15.795 | 0.635 / 1.085 | 10.107 / 11.445 | GPU | 0.15% | [1](particles-4-round-1/particles-4.json), [2](particles-4-round-2/particles-4.json) |
| 8 | 17.440 / 19.110 | 19.120 | 0.850 / 1.465 | 13.435 / 14.611 | GPU | 0.37% | [1](particles-8-round-1/particles-8.json), [2](particles-8-round-2/particles-8.json) |
| 16 | 23.995 / 25.280 | 25.335 | 1.165 / 2.075 | 20.234 / 21.000 | GPU | 0.15% | [1](particles-16-round-1/particles-16.json), [2](particles-16-round-2/particles-16.json) |
| 24 | 31.000 / 32.485 | 32.720 | 1.625 / 2.860 | 27.246 / 27.897 | GPU | 0.77% | [1](particles-24-round-1/particles-24.json), [2](particles-24-round-2/particles-24.json) |
| 32 | 41.585 / 42.715 | 42.740 | 1.960 / 2.720 | 38.255 / 39.174 | GPU | 0.11% | [1](particles-32-round-1/particles-32.json), [2](particles-32-round-2/particles-32.json) |

| Groups | Effects | Emitters | Live letters at end | Timed draw-point range |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 3 | 8 | 157 | 135–241 |
| 2 | 6 | 16 | 311 | 278–476 |
| 4 | 12 | 32 | 618 | 556–955 |
| 8 | 24 | 64 | 1243 | 1104–1903 |
| 16 | 48 | 128 | 2458 | 2236–3810 |
| 24 | 72 | 192 | 3734 | 3331–5689 |
| 32 | 96 | 256 | 4939 | 4433–7606 |

Configuration is recorded per point in [summary.json](summary.json). Sources: `4264ce1`.

### One visible water: geometry grid width

| Load | Frame p50 / pooled p95 ms | Worst round p95 ms | CPU p50 / p95 ms | GPU p50 / p95 ms | Bottleneck | Frame p50 repeat difference | Raw rounds |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 65 | 7.340 / 10.175 | 10.405 | 1.410 / 2.275 | 4.036 / 5.380 | GPU | 0.27% | [1](water-grid-65-round-1/water-grid-65.json), [2](water-grid-65-round-2/water-grid-65.json) |
| 129 | 7.970 / 10.725 | 10.840 | 4.605 / 7.250 | 4.445 / 7.017 | mixed | 1.32% | [1](../phase-2/water-scale-1-round-1/water-scale-1-off.json), [2](../phase-2/water-scale-1-round-2/water-scale-1-off.json) |
| 257 | 14.320 / 17.900 | 18.110 | 13.945 / 17.450 | 6.591 / 8.530 | CPU | 0.98% | [1](water-grid-257-round-1/water-grid-257.json), [2](water-grid-257-round-2/water-grid-257.json) |
| 513 | 48.730 / 55.780 | 57.610 | 48.390 / 55.310 | 13.984 / 20.920 | CPU | 2.86% | [1](water-grid-513-round-1/water-grid-513.json), [2](water-grid-513-round-2/water-grid-513.json) |

| Load | Mesh / solver width | Visible waters | Reflection levels | Draw calls p50 |
| ---: | ---: | ---: | ---: | ---: |
| 65 | 65 / 65 | 1 | 1 | 5 |
| 129 | 129 / 129 | 1 | not recorded (historical) | 5 |
| 257 | 257 / 129 | 1 | 1 | 5 |
| 513 | 513 / 129 | 1 | 1 | 5 |

Configuration is recorded per point in [summary.json](summary.json). Sources: `4264ce1`, `4f5120c`.

## Workload boundaries

- Creature counts use one fixed seven-bone, 144-source-vertex model and alphabet/density; the ground patch stays 34 m wide; every creature remains visible, with a fitted orthographic camera at larger loads. This does not maintain constant projected creature size or predict arbitrary imported models.
- Loaded-water tests keep one 28 m water visible and place others 64 m apart. Pause affects engine integration, preparation and actor contacts, while global shader clocks and explicit rain/disturb calls continue. The static ground patch stays 1,024 m wide; extra hidden waters can lie beyond it and keep their own local beds. This axis measures water scheduling/resources, not large-map terrain complexity. The initial cap of 512 was amended before further measurement: growth must fit a linear projection of the previous maximum renderer VmHWM while leaving 4 GiB of available RAM for the system/other processes. A resource stop is a measured lower bound, not an FPS ceiling.
- Visible-water tests fit the view to non-overlapping 28 m waters. Simulation can produce different reflection levels and separate mirror passes; actual levels/draw calls are in raw metadata. Pausing cannot skip these waters.
- Each effect group has three effects: campfire, looping fire explosion and ice. Groups repeat the same eight positions, increasing overdraw. Keep the default 6,000 live-letter and 8,000 draw-buffer budgets; a saturated buffer is a resource bound.
- Grid widths 65/129/257/513 are mesh/mask widths. The engine already caps the physics width at 129: solver widths are 65/129/129/129. Costs above 129 are not a 257/513 physics solver measurement.
- Lines connect measured loads without a monotonic fit or capacity interpolation. Full-frame queue/dispatch overhead can make smaller-load intervals non-monotonic. These axes are separate workloads, not additive promises for one combined scene. Values are specific to this i5-12450H / Chromium headless / ANGLE GL machine, not desktop Tauri, WebKitGTK, mobile or another GPU.
