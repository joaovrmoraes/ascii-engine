# English project validation — 2026-10-12

Translated current UI, accessible labels, defaults, errors and API/MCP
help, plus README and technical documentation. Stable prefab/preset IDs,
owner-authored scene names and reference/ remain original. No renderer,
shader or simulation changes. Structural review of 16 changed core/authoring
files found only text changes.

## Validation

- pnpm check: 79 tests (68 engine, 10 authoring, 1 bridge), types and build.
- pnpm verify:authoring: native placement/gizmos, history, persisted styles,
  portable GLTF/GLB, terrain/water/effects/atmosphere and panel behavior.
- pnpm verify:composition: native camera/layer transforms, local history,
  live thumbnail, Preview/initial camera, saved recipes and exported player.
- pnpm verify:api: official MCP handshake, all 14 tools, isolated session,
  validated atomic commands, previews/revisions, import/export and capture.
- Remotion npm run check: passed.
- pnpm compare: all six views passed without baseline changes. RMSE:
  reference .0000, forest .0014, marsh .1096, snow .0063, mine .0163,
  cathedral .0396. Raw results in [compare.log](compare.log).

Integration profiles were disposable and did not modify the owner's draft.
[authoring/](authoring/), [composition/](composition/) and [api/](api/) contain
actual GPU Chromium captures and exported test documents. Capture filenames
retain the existing verification scripts' historical naming.

[showcase/editor-english.png](showcase/editor-english.png): English editor with
an English copy of Living Shore, opened in an isolated profile for a still
image only. No new showcase video was recorded.
[orca-editor.png](orca-editor.png): actual embedded editor. Existing owner
object names can remain Portuguese; controls and builtin library are English.

Orca initially returned runtime_unavailable. After the environment restarted,
snapshot/screenshots worked and the editor was inspected without changing its
saved scene. The six README videos also played in Orca, with seeking and frame
advancement: ../readme-2026-10-12/playback-orca.json.

Known Vite large-chunk and Zod annotation warnings remain. No new Tauri/mobile
launch or Pomorog importer check. reference/ and comparison baselines were
unchanged; GitHub repository creation waits for README review.
