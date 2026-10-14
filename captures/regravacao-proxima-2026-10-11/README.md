# Margem Viva (Living Shore) — historical close-up recording

Requested to show grass, water and effects from a closer camera. Capture began
2026-10-11; editing finished 2026-10-12. This recording predates the English UI.

Native OBS 32.2.2, PipeWire editor-window portal, 2560×1080/30 fps, I444,
limited-range Rec.709, x264 CRF 16. Editor fullscreen on workspace 5, OBS on 6,
Orca preserved on 3. No personal OBS/Hyprland configuration was changed.
OBS and demonstration browser closed normally afterward. The owner's Orca
map was never replaced.

Creation used visible controls: map, terrain/water/ground brushes, library,
layered/lit effect studio, atmosphere studio, Assets, camera thumbnail,
save/export and Preview. Engine API calls only read state/projected positions;
they did not assemble or edit the scene. Real mouse input used Hyprland/
ydotool; text, wheel and keys used external Chromium CDP. Orca Computer Use
remained unavailable because of Python/AT-SPI dependencies.

## Framing and motion

- Working zoom 1.0–1.9, with panning toward the edited area.
- Low grass close-up and 9-second holds for wind, fire and water.
- Final frame height **6.5 m**, previously 15 m; final Preview held for 14 s.
  No engine visual code changes.
- Images were extracted from OBS MP4: [grass](grama.png), [fire](fogo.png),
  [water](agua.png), [preview](previa.png).
- movimento.json: four 3-second canvas crops, 90 unique frame hashes each,
  no identical adjacent frames. This checks freezing in those samples,
  rather than every frame of the whole film.
- obs-final.jsonl: 30 fps, zero render/output dropped frames.
- marcas.jsonl: action timestamps, excluding OBS pauses.
- validacao-mapa.json: parseScene accepted 10 objects, one water body,
  one saved effect, one atmosphere and one initial camera.

## Color

cor-teste-444.json compares a screenshot and OBS test frame of the same view
at different animation times. Mean HSV saturation of bright pixels: .389 on
screen, .330 in capture. UI gray matched RGB 48/50/56. 4:4:4 better preserves
thin-glyph color, but compression and RGB/YUV conversion still introduce loss.
This edit uses saturation 1.0; the older 1.4× correction is not applied.
Compatible 4:2:0 outputs can still lose color on fine strokes.

## Delivery and limits

Large files outside Git: /home/jonny/Videos/ASCII-Engine-Closeup-2026-10-11/.
OBS MKV master, silent remux MP4, Margem-Viva.ascii.json,
Margem-Viva.pomorog.json and edicao/ with full film, 4:4:4 master, six compatible
chapters and index.html. Previous footage is preserved.

13149 edited frames, **7:18.3**, 2560×1440/30 fps. Water, wind, fire and camera
run at normal speed; other sections use 1.15×–1.30×, indicated in the footer.
The native capture is unscaled; title bands are outside the UI. No narration,
audio, external-model import or Pomorog export-import test in this session.

pnpm check passed: 79 tests, types and build. Remotion types passed. Known
Vite chunk-size and Zod annotation warnings remained. Evidence comes from
external Chromium recorded by OBS, not the embedded Orca editor.

[validacao-edicao.json](validacao-edicao.json): exact frame counts and full
FFmpeg decoding with fatal errors enabled for the full compatible film and
six chapters. [validacao-master.txt](validacao-master.txt): full 4:4:4 master
decoded without errors. The local gallery links seven compatible MP4s,
master and editable map.

Edited frames: [opening](abertura-editada.png),
[grass at normal speed](grama-editada.png), [shore fire](efeito-editado.png).
