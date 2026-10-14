# Editor consolidation — stage 1, 2026-10-14

The inspector, Texture Studio and terrain layer selector now use one editor
glyph catalog. Family labels include **Wet grass** and **Character**; known
part names use the same display labels while their saved IDs remain unchanged.
Alphabet lookup, inherited size and original model-color detection are shared.
Character body size now displays the renderer's existing .155 m default in
both panels; scenery bodies retain .19 m. No controls were removed.

Validation:

- `pnpm check`: 114 unit tests, package boundaries, types and production build.
- `pnpm verify:textures`: 85 browser checks, including inherited object/part
  colors, family/part names, alphabets, sizes, explicit RGB and persistence.
- `pnpm verify:gltf`: 18 import/appearance checks.
- `pnpm verify:authoring`: 67 checks, including unchanged legacy terrain names.
- Orca at `http://localhost:1440/?area=sandbox`, using the editor's explicit
  `--page` ID: both panels show the same family labels and `#d1894b` for the
  selected `pretzel.gltf`. Its document was unchanged, and the Studio was
  closed after inspection. `orca-after.json` records the result.
- `cdpshot.mjs` loaded the unchanged historical
  `docs/examples/item-roundtrip.json` before and after. The world viewport
  crop (1048×340 at 232,132) has **RMSE 0**, excluding UI/status text.

`legacy-before-00.png` / `legacy-after-00.png` are the cdpshot captures.
`texture-studio.png` is a real GPU Chromium capture from the texture verifier.
The Orca screenshot timed out because the tab did not draw a frame; no Orca
image is claimed. Desktop-native and physical mobile interaction were not
tested. Historical renderer baselines were not regenerated.

Audit clarifications: A5's white Studio color was not reproduced on the current
pretzel before the change; both panels already showed `#d1894b`. Procedural
crowns can correctly expose a white base material with per-instance colors.
Mixed objects still display a representative material color, not a composite
color. Moss remains a terrain layer label, not an invented glyph family;
per-layer letter editing belongs to stage 6. The plan's core follow-up list
predates c93f647; the snow baseline still needs separate visual approval.

Only stage 1 was implemented. Stage 2 and later stages are pending. The
uncommitted consolidation plan was left untouched; sandbox decomposition was
unnecessary for this change. This stage is committed locally without a push.
