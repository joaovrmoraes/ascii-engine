# Optimized JavaScript capacity — protocol

Status: preregistered before capacity measurements. No WASM/GPU skinning.

Use the accepted Phase 2 uncapped protocol: i5-12450H, Chromium headless,
ANGLE GL, 1920×1080/DPR 1, seed 4242, fixed dt 1/60 s, two asynchronous GPU
frames, fresh Chromium process/profile for every execution, extensions disabled,
active page main thread on P-core CPU 6, other thread masks/power unchanged.
Each point has two rounds × five loads × 600 warm-up/600 measured frames.
Full-frame p50 must repeat within 5%; failures are preserved and investigated.

Capacity uses **the worse of the two round frame p95 values** against 16.7 ms
and 33.3 ms, keeping pooled p50/p95 and CPU/GPU ranges separately. A maximum
means the highest measured passing load; no untested integer/interpolation is
claimed. Record the next failing load. A range/resource bound is marked as a
lower bound rather than an FPS ceiling. CPU/GPU labels retain the 20% descriptive
band and mixed/unknown cases. CPU and GPU overlap; do not add them.

Axes:

- Skinned creatures: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 until both budgets
  are crossed. Same seven-bone model, alphabet, density and animation. Fit the
  orthographic camera at loads above 16 to keep every creature onscreen; record
  its span/retreat and the actual letter count. This is a fitted-view workload,
  not constant projected size or an arbitrary game's creature limit.
- Loaded waters: same Phase 2 28 m/129×129 waters, 64 m apart, one visible.
  Measure pause off/on separately. Reuse Phase 2 points 1/2/4/8, which have the
  same core, fixture, clock, viewport and process/affinity/extension controls.
  Extend pause-on through 16/32/64/128/256/512. Stop and report a resource/range
  bound if initialization/memory becomes limiting before the frame budgets.
- Visible waters: 1/2/4/8/16/32 non-overlapping 28 m waters, 32 m apart, one
  nominal water level. Simulated pool levels can require separate mirrors;
  record actual reflection levels and draw calls. Fit span/retreat to show all waters. No offscreen
  pausing; all simulations run. Reuse the identical one-water Phase 2 point.
- Effects: 1/2/4/8/16/24/32/64/128/256 simultaneous groups, each a campfire,
  looping fire explosion and ice effect. Repeat the original eight positions
  to retain fixed view and increase overdraw. Record actual drawn glyphs and
  effect statistics; the default 6,000-live-letter/8,000-buffer limits remain.
  Buffer saturation is a resource bound, not evidence for unlimited particles.
- Grid: 65/129/257, extending to 513 if needed to cross 33.3 ms, one visible
  28 m water. The **existing engine caps physics at 129**; these are mask/mesh
  grids, with simulation widths 65/129/129/129. Report both, without claiming
  a 257×257 solver. Sample the same physical bed at every mesh resolution.
  The unchanged 129 point is reusable from Phase 2.

`pnpm bench:capacity` collects/resumes the matrix. It writes a protocol/manifest
before samples, preserves raw samples and environments for every fresh point,
and stops on a repeatability failure. `--axes=<comma-separated axes>` selects a
subset. No IndexedDB access or editor draft. All source is committed before
accepted samples. Phase 1/2 reports remain historical evidence.

## Observer and memory amendment before extending the water range

Three complete failed points remain as diagnostics: eight visible waters
(10.11%), 256 creatures (5.83%), and 128 loaded/paused waters (5.04%). No runs
were removed from a round and the 5% gate was not relaxed. CPU6/7 traces identify
SMT sibling pressure and main-thread scheduling delay during observed Orca
helper work. One slow crowd execution had CPU7 52.95% busy and 3.68% main-thread
run delay, versus 5.82% / 0.34% in a fast execution with CPU6 near 4.1 GHz.
The 128-water failure also has gradual CPU/dispatch drift (CPU 4.30%, GPU 1.30%).
These observations identify interference; they do not isolate every helper or
prove one process accounts for all variation.

The collector now writes each execution into Git-ignored staging, starts child
runners with `process.execPath`, and publishes only after selected axes finish.
Monitoring uses non-login shells and the same direct Node 26.10.0. No power,
GPU, affinity, dt, seed, warm-up, sample count or acceptance threshold changes.
Both failed rounds are retained, and whole points are repeated. Historical
reuse is now explicit (`--reuse-phase2=<directory>`), requiring an operator's
prior audit of identical core, fixture, hardware and controls. A fresh output
otherwise collects every point anew.

The initial 512-water guard is extended only after recording renderer VmHWM.
For each larger count, project the previous point's maximum observed peak RSS
linearly by count; require that projection to leave **4 GiB of currently
available system RAM** for other processes. If it does not fit, report a
resource bound and the untested next load. Counts can grow to 1,024/2,048/4,096/
8,192 only within that reserve. This changes a safety range, not an FPS gate.
Only new extended executions have per-run memory observations; earlier timing
points keep their original data. Core simulation and rendering are unchanged.
