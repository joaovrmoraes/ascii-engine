# OBS composition session — 2026-10-11

Real native OBS capture of the editor window via Hyprland's PipeWire portal.
Fullscreen editor on workspace 5, OBS on 6. Visible-cursor clicks/drags and
adjustments through the interface; profile separate from the owner's Orca
map. No engine code changes in this stage.

## Delivered files

- [MP4](/home/jonny/Videos/ASCII-Engine-2026-10-11/ASCII-Engine-criacao-completa.mp4):
  310.6 s, 2560×1080/30 fps, H.264, no audio.
- [Editable map](/home/jonny/Videos/ASCII-Engine-2026-10-11/Lago-das-Brasas.ascii.json).
- [Pomorog export](/home/jonny/Videos/ASCII-Engine-2026-10-11/Lago-das-Brasas.pomorog.json).

2026-10-11 22-23-26.mkv master is in the same folder. Videos remain outside
Git; failed capture attempts are separated in bastidores/. This historical
recording shows Portuguese UI and retains its original asset names.

## Chapters

| Start | Content |
| --- | --- |
| 00:00 | New map, terrain raise/smooth |
| 00:43 | Water brush/path |
| 01:19 | Trees, rocks, ruin/log |
| 02:16 | Effect Studio: flame, layers, light, save to Assets |
| 03:11 | Atmosphere Studio: color, lighting, fog, save to Assets |
| 04:04 | Water, camera thumbnail, save/export/Preview |

## Evidence from the video

Frames extracted by FFmpeg from final MP4, not replaced with screenshots:

- [Terrain](terreno.png), second 35.
- [Effect Studio/light](efeito.png), second 163.
- [Atmosphere Studio](atmosfera.png), second 222.
- [Camera](camera.png), second 285.
- [Final preview](previa-final.png), second 306.

## Validation

- [Video metadata](validacao-video.json) /
  [full decode](validacao-video.txt): no errors.
- [Engine parser reading](validacao-mapa.json): 32 m terrain, ten objects,
  one water/effect/atmosphere and valid initial camera. Map/export were
  downloaded through interface buttons.
- [pnpm check](pnpm-check.log): 79 tests, types/build passed;
  existing large-chunk/Zod annotation warnings remain.

The session covers the requested composition, without narration. It does
not verify Pomorog consumption or demonstrate every advanced tool. OBS
closed normally at completion and focus returned to Orca.
