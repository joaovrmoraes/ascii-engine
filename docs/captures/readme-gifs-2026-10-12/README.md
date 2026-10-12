# Animated README and public video gallery — 2026-10-12

Existing feature MP4s were sampled into seven looping GIFs. No re-recording,
engine or shader changes. The GitHub README shows a moving scene at the top
and six animated feature previews, with links to a full-player gallery.

[gifs.json](gifs.json) records crop/time ranges, dimensions, file sizes,
32 frames at 8 fps over 4 seconds, 32 unique decoded-frame hashes per GIF
and successful full FFmpeg decoding. All files are below 5 MiB.
[hero-frame.png](hero-frame.png) and [effect-frame.png](effect-frame.png)
were extracted from generated GIFs for visual inspection.

scripts/preview-readme.mjs --github-pages --generate-only writes docs/watch.html.
GitHub Pages publishes main:/docs; .nojekyll preserves native static media.
The local preview retains six players and uses image/gif for GIF assets.

Public gallery: https://joaovrmoraes.github.io/ascii-engine/watch.html.

[local-playback.json](local-playback.json): all six full chapters loaded
and advanced at 1920×1080 in the real Orca Browser, without video errors.
[gallery-local.png](gallery-local.png): actual GPU Chromium/cdpshot capture.
Orca's viewport screenshot timed out; its player checks used page evaluation.
GitHub's Markdown rendering API returned seven GIF image tags.
