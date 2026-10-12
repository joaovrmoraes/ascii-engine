# Authoring evidence — 2026-10-11

- `mapa-reaberto.png`: editor after changing position/crown style, sculpting,
  undoing, digging a lake, enabling rain and reloading. IndexedDB document
  was identical to the saved document, checked by JSON equality.
- `item-com-modelos.png`: document without terrain, with a block and embedded
  minimal animated GLTF/GLB models, after save/reconstruction.
- `player-exportado.png`: web export served at `localhost:1441`, without panels,
  with three objects, lake and rain. Captured with `cdpshot.mjs`.
- `orca-canvas.png`: canvas rendered in **Orca Browser**, at
  `http://localhost:1440/?area=sandbox`, using `engine.render` then
  `canvas.toDataURL`. Accessibility/controls inspected with `snapshot`.
  Full-page `screenshot` timed out waiting for the compositor; canvas
  evidence is not full-window validation.

The first two images came from `scripts/verify-authoring.mjs`, using
GPU Chromium in an isolated profile without changing the owner's draft.
Previous editor state: `../auditoria-2026-10-11/sandbox.png`.

All six baseline comparisons passed: reference 0.0000, forest 0.0008,
marsh 0.1300 (rain limit 0.2), snow 0.0051, mine 0.0107, cathedral 0.0062.
These measure regression against the engine baseline, not full Pomorog
fidelity approval. Screenshots document the historical Portuguese interface.
