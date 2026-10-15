# Fresh-process water diagnostic with default browser extensions

Measured clean source 7d4868a, explicit active renderer P-core CPU 6, fresh
Chromium process/profile per execution, unchanged GPU flags, queue, seed,
dt and 600 warm-up/600 measured frames. Two complete rounds retain all
48,000 measured frames. All state/GPU fences/timers pass, but five full-frame
repeatability gates fail. These runs are not accepted final evidence.

| Waters | Policy | Round 1 frame p50 ms | Round 2 frame p50 ms | Difference | Gate |
| ---: | --- | ---: | ---: | ---: | --- |
| 1 | off | 8.445 | 7.600 | 10.53% | FAIL |
| 1 | pause | 8.720 | 7.955 | 9.18% | FAIL |
| 2 | off | 10.660 | 10.395 | 2.52% | PASS |
| 2 | pause | 8.505 | 7.870 | 7.76% | FAIL |
| 4 | off | 19.565 | 19.475 | 0.46% | PASS |
| 4 | pause | 8.860 | 8.015 | 10.01% | FAIL |
| 8 | off | 37.125 | 37.270 | 0.39% | PASS |
| 8 | pause | 8.320 | 7.845 | 5.88% | FAIL |

The owner confirmed no heavy video/game/GPU use. An inspection of this owned
isolated browser found system-loaded extension service workers/background
pages despite its new temporary profile. [Observed targets](observed-targets.json)
contain only the benchmark and browser/extension URLs. Its effective process
arguments included a system --load-extension list. No personal browser or
system configuration was changed or captured.

A [diagnostic extension-disable smoke](extension-disabled-smoke.json) with
the same kernel successfully removed every extension target before and after
600 warm-up/600 measured frames, with the same visible state. One sample is
not proof that extensions alone caused the variation. Shared CPU/iGPU and
scheduler/thermal effects remain possible contributors.

Before any new accepted samples, the next protocol adds explicit --no-extensions,
checks target absence before/after each execution, and collects two rounds
per map-size pair rather than interleaving all eight workloads. Round 1 orders
off then pause; round 2 reverses them. This controls order/global-load drift
without changing counts, dt, seeds, GPU flags or the <=5% gate. All four pairs
are remeasured; no old/new runs are spliced into one result. Failed new pairs
remain failed evidence rather than selected favorable runs.
