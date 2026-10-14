# Recording edit in six chapters

Owner request: edit the real OBS session with Remotion and investigate
washed-out color. Source is the previous stage's actual recording.

## Delivery

Folder: /home/jonny/Videos/ASCII-Engine-2026-10-11/edicao/.

- index.html: choose full film or one of six chapters.
- ASCII-Engine-editado.mp4: compatible full film.
- ASCII-Engine-editado-master-444.mp4: master without further chroma subsampling.
- partes/: six standalone MP4 files.
- Reproducible project: [tools/video-edit](../../../tools/video-edit/README.md).

2560×1440/30 fps edit retains native 2560×1080 footage, with headings/notes
above/below controls. Intro, six chapter cards, action-following footers,
outro. 1.15×–1.40× speed indicated in the footer; no audio. Remotion creates
graphics/animation/bands; FFmpeg composes them to reduce RAM/export time.
No scene changed for editing. Historical footage/UI/captions are Portuguese.

## Color

[Controlled experiment](analise-cor.json): the same PNG encoded with H.264
CRF 0 lost saturation in 4:2:0; 4:4:4 preserved its distribution. Sampled
mean HSV saturation: 0.417 → 0.274 in 4:2:0, versus 0.417 in 4:4:4.
Recorded interface grays nearly match: RGB [48,49,56] versus [48,50,56].
Limited range/Rec.709 were correct.

RGB saturation compensation 1.4× without changing brightness/gamma;
explicit BT.709 conversions. YUV eq slightly shifted hue during validation
and was replaced with an RGB matrix. Correction cannot recover discarded
color. The 4:4:4 master preserves glyphs better; 4:2:0 retains thin-stroke loss.

## Evidence

- [Intro](abertura.png): Remotion animated intro frame.
- [Effect](efeito.png), [camera](camera.png): exported video frames.
- [Before/after color](comparacao-cor.png): lake crop from source/edited master.
- [Engine checks](pnpm-check.log): 79 tests, types and build passed.
- [MP4 validation](validacao-edicao.json): frame count and full decode.
- [4:4:4 master](validacao-master.txt): full decode without errors.
- [Chapters/durations](capitulos-editados.json): 8236 frames, 274.53 s total.

Visual validation used Remotion compositions and MP4-extracted frames.
No new editor Orca/cdpshot capture was needed because the engine did not
change. Headless render browser; no Hyprland layout or personal OBS changes.
