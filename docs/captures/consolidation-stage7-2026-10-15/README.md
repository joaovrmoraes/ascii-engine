# Consolidation stage 7 evidence

- `water-panel.png`: Name, Visible and XYZ, after editing all three axes and
  hiding the water mesh. Empty viewport is expected for this hidden-only scene.
- `mixed-model-import.png`: File accepts models/companions and texture JSON
  in the same operation; appearance edits and named parts survive reopening.
- `export-dialog.png`, `export-web-ready.png`, `export-desktop-ready.png`:
  three targets, background jobs, status recovery across browser reloads and
  ready downloads. Pomorog JSON remains available without the bridge.
- `export-web-player.png`: the generated relative-path player at a nested
  URL, with a linked texture and hidden water, without editor UI.
- `item-legacy-after-00.png`, `terrain-legacy-after-00.png`: historical saved
  documents. Both world crops match their original captures exactly (RMSE 0).
  Baselines were not regenerated. See `legacy-comparison.txt`.
- `orca-validation.json`: explicit editor page
  `2f12dd1f-17bf-4272-8c88-548057dfb5e6`, sandbox on port 1440. Actual water
  name/visibility/Y and weather intensity were edited in a temporary scene;
  the owner's four-object document was restored unchanged.

Validation: pnpm check passes 144 tests (125 core, 14 authoring, 2 transport/
export, 3 editor files), package boundaries, types and build. Browser checks:
authoring 81, textures 103, GLTF 19, water 25 plus eight bank views, actual
stdio MCP/API 39 and project export 9. Relevant logs are alongside captures.
The standalone export test built Web and native Linux ZIPs, checked scene
identity, binary permissions/archive contents, download responses and the
actual Web player. `desktop-build.log` and `export-artifacts.txt` record the
native build and artifact hashes; binaries remain in ignored exports/.

The native application window was not launched; Windows/macOS builds and
font embedding remain unverified. Orca captureScreenshot still times out
because the embedded page does not draw a frame; all images here come from
inspected GPU Chromium captures. Old SceneDoc fields remain optional and no
migration was performed. The owner's untracked plan stays uncommitted. No push.
