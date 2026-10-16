# Visible-water CPU investigation

Status: profiling and baseline collection. This protocol is recorded before the
optimization and new accepted samples. Original capacity data remain in
[the previous study](../../benchmarks-2026-10-15/capacity/results.md).

Keep the accepted protocol unchanged: seeded 129×129 waters at 28 m/32 m spacing,
fitted camera, all waters visible and updated, dt 1/60 s, 1920×1080/DPR 1,
uncapped MessageChannel scheduling with two GPU frames in flight, active main
thread on CPU 6, fresh Chromium/profile per execution, no extensions, two rounds
of five runs with 600 warm-up/600 measured frames. Frame-p50 round difference
must stay within 5%; capacity uses the worse round p95 and 16.7/33.3 ms budgets.
Do not relax parity (≤1e-5 per value and identical images) or budgets. Preserve
complete repeatability failures and investigate them before repeating.

Before and after collection uses the same reflection CPU instrumentation:
`waterStep`, `waterUpload` (texture preparation, surface deformation, normals and
bounds), `waterReflection` (uniforms, culling, mirror selection and reflection
render submission), and remainder (`active CPU - these disjoint sections`).
Actual transfers occur during renderer submission/GPU work, not during texture
array preparation. GPU ranges overlap CPU and can contain CPU feeding gaps;
do not add them. Medians of sections need not sum to the CPU median.

`profile-visible-water.mjs` captures CPU/heap sampling as diagnostics, not
benchmark percentiles. The initial four-water profile shows repeated generic
attribute/vector work in normal reconstruction; optimize the largest measured
preparation component before considering a language change. Physics, reflection
levels/passes, mesh density, shader inputs, camera and update counts must stay
unchanged. New numeric bottleneck qualification is reported under ADR 0004;
no WASM prototype or toolchain is authorized.

Benchmark pages never load the editor IndexedDB draft. The preserved original
core is served from a Git-ignored copy on port 1445 for parity only; accepted
measurements run source committed before samples on port 1440. No baselines
are regenerated and no push occurs.
