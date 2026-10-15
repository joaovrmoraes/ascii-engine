# WebAssembly performance study plan

Date: 2026-10-15. Audience: the agent implementing the study.

Read `AGENTS.md` and `START.md` first. Their rules apply: the core stays
independent, visuals must not change, existing `SceneDoc` files keep loading,
and the owner is notified before anything they have seen is removed.

## Question

Does any CPU work done every frame take enough of the frame to justify moving
it to WebAssembly (or to the GPU)? The answer is a measured decision recorded
as **ADR 0004**, whether the result is "adopt" or "do not adopt".

There is no WASM in the project today and no ADR about it
(`docs/decisions/` has 0001–0003).

The study is the point. A WASM module is written only for a target that passes
the decision rule below, and only after the owner reviews the Phase 1 numbers.

## Decision rule (write it before measuring)

Record these thresholds in the ADR 0004 draft **before** collecting numbers.
Defaults below; the owner may change them before Phase 1 starts.

A target qualifies for a WASM prototype only if, on its reference scene:

1. its CPU time is at least **15% of the median frame time**, and
2. it is CPU-bound numeric work over arrays (not waiting on the GPU, the DOM,
   or Three.js object updates).

A WASM implementation is adopted only if, against the optimized JS baseline:

1. the target step is at least **2× faster** at p50 (micro benchmark), and
2. the reference scene's frame time improves by at least **15%** at p50 and
   does not get worse at p95 (macro benchmark), and
3. numeric parity holds (see Parity), and
4. a JS fallback remains and passes the same tests.

If a target qualifies but the GPU is the better tool (see skinning), the ADR
says so instead of forcing WASM.

## Candidates found in the code

Per-frame CPU work inside `render(dt)` in `packages/engine/src/engine.ts`
(around lines 540–610):

| Candidate | Where | Notes |
| --- | --- | --- |
| Shallow-water step | `world/waterDynamics.ts` `step()` (from line 29), called by `water.updateDynamics` in `techniques/water.ts:445` | Several `n × n` loops over `Float32Array`s, up to 129×129 per water. The classic WASM candidate. |
| Water texture upload | `upload(time)` in `techniques/water.ts` (around lines 410–420), called right after `step()` | Per-cell loop building the dynamics texture. Measure separately from `step()`. |
| Skinned body letters | `updateSkinnedBody` in `techniques/body.ts:293`, called per skinned cloud each frame | Recomputes letter positions on the CPU from skinned vertices. The natural alternative is GPU skinning in the vertex shader, so compare JS vs GPU, not only JS vs WASM. |
| Effect system | `effects.update(...)` in `fx/effects.ts` | Mostly JS objects (curves, gradients, `THREE.Vector3`). Likely a poor WASM fit because of boundary cost; measure before deciding. |
| Carpet update | `carpet.update(...)` in `techniques/carpet.ts:168` | Measure; probably uniform updates only. |
| Glyph body uniforms | `updateGlyphBodies` in `techniques/body.ts:308` | Measure; probably small. |

Other facts that matter for measurement:

- `render(dt)` clamps `dt` to `0..0.08` and uses real frame time. Water keeps
  simulation state, so runs are not repeatable today.
- The core has almost no unseeded `Math.random`; scene generation is seeded.
- There is no timing instrumentation in the core today.
- `.claude/skills/pomorog-ascii-visual/scripts/cdpshot.mjs` launches Chromium
  with GPU and `--use-angle=gl`. Reuse its launch flags for benchmarks.
- `scripts/compare.mjs` already loads areas by URL, for example
  `/?area=rain_marsh&pause=6`, `/?area=dark_forest&pause=5&peaceful=1`.
- Toolchain on the owner's machine: `rustc` and `cargo` come from the system
  package manager (no `rustup`); `wasm-pack` is not installed; the
  `wasm32-unknown-unknown` target must be checked.

## Phase 1: measure (no WASM)

### 1.1 Fixed benchmark scenes

Create three reproducible scenes, each with fixed camera, viewport size
(1920×1080 CSS px at device pixel ratio 1), duration and seed:

- **water**: Rain Marsh with rain, or a large painted lake with simulation on;
  include at least one 129×129 simulated water;
- **particles**: campfire plus combat effects running continuously;
- **skinning**: several animated skinned creatures on screen.

Expose them through a URL the benchmark runner can open, for example
`/?bench=water`. Benchmark scenes must not read or write the editor's
IndexedDB draft.

### 1.2 Benchmark mode with fixed time step

Add an opt-in benchmark mode that advances time by exactly 1/60 s per frame
instead of real time, and starts every run from a freshly loaded scene. This
is a small subset of the v0.2 deterministic clock; keep the API easy to
replace with that clock later. Default behavior must not change.

### 1.3 Instrumentation

Add optional, near-zero-cost timing to the core (disabled by default):

- CPU time per subsystem inside `render(dt)`: water `step`, water `upload`,
  skinned body update, effects update, carpet update, glyph body uniforms,
  and the remaining render submission;
- frame time and draw calls (`renderer.info`);
- GPU time with `EXT_disjoint_timer_query_webgl2` when the browser exposes it;
  record when it is unavailable instead of failing.

Expose the data through an engine API (for example `engine.stats`) that does
not import editor code. Keep `pnpm check` and the package boundary check
passing.

### 1.4 Runner

A script (for example `scripts/bench.mjs`, wired as `pnpm bench`) that:

- launches Chromium with the `cdpshot.mjs` flags against `pnpm dev`;
- for each scene, discards warm-up frames, then records at least 600 frames,
  repeated at least 5 times;
- writes raw samples plus p50/p95/p99 per subsystem and per frame to
  `docs/captures/benchmarks-<date>/<scene>.json`;
- records the environment: CPU, GPU, OS, Chromium version, flags, power mode,
  commit hash.

### 1.5 Report and stop

Write `docs/captures/benchmarks-<date>/README.md` with a table per scene:
subsystem, p50/p95 CPU ms, share of the median frame, and whether it passes
the qualification rule. **Stop here and report to the owner** before
Phase 2.

## Phase 2: fair JS baseline

For each qualifying target only:

- remove per-frame allocations in hot loops, hoist invariants, keep typed
  arrays, avoid megamorphic calls;
- prove visual and numeric behavior is unchanged (parity test and
  `pnpm compare`);
- re-run Phase 1 and record the optimized JS numbers. This is the baseline
  every later comparison uses.

If the optimized JS already removes the bottleneck, record that in the ADR
and stop for that target.

## Phase 3: WASM prototype (only for qualifying targets, after owner approval)

- Language: Rust, compiled to `wasm32-unknown-unknown` with `wasm-bindgen`.
  Use WASM SIMD where it helps and measure with and without it.
- Simulation state lives in WASM linear memory. JS reads and writes through
  typed-array views; no per-frame copies across the boundary. Include any
  remaining boundary cost in the measurements.
- Consider running the step in a Web Worker only if measurements show it
  helps; record the result either way.
- The core must keep working without WASM: a JS fallback with the same API,
  chosen at runtime, and the same tests on both paths. WASM loading must not
  break the browser editor, the exported web player, or Tauri.
- Update `scripts/check-package-boundaries.mjs` only as needed to allow the
  WASM module inside the core package; generic entries still must not reach
  presets or application code.
- Document how to build the module (toolchain install steps included) in the
  ADR and `START.md` §6.

For skinning, prototype GPU skinning (vertex shader) as the comparison instead
of, or in addition to, WASM.

## Parity

- A test runs the JS and WASM (or GPU) paths from the same initial state for a
  fixed number of fixed steps and compares every output array.
- Tolerance: max absolute difference ≤ `1e-5` per value for `float32`
  simulation data, unless the ADR justifies a different bound.
- Visual check: `pnpm compare` and a frame comparison of the benchmark scenes
  in benchmark mode.

## Phase 4: ADR 0004

`docs/decisions/0004-webassembly-for-simulation.md`, status Accepted or
Rejected per target, containing: the question, the decision rule as written
before measuring, environment, scenes, method, micro and macro results
(p50/p95, JS baseline vs WASM/GPU), boundary cost, parity results, the
decision per target, and the maintenance cost of keeping two paths.

Report both levels honestly, for example "water step X% faster; Rain Marsh
frame Y% faster". Expect Y to be smaller than X.

## Validation for every phase

- `pnpm check`.
- `pnpm compare` shows no visual change from instrumentation or benchmark mode.
- Benchmarks run twice give p50 values within 5% of each other; if not, fix
  the noise source before drawing conclusions.
- Use the Orca Browser at `http://localhost:1440` for visual checks, always
  with `--page <browserPageId>` of the editor tab. Do not modify the owner's
  saved editor draft.
- Update `docs/log.md` at the end of each phase. Small local commits are fine;
  do not push.

## Out of scope

- The full v0.2 deterministic clock, keyframes and offline rendering.
- Moving the effect system to WASM unless Phase 1 qualifies it.
- Changing default visuals or approved numerical values.

## Stop points for the owner

1. Before Phase 1: confirm the decision rule thresholds.
2. After Phase 1: review the measurement report.
3. Before Phase 3: approve which targets get a prototype and the toolchain.
4. After Phase 4: review the ADR.
