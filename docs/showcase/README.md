# Feature videos

The README presents seven chapters. The first six were re-edited from the existing
**Margem Viva (Living Shore)** OBS recording. At the owner's request on
2026-10-12, no new recording was made. Chapter cards, headings and timed
explanations are English. The historical interface and scene names captured
inside the footage remain Portuguese; the current editor uses English.

On 2026-10-14, added a new recording of the current English Texture Studio.
It shows object/part selection, letters/fonts, layout, letters-only visibility,
palette colors, separate preview lights, application and saving to Assets.
The recording uses isolated GPU Chromium and actual browser frames, preserving
the owner's normal draft. Its 36-second MP4 is a release asset, so new full
video footage does not add to the Git repository. Its short GIF and poster
remain in the showcase. The AI/MCP section uses a fresh capture from the real
stdio MCP integration test, including reusable texture creation and export.

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

## GitHub previews and full video gallery

Eight short GIFs in gifs/ animate directly in the GitHub README: a Living
Shore opening and one excerpt per chapter. Each uses recorded footage,
4 seconds, 8 fps, 128 palette colors and an infinite loop. Hero width is
720 px; chapter width is 800 px. This compression is a preview; full MP4s
retain the original edit. Every GIF is below 5 MiB and has 32 distinct frames.

```bash
node scripts/prepare-showcase-gifs.mjs
node scripts/preview-readme.mjs --github-pages --generate-only
```

The public gallery is docs/index.html and docs/watch.html. GitHub Actions
builds and publishes the gallery and five map demos on main pushes using
.github/workflows/pages.yml. It updates the gh-pages hosting branch, which
Pages serves from its root. Each chapter GIF links to its gallery section.
Published gallery URL:
https://joaovrmoraes.github.io/ascii-engine/watch.html.
The generator derives chapter navigation and video sources from the README;
it supports local historical MP4s and external release assets.

The live demos are at https://joaovrmoraes.github.io/ascii-engine/sandbox/.
The menu is limited to Dark Forest, Rain Marsh, Snow Pines, Old Mine and
Sunken Cathedral. Direct area links open each map; unsupported authoring URLs
fall back to Dark Forest. Camera, letter/light, pause and capture controls remain.
Scene editing and MCP use the documented local setup. The public build does
not expose authoring tools or connect to visitors' local bridge services.

Build and preview the same publication artifact locally:

```bash
pnpm pages:build
python -m http.server 4179 --directory .cache/pages
```

Open http://localhost:4179/sandbox/?area=dark_forest. The ignored artifact
contains tracked documentation and fresh relative-path editor bundles;
browser profiles and caches are excluded. Application bundles stay outside main
and are generated only in the hosting branch. The publication script uses an
isolated Git index and regular pushes, preserving source checkout and history.

Validate the deployed browser workflow with:

```bash
pnpm verify:pages https://joaovrmoraes.github.io/ascii-engine/ /tmp/ascii-pages-public
```

## Reproduce the Texture Studio walkthrough

With `pnpm dev` running, record the actual editor, generate the 1920×1080
H.264 video, its GIF and poster, and validate full video/GIF decoding:

```bash
node scripts/record-texture-showcase.mjs
```

The MP4 is generated in `.cache/showcase/07-textures.mp4`, ignored by Git.
The published copy is an attachment to v0.1.0. Uploading a new recording is
a separate publication action; the script only creates and validates local
files. Evidence is in ../captures/texture-pages-2026-10-14/README.md.

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
the root README and provides seven native video players. To generate without
starting a server, use node scripts/preview-readme.mjs --generate-only.

Markdown uses animated GIFs and links to the public gallery. Full MP4
download links remain available. The local gallery has the same seven native
players, with GIF posters. The repository and gallery are public.
