# Stopped affinity-control attempt

Source 7442979. This partial attempt pinned non-extension renderers including
spares. A promoted spare could create compositor/worker threads inheriting the
P-core mask. The probe was stopped during round 1/run 2 rather than accepting
confounded timings. Completed samples/environment remain unchanged here.

This is not final performance evidence. The corrected runner identifies the
active page with a 150 ms CPU probe before warm-up, pins only its main TID,
excludes spares and verifies other existing masks remain unchanged. Probe time
is outside every warm-up and measured frame; dt/state never advance during it.
