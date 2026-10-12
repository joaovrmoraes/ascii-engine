# Unity-inspired workspace — 2026-10-11

Owner request: simplify interface and placement using Unity's workspace
organization as reference. Scene rendering retains Pomorog's ASCII style.

- [Before](../autoria-2026-10-11/mapa-reaberto.png): combined left list/inspector,
  tools over the scene and form-based placement.
- [Workspace](espaco-de-trabalho.png): `cdpshot.mjs`, GPU Chromium,
  1600 × 757, initial map, selected campfire, inspection zoom 0.65.
  Ready canvas, three objects, inspector and move mode verified first.
- [Mouse rotation](rotacao-mouse.png): 1600 × 857, `verify:authoring`
  after dragging a crate from the library and rotating its Y ring.
  The inspector shows the resulting rotation.
- [Orca Browser](orca-editor.png): full page, 2148 × 919, real
  `orca-ide screenshot`. Selected tree, movement arrows and inspector;
  DOM/accessibility inspected. Full-page capture worked in this stage,
  unlike the earlier authoring stage.

## Validation

`pnpm check`: types, 41 tests and build passed. Vite's >500 kB bundle
warning remains. `pnpm verify:authoring /tmp/unity-editor-final` passed:
native library drag/drop, X-axis move/scale, Y-ring rotation, inspector sync,
whole-transform undo, preview, persistence, GLTF/GLB import, export, brushes
and draft restoration. No unhandled page exceptions.

Comparison against engine baseline, without updating it:

| View | Final RMSE | Limit |
| --- | ---: | ---: |
| Reference | 0.0000 | 0.04 |
| Forest | 0.0096 | 0.04 |
| Marsh | 0.1138 | 0.20 |
| Snow | 0.0041 | 0.04 |
| Mine | 0.0158 | 0.04 |
| Cathedral | 0.0059 | 0.04 |

The first comparison, concurrent with interaction checks, failed only in
forest (0.1352). `pnpm compare floresta`, rerun alone, passed at 0.0096
without code/baseline changes. The check is time-sensitive; variation's
cause was not isolated. These are not Pomorog equivalence approval.

At this historical stage, panels were fixed and multiple selection/grouping
was unavailable. Native Tauri/mobile were not tested. Screenshots show the
Portuguese interface before the later English-language change.

Workspace reference: [Unity editor windows](https://docs.unity.com/en-us/engine/7000.0/manual/unity-editor/editor-windows-views-reference).
