# README and presentation evidence — 2026-10-12

Root README is English, with a final composition image and six separate
feature videos. At the owner's explicit request, existing footage was
re-edited; no new recording was made. Cards, headings and synchronized notes
are English. The captured historical interface remains Portuguese.

[videos.json](videos.json): six H.264 1920×1080/30 fps videos, Rec.709, silent,
fast-start metadata, exact original chapter frame counts and full FFmpeg
error-enabled decoding. Approximately 139.2 MiB total; each file below 36 MiB.
Original source footage and 4:4:4 masters outside Git remain unchanged.

[english-card.png](english-card.png): replacement chapter card extracted from
output. [readme-00.png](readme-00.png): GPU Chromium capture through cdpshot.mjs.
[readme-orca.png](readme-orca.png): actual Orca Browser gallery capture.
[playback-orca.json](playback-orca.json): all six files loaded, decoded at
1920×1080, sought to 20 seconds and advanced during playback, without video
errors. Gallery image and all six navigation anchors were checked in Orca.

Preview server: http://localhost:4178/docs/showcase/index.html.
HTML derives from root README; native players pause each other, and HTTP byte
ranges allow seeking. No remote publication. README/reproduction notes in
../../showcase/README.md explain the historical footage language.
