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

Public verification after publication:

- [github-images.json](github-images.json): all seven GIFs loaded in the real
  GitHub README. [github-readme.png](github-readme.png): its actual rendering.
- [rendered-motion.json](rendered-motion.json): both local and GitHub screenshot
  pairs changed after 500 ms, confirming visible animation.
- [public-playback.json](public-playback.json): all six chapters advanced
  without errors at 1920×1080 from the public Pages URL, checked in isolated
  GPU Chromium with software video decoding. Initial hardware decode failed
  in that headless environment; software playback passed all chapters.
- [gallery-public.png](gallery-public.png): public page screenshot.
- Pages build succeeded. HTML responds 200; MP4 responds video/mp4 and byte
  range GET responds 206, allowing streaming/seeking.

Orca verified image loading on GitHub and local player playback. Its public
player check lost the runtime connection; public playback was verified in
Chromium instead. No system browser settings were changed.
