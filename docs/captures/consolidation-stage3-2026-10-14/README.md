# Consolidation stage 3 evidence

The appearance inspector is read-only after owner approval. Edit letters opens
Texture Studio on its current target; four Apply to scopes cover all fields.

- `inspector-00.png`: historical item with effective values and per-field sources.
- `studio.png`, `layout.png`: imported part preview and complete controls.
- `legacy-00.png`: old item-roundtrip document, same view as stage 1.
  World crop 1048×340 at (232,132): RMSE 0 against stage 1.
- `orca.json`: snapshot of the explicitly pinned editor page. Its imported
  pretzel color remained #d1894b and opening Studio did not change the document.
  Orca screenshot capture remains unavailable; images use GPU Chromium/cdpshot.

Validation: pnpm check (118 tests), textures 92 assertions, authoring 72,
GLTF 18 and actual stdio MCP/API passed. No runtime/shader errors. API cancel
now binds types from the candidate document rather than a previous preview.

The plan assumed no format change here. Procedural node declarations required
an optional `style.types[id].authored` field mask so all-copy edits work without
changing old layering. Validation, MCP schema/descriptions and API docs cover it.
Screen uses its legacy atlas and scene cell size; unsupported controls are disabled.
Native desktop unverified. Linked recipes, lighting and component letters follow.
