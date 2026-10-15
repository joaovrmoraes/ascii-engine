# Water scale without CPU affinity — retained failed repeatability diagnostic

Source 0a4e072, accepted Phase 1 uncapped task/fence protocol, fixed seeded dt
1/60, 5 fresh loads × 600 warm-up + 600 measured frames in each of two rounds.
All 48,000 measured frames completed GPU timers/fences and state parity. The
frame p50 gate failed in two cases; these data are preserved, not accepted as
final stable optimization evidence. No thresholds or run counts were changed.

| Waters | Policy | Round 1 frame p50 ms | Round 2 frame p50 ms | Difference | Gate |
| ---: | --- | ---: | ---: | ---: | --- |
| 1 | off | 7.630 | 8.115 | 6.16% | FAIL |
| 1 | pause | 7.775 | 8.045 | 3.41% | PASS |
| 2 | off | 10.370 | 10.440 | 0.67% | PASS |
| 2 | pause | 7.950 | 7.930 | 0.25% | PASS |
| 4 | off | 19.655 | 19.840 | 0.94% | PASS |
| 4 | pause | 8.410 | 8.630 | 2.58% | PASS |
| 8 | off | 38.100 | 38.065 | 0.09% | PASS |
| 8 | pause | 7.880 | 8.350 | 5.79% | FAIL |

For one water/off, active CPU p50 differed 1.50% and GPU-range p50 0.14%, but
frame/completion p50 differed 6.16%. Mean frame also moved 7.823→8.482 ms, so
this was not merely a relabeled percentile. Per-run step p50 ranged 0.740–1.490
ms and the passive host trace confirms main-thread migrations across both P
(0–7) and E (8–11) CPUs. This is an observed source of heterogeneous execution
cost; frequency/load/GPU-tail and asynchronous scheduling effects can also
contribute. Do not claim an exclusive cause from coarse host samples.

The follow-up controls renderer main-thread residency on P-core CPU 6 using
taskset, leaving GPU/browser/other renderer threads and machine power settings
unchanged. This adds an explicit environment control, not a change in dt,
workload, GPU flags, warm-up, runs or acceptance threshold. Test it before
collecting fresh complete off/on rounds; retain unpinned results for provenance.
[Raw round 1 environment](round-1/environment.json), [round 2](round-2/environment.json),
[gate values](repeatability.json), [passive partial host trace](../host-samples.jsonl).
The trace began during round 1 and records processor/frequency/temperature,
not a complete machine activity or GPU clock history.
