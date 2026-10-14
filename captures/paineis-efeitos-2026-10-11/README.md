# Camera, panels and effects — 2026-10-11

- `aba-efeitos.png`: `cdpshot.mjs`, GPU Chromium, effect form open and
  bottom panel enlarged using the resize gesture.
- `painel-flutuante.png`: interaction check, detached/resized hierarchy,
  custom effect already saved and placed.
- `orca.png`: full Orca Browser capture, Effects tab over the owner's
  draft; no map changes saved. Before the final effect-toolbar field layout.

`pnpm check`: 44 tests, types and build passed; Vite >500 kB warning remains.
`pnpm verify:authoring /tmp/ascii-workspace-final` passed existing and new
flows: three camera angles/zooms, resize/detach/dock to another edge,
layout persistence/reset, create/preview/save/place/reopen effects,
import an effect composition with separate identities, reject invalid
JSON and release previous instances. No unhandled exceptions.

Camera checks reproduced the previous bug: an `[80,40]` pixel drag moved
the scene approximately `[80,-43]`. Error is now below 0.5 pixels in both
axes and all three tested framings.

Unchanged baselines: reference 0.0000; forest 0.0015; marsh 0.1186;
snow 0.0036; mine 0.0134; cathedral 0.0077. All passed. Tauri/mobile
and final fidelity approval were not validated. Historical UI: Portuguese.
