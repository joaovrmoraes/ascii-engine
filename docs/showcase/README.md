# Feature videos

The README presents six separate chapters re-edited from the existing
**Margem Viva (Living Shore)** OBS recording. At the owner's request on
2026-10-12, no new recording was made. Chapter cards, headings and timed
explanations are English. The historical interface and scene names captured
inside the footage remain Portuguese; the current editor uses English.

Files in videos/ cover terrain, water/paths/wind, objects, effects/light,
atmosphere and camera/preview/export. Corresponding PNG posters are extracted
from the English edits. posters/living-shore.png crops the final composition
from the original chapter, without editor panels or editorial text.

The H.264 videos are 1920×1080, 30 fps, Rec.709, silent, with fast-start MP4
metadata. Durations, source-frame counts and chapter speeds are preserved.
Water, wind, fire and camera footage run at normal speed; other edits use
1.15×–1.30× as indicated in the footer. The compatible 4:2:0 compression can
reduce the definition and color of thin glyphs. Original 2560×1440 edits,
4:4:4 masters and native OBS footage remain outside Git and are unmodified.

## Reproduce the edit

Requires Node with native TypeScript support, FFmpeg, FFprobe and an installed
font. scripts/prepare-showcase.mjs uses iAWriterDuoS-Regular.ttf; adjust its
font constant to an available local font when running on another machine.

```bash
node scripts/prepare-showcase.mjs /path/to/edition
```

The source directory contains partes/01-Terreno.mp4 through
partes/06-Camera-e-exportacao.mp4 and capitulos-editados.json. These historical
source filenames remain unchanged. English text and timing come from
tools/video-edit/src/edit.ts. The script replaces the surrounding title bands
and chapter cards, verifies exact frame counts and fully decodes each output.
Validation is in ../captures/readme-2026-10-12/videos.json.

## Review locally

```bash
node scripts/preview-readme.mjs
```

Open http://localhost:4178/docs/showcase/index.html. The HTML is generated from
the root README and provides six native video players. To generate without
starting a server, use node scripts/preview-readme.mjs --generate-only.

Markdown thumbnails and their links point directly to each MP4. Opening the
HTML locally or serving it enables playback. The preview is local; no remote
repository or presentation has been published in this stage.
