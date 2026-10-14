# Consolidation stage 6 evidence

- `component-controls.png`: per-layer floor/standing-letter UI and their painted boundary.
- `standing-letters.png`: authored glyph cover in world space.
- `water-rings.png`: water alphabets and transient impact rings, with a 2D atlas.
- `terrain-legacy-before.png` / `terrain-legacy-after-00.png`: old mapa-prova
  at frozen time 0, same framing. World crop 1048×340 at (232,132): RMSE 0.
- Pinned Orca JSON checks: floor/cover fields, unchanged stable layer labels,
  actual water alphabet editing plus reflection/ring controls; owner document
  and imported-object selection restored afterward.

pnpm check passes 139 tests, types/build/boundaries. Water passes 25 explicit
assertions plus all eight orbit/elevation bank checks; fonts/alphabets, simulated
depth colors, multirow-atlas impact/rain rings, painted floor boundaries, rendered
standing letters and reopen were exercised. Textures 103, authoring 73 and actual
stdio MCP/API 35 assertions pass. Source documents/legacy recipes are preserved.

Plan correction: WaterLook lacked alphabets, depth colors and ring settings.
They are optional format extensions; floor look and cover are optional too.
Validation, terrain.layer/water.update schemas, MCP references/descriptions and
API docs were updated. Default water keeps its shared atlas and shader recipe;
default cover keeps its seeded glyph/height/color distribution. User-authored
floor looks use four material groups at most, not one draw call per triangle.
Orca screenshots remain unavailable; GPU Chromium captures were inspected.
Native desktop and font embedding remain outside visual validation here.
