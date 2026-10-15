# Uncapped submission diagnostic — excluded from final qualification

Source 99e1bf0. This partial round disables vsync and the frame-rate limit but
leaves the GPU queue unbounded. Callback intervals measure CPU submission, not
completed-frame throughput. For example, particles callbacks can be about
0.6 ms while a GPU range takes about 11 ms. The eight-query profiler budget
also drops queries once submissions run ahead. Collection was stopped; these
raw data are preserved for diagnosis and are not qualification evidence.

The corrected benchmark bounds in-flight GPU frames to two with asynchronous
WebGL fences. CPU frame N can overlap GPU frame N-1; no gl.finish or per-frame
synchronous GPU wait is introduced. See the main report for the final method.
