# Remotion recording edit

Independent project using Remotion **4.0.534** and React. OBS footage is
its media source; maps were created through visible editor controls.

## Historical take: Margem Viva (Living Shore)

Default output: `/home/jonny/Videos/ASCII-Engine-Closeup-2026-10-11/edicao/`.

- index.html: local full-film and six-part player.
- ASCII-Engine-editado-master-444.mp4: master preserving glyph color better.
- ASCII-Engine-editado.mp4: compatible H.264 4:2:0.
- partes/: terrain, water/wind, objects, effect/light, atmosphere, camera/export.
- masters/: intermediates; previas/: Remotion graphics/captures.

**7:18.3**, 2560×1440, 30 fps, no audio. Native 2560×1080 capture is not
scaled, with titles above/below. Terrain/objects/atmosphere run at
1.15×–1.30×; water/grass/fire/camera stay at normal speed. Final camera
height is 6.5 m rather than the previous 15 m.

Source uses **I444 from OBS**, limited-range Rec.709, x264 CRF 16.
No saturation boost (SATURATION = 1). 4:2:0 may reduce thin-glyph color;
assess color using a player supporting the H.264 4:4:4 master. Compression
and RGB/YUV conversion still have losses; this is not lossless footage.

The earlier Lago das Brasas (Ember Lake) take remains at
`/home/jonny/Videos/ASCII-Engine-2026-10-11/`, with timeline in
src/editions/lago-das-brasas.ts. It was NV12/4:2:0 with a 1.4× editorial
saturation correction; do not apply that correction to the newer source.
`npm run diagnose-color` retains the earlier NV12 experiment; the newer
source test is cor-teste-444.json in its take folder.

Historical video files show Portuguese UI. They are retained as source
material. At the owner's request, the README reuses these recordings with
English cards and captions; it does not claim the captured interface is English.
The current editor interface is English. See ../../docs/showcase/README.md.

## Reproduce

Requires Node with native TypeScript execution (22.18+), npm, Chromium,
FFmpeg and FFprobe. Dependencies are local, outside the pnpm workspace.

```bash
cd tools/video-edit
npm ci
npm run prepare-media
npm run check
npm run graphics
npm run compose
npm run finalize
```

src/edit.ts contains cuts, speeds, notes, scene title, source folder and
poster crop. ASCII_VIDEO_SOURCE overrides input; ASCII_VIDEO_OUTPUT
overrides output; REMOTION_BROWSER selects Chromium. Input must contain
ASCII-Engine-criacao-completa.mp4 at 2560×1080/30 fps. prepare-media copies
it to public/ and extracts the poster.

To reproduce an older edit, preserve the current timeline and copy the
corresponding file from src/editions/ to src/edit.ts. Both editions include
media/color metadata. finalize.mjs gallery description targets the newer
take; adjust it when exporting the older edit.

```bash
npm run studio
```

Studio: http://localhost:3456, without opening a window automatically.
Completo is the full composition; six individual compositions are also
available. Video.tsx calculates graphics/animation per frame.

Remotion creates chapter cards, intro/outro and transparent bands. FFmpeg
composes them over native footage and concatenates segments. Footer notes
switch directly in this workflow; Studio also animates their entrance.
Intro/chapter-card animation is retained by both export approaches.

npm run render performs the entire browser render with higher RAM/time
cost; supports -- --only=Abertura. npm run stills generates five images.
Temporary files/cache stay in .cache/; videos/cache do not enter Git.
finalize checks frame counts and full decoding of seven compatible MP4s
and the full master. Silent OBS audio is removed.
