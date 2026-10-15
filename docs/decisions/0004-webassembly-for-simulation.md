# ADR 0004 — WebAssembly for simulation

Status: **Proposed**

Date: 2026-10-15. The owner confirmed the following decision rule before any
benchmark measurements. This draft authorizes Phase 1 measurement only.

## Decision rule

A target qualifies for a prototype only if, in its fixed reference scene:

1. Its CPU time is at least **15% of the median frame time**.
2. It is CPU-bound numeric work over arrays, rather than waiting on GPU/DOM
   operations or updating Three.js objects.

Adoption requires all of the following against an optimized JavaScript baseline:

1. The isolated target step is at least **2× faster at p50**.
2. The full reference frame time improves by at least **15% at p50**, with
   **no regression at p95**.
3. Numeric parity holds from identical initial state and fixed steps, comparing
   every output array: maximum absolute difference **≤ 1e-5 per float32 value**.
   Visual parity is also required.
4. A JavaScript fallback remains, with the same API and the same tests.

GPU skinning may be the appropriate comparison for skinned glyphs. Qualifying
does not require choosing WASM when GPU execution is more suitable.

## Phase 1 method fixed before measurement

- Three URL-addressable, seeded fixtures: water, particles and skinning. No
  editor IndexedDB access; each run starts from a fresh page/scene.
- 1920×1080 CSS pixels, device pixel ratio 1, fixed camera and 1/60 s steps.
- At least 600 measured frames after warm-up, five independent runs per scene,
  repeated in two complete rounds. Record raw data and p50/p95/p99.
- Primary full-frame time is the observed animation-frame interval, including
  presentation pacing. Also record active CPU frame work separately; do not
  mistake CPU submission time for GPU completion or uncapped throughput.
- Qualification share is subsystem p50 CPU time divided by p50 full-frame
  interval. Report the active CPU-frame share as additional context.
- Separate water simulation step from texture preparation/upload submission,
  then skinned glyph updates, effects, carpet, body uniforms and remaining
  render submission. Upload timing is CPU time, not a claim of GPU transfer time.
- Optional GPU timer queries are asynchronous. Record unsupported, disjoint or
  missing results explicitly, without forcing GPU synchronization.
- Record CPU, GPU, OS, Chromium, launch flags, power mode, source revision,
  fixture parameters and timer resolution. Preserve default renderer behavior.
- Two rounds must have full-frame p50 values within 5%; investigate unstable
  results and report subsystem variation and timer precision as well.
  Relative round difference uses the absolute p50 difference divided by their
  arithmetic mean. Percentiles use nearest rank over equally sized runs.

Candidate classification is fixed before the main runs: water step and skinned
vertex math can qualify as numeric CPU work. The combined water upload also
updates Three.js geometry and submits buffer changes; its aggregate alone does
not prove a transferable numeric kernel. Effects manipulate JS object state;
carpet/body uniforms and render submission do not meet the numeric-array rule.

## Scope and stopping point

No implementation has been selected. Phase 1 does not optimize the JavaScript,
write WASM/GPU alternatives, install a toolchain or claim the adoption thresholds
have been met. Record the measurements and candidate qualifications, then stop
for owner review before Phase 2. The confirmed original study plan is preserved
byte for byte in `docs/wasm-performance-study-plan.md`.
