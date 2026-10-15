# Simulation performance study — Phase 1 methodology amendment

Status: Proposed, measurement only. No Phase 2 work or alternate implementation.

The original [display-paced report](vsync-report.md) and raw rounds remain
unchanged. A [partial uncapped submission diagnostic](submission-diagnostic/README.md)
showed that callbacks can outrun the GPU. The subsequent complete
[rAF-bounded experiment](raf-bounded-diagnostic/README.md) completed all frames,
but water submission p50 failed repeatability at 6.40%; the failure is preserved.

The final collection removes rAF scheduling from the uncapped benchmark only,
retaining fixed dt, original fixtures and at most two GPU frames in flight.
The generated per-scene report will replace this status page after collection.
See [method notes](uncapped-notes.md) and Proposed ADR 0004.
