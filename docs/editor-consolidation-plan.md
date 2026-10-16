# Editor consolidation plan

Audit date: 2026-10-14. Source: code reading of `apps/editor` plus a read-only
walkthrough of the sandbox editor in the Orca Browser (`?area=sandbox`).
Audience: the agent implementing the consolidation.

The editor grew in layers: the phase 1 adjustment panel, the Unity-style
workspace, then three Studio pages. Each layer added its own way to edit
appearance, lighting and files. The result works for v0.1, but the same
setting lives in several places, some settings live in none, and similar
controls behave differently. This plan lists every finding and orders the
fixes.

Read `AGENTS.md` and `START.md` first. Their rules apply here, especially:
letters stay attached to objects, the core stays independent, existing
`SceneDoc` files must keep loading, and **notify the owner before removing
anything they have seen or approved**.

## Target model

One place per concept:

| Concept | Single home | Everything else |
| --- | --- | --- |
| Letter appearance of a mesh part (technique, family, alphabet, size, color, ink…) | **Texture Studio** | Inspector shows a read-only summary and an "Edit letters" button |
| Where an appearance is saved (part / object / every object of this asset or type / global) | **Texture Studio**, "Apply to" selector | Inspector no longer writes styles |
| Reusable appearance | `SceneDoc.textures`, **linked** by id from objects/parts | Library card: drag onto object/part to apply; double-click to edit |
| Scene lighting and exposure | **Atmosphere Studio** + Environment tab selector | Texture Studio preview picks an atmosphere instead of owning light controls |
| View-only settings (zoom, rotation, debug render mode, pause, capture) | **Display** popover | Never stored in the document |
| Letters of water, terrain layers and grass | Texture Studio targets (or a shared "Letters" section reusing the same controls) | — |
| Files | File menu: Open, Save, Import, Export… | One import button, one save path |

## Findings

Each finding has an ID used by the tasks below. "Seen" means confirmed in
the running editor; "Code" means read in code only.

### A. Letter appearance is split between the inspector and the Texture Studio

- **A1 (Seen)** The inspector block "ASCII appearance" (`apps/editor/src/selection.ts`)
  edits technique, glyph family, size and color and has a **save to** scope
  (this instance / this part in every object of this type / global style).
  The Texture Studio (`apps/editor/src/editor/textures.ts`) edits the same
  four fields plus alphabet, font, visibility, spacing, ink, palette and
  lighting, but **has no scope**: only "Apply to object/part".
- **A2 (Seen)** Technique `screen` ("Character (screen)") exists only in the
  inspector (`selection.ts:11`); the studio offers surface and body only
  (`textures.ts:62`, `textures.ts:135`).
- **A3 (Seen)** The inspector has no link to the Texture Studio. The toolbar
  "Create texture" button reads the selected part straight from the inspector
  DOM (`apps/editor/src/areas/sandbox.ts:417`).
- **A4 (Seen)** Labels differ: inspector says "Wet grass" / "Character",
  studio says "Wetgrass" / "Actor" (`selection.ts:13` vs `textures.ts:136`).
- **A5 (Seen)** The same imported object shows its model color (`#d1894b`) in
  the inspector and `#ffffff` in the studio. Model-color detection is
  implemented twice (`selection.ts` `show()` and `textures.ts:181`).
- **A6 (Code)** Family list and default-size logic are duplicated
  (`selection.ts:12`/`:87` and `textures.ts:136`/`:174`).
- **A7 (Code)** The global layer (`style.glyphs`) can be written from the
  inspector ("global style") but no screen displays its contents.
- **A8 (Seen)** The inspector shows the family alphabet (` .,:;-~=+*ox%#`)
  even when a custom alphabet applies, so it can misreport what is drawn.

### B. Applying textures

- **B1 (Seen)** Clicking a texture card in the library opens the studio
  (`sandbox.ts:222`). Clicking an atmosphere card *applies* it, and
  double-click edits (`sandbox.ts:212-213`). Same card type, opposite
  behavior. Textures cannot be dragged onto an object or part.
- **B2 (Seen)** Opening a texture from the library silently targets the last
  selected scene object.
- **B3 (Code)** A texture applies only to a placed instance or part. There is
  no way to apply it to an **asset** (imported model or prefab), so the next
  copy dragged from the library arrives without it. In data terms the asset
  default is the type layer `SceneDoc.style.types[<assetId>]`, which only the
  inspector's "type" scope can write, and only with four fields.
- **B4 (Code)** Applying copies the style (`sandbox.ts:393-398`;
  authoring `texture.apply`, `packages/authoring/src/commands.ts:118`).
  Objects do not remember which texture they use, editing a texture does not
  update its users, and there is no "used by" list.
- **B5 (Seen)** Studio heading says "Create texture" / "Create atmosphere"
  even when editing an existing asset (`textures.ts:24`, `atmosphere.ts:16`).

### C. Letters that the texture tools cannot reach

- **C1 (Seen)** Water: the inspector edits position, size, direction, level,
  flow, reflection and physics, but none of the letter look (`WaterLook`:
  alphabet, shallow/deep/foam colors, rings). Only the API can change it.
- **C2 (Seen)** Terrain layers (Moss, Earth, Stone, Snow) and their `carpet`
  grass have no letter editing at all; the brush only picks a layer.
- **C3 (Seen)** Layer vocabulary (Moss/Earth/Stone/Snow) differs from glyph
  families (earth/stone/wood/bark/foliage/snow/wetgrass/actor).

### D. Lighting and atmosphere in four places

- **D1 (Seen)** Environment tab: atmosphere select with the three built-in
  presets (Moonlight/Dusk/Ember) only; saved atmospheres are not listed there.
- **D2 (Seen)** Atmosphere Studio repeats the presets and owns exposure,
  lights and fog. Its "Exposure" is the same value as Display "light"
  (`style.brightness`).
- **D3 (Code)** Texture Studio "Preview lighting" duplicates most atmosphere
  controls, stores them in `TextureAsset.previewLighting`, and offers
  "Apply lighting to scene" and "Save as atmosphere" (`textures.ts:215-262`).
- **D4 (Seen)** Library atmosphere cards also apply lighting on click.
- **D5 (Seen)** Studios behave differently: Textures and Effects use an
  isolated preview and pause the map; Atmosphere edits the live map
  ("Changes appear in the scene"). Nothing in the shell tells the user which
  mode they are in.

### E. Display popover mixes view settings with document settings

`apps/editor/src/panel.ts` is the phase 1 panel mounted into the inspector
as "Display ▾" (`workspace.ts`, `data-mount="panel"`).

- **E1 (Seen)** `area` select leaves the editor for a demo area.
- **E2 (Seen)** `mode` (glyphs / screen legacy / raw) reloads the page; the
  `screen` option has no effect in the sandbox because only code-built areas
  read `options.screen`. `raw` works through `engine.debug.raw`.
- **E3 (Seen)** `size` (`cellSize`) and `light` (`brightness`) change the
  document style, not the view.
- **E4 (Code)** Toolbar pause clicks the Display pause button through the DOM
  (`sandbox.ts:433`).
- **E5 (Seen)** "import models and files" duplicates library "Import model".
- **E6 (Seen)** "save/load preset .json" exports the whole style; overlaps
  atmosphere download and document save.
- **E7 (Seen)** Display replaces the inspector content without a tab and
  keeps the old visual style (lowercase labels, `[ buttons ]`).

### F. Files

- **F1 (Code)** "Save" and "Export for Pomorog" download the same document
  with different file names (`sandbox.ts:408-409`).
- **F2 (Code)** Five JSON entry points: Open document, Insert saved item,
  load preset, Open atmosphere, import `.texture.json`.
- **F3 (Seen)** Two model import buttons (library and Display).

### G. Water and terrain panels

- **G1 (Seen)** Water rows lack Name and Visible and use loose
  "Position x/z" fields instead of the XYZ vector rows used by objects.
- **G2 (Seen)** "Continue painting water" in the water inspector duplicates
  the Water brush in the Terrain tab.
- **G3 (Seen)** "Erase object" sits among terrain brushes (`sandbox.ts:434`).
- **G4 (Seen)** The "Water: Follow terrain / Flat level" select is always
  visible, even when the active brush is not Water.
- **G5 (Seen)** Weather has no intensity control although
  `SceneEnvironment.intensity` exists (`packages/engine/src/weather/sceneWeather.ts:6`).

## Tasks

Ordered so each stage ships independently and passes `pnpm check`. Stages
marked **format** change `SceneDoc`; they need validation, migration of old
documents, authoring/MCP schema updates and `docs/api-mcp.md` changes.

### Stage 1: shared glyph catalog (no visible behavior change)

Fixes A4, A6, C3 (naming only), part of A5.

1. Create one editor module (e.g. `apps/editor/src/editor/glyphCatalog.ts`)
   exporting families, display labels, default sizes, alphabet lookup and
   model-color detection. Use it from `selection.ts`, `textures.ts` and the
   terrain layer select.
2. Use one label set everywhere ("Wet grass", "Character").
3. Make inspector and studio show the same color for the same object.

Done when: both panels show identical names and color for the same selection;
no duplicated family/size tables remain.

### Stage 2: Display becomes view-only

Fixes E1–E7, F3.

1. Keep in Display: zoom, rotation, debug render mode, pause, capture.
2. Move `size` and `light` into the Atmosphere Studio "Scene and glyphs"
   group (exposure already exists there; merge, do not duplicate).
3. Remove from the sandbox Display: area select, model import, save/load
   preset. Keep them for code-built demo areas if still needed there, or
   move area switching to a "Demos" entry in the File menu. Ask the owner
   before deleting the preset feature entirely.
4. Replace the DOM click in `sandbox.ts:433` with a shared pause function.
5. Optional, recommended: add `engine.setRenderMode('glyphs' | 'screen' | 'raw')`
   in the core as a **debug override applied at render time** that never
   modifies the document. Then the mode works live in every scene and the
   `options.screen` branches in `apps/editor/src/areas/*.ts` can go. Label it
   as a debug view: the owner rejected screen-filter worlds as a style.
6. Restyle Display to match the workspace.

Done when: nothing in Display changes the saved document; mode switches
without reload (if step 5 is done).

### Stage 3: one appearance editor

Fixes A1–A3, A7, A8, B2, B5.

1. Texture Studio gains an **Apply to** selector:
   this part / this object / every "<asset or type name>" / global.
   "Every <asset>" writes `style.types[<assetId or type>]`, which is also how
   an imported asset gets a default appearance (B3, without format change).
2. Add technique `screen` to the studio, with the same size behavior the
   inspector has (size disabled; letter size follows cell size).
3. Inspector "ASCII appearance" becomes a summary: effective technique,
   family/alphabet actually drawn, color swatch, which layer it comes from
   (instance / type / global / imported default), and **Edit letters…**
   which opens the studio on the current object and part. Remove the
   inspector's editable fields only after the studio covers them all;
   tell the owner before removing.
4. "Create texture" toolbar button passes the selection through a function,
   not the DOM.
5. Studio opened from a library card asks for a target (or opens with "No
   target · editing asset only") instead of silently using the last
   selection.
6. Headings: "New texture" / "Edit texture: <name>"; same for atmosphere.
7. Show the global layer somewhere (studio "Apply to: global" displays the
   current global values).

Done when: every appearance field is editable in one place, at every scope,
and the inspector accurately reports what is drawn.

### Stage 4 (format): linked textures

Fixes B1, B4.

1. Objects and parts may reference a texture:
   `options.texture?: string` and `options.parts[name].texture?: string`,
   resolved below the instance's own overrides. Same for type styles if
   useful.
2. Resolution order becomes
   `global → type → texture (linked) → instance/part overrides`.
   Put the resolution in the core style layering (`packages/engine/src/style.ts`)
   or in `buildScene`, not in the editor.
3. Old documents keep working: existing copied styles are plain overrides.
   Do not auto-convert them.
4. Library: drag a texture card onto an object or part to link it; click
   selects; double-click edits. Make atmosphere cards follow the same rule
   (click selects, double-click edits, explicit "Apply" action), or document
   why they differ.
5. Studio shows "Used by N objects" and offers "Detach" (copy into instance).
6. Deleting a texture in use asks first (as assets/effects already do in
   `commands.ts:109`).
7. Authoring API: `texture.apply` gets `link: true` (default for new calls
   can stay copy for compatibility); add `texture.detach`. Update
   `packages/authoring` schema, MCP tool descriptions and `docs/api-mcp.md`.
   Run `pnpm verify:textures` and `pnpm verify:authoring`.

Done when: editing a linked texture updates every user live and after reload.

### Stage 5: lighting in one place

Fixes D1–D5.

1. Environment atmosphere select lists built-in presets **and** saved
   atmospheres.
2. Texture Studio preview lighting becomes a select of atmospheres
   (built-in, saved, or "current scene") instead of its own light controls.
   Keep reading `TextureAsset.previewLighting` from old files; when present,
   offer "Save as atmosphere" once and select it.
3. Remove "Apply lighting to scene" from the Texture Studio (the Atmosphere
   Studio owns that action). Notify the owner first: this was shipped in the
   Texture Studio release.
4. Decide one studio rule and show it in the Studio header:
   either all studios preview in isolation with an explicit Apply, or the
   Atmosphere Studio stays live and the header says "Editing the live map".

Done when: light is edited only in the Atmosphere Studio, and every studio
tells the user whether the map changes.

### Stage 6 (format for water/terrain looks): letters of water, terrain and grass

Fixes C1, C2, C3.

1. Water look editing: alphabet/density, shallow/deep/foam colors, rings,
   reflection strength (fields already in `WaterLook`, `SceneDoc.waters[].look`).
   Either a Texture Studio target type "Water" or a "Letters" section in the
   water inspector built from the same controls.
2. Terrain layer looks: per layer `surface` floor style and `carpet` cover
   recipe (START.md §3.4). Check what `TerrainData.layers` already stores
   before adding fields.
3. Rename layers or families so one vocabulary is used, keeping stable IDs
   in documents (ADR 0002: display labels separate from IDs).

Done when: every lettered thing in a map can have its letters edited
somewhere in the UI.

### Stage 7: water/terrain panels and files

Fixes G1–G5, F1, F2.

1. Water inspector: Name, Visible, XYZ vector rows like objects.
2. Keep one entry to paint water (Terrain tab); the water inspector can
   switch to that brush but should not look like a second tool.
3. Move "Erase object" out of the terrain brushes (object tool or Delete).
4. Show the water mode select only when the Water brush is active.
5. Add weather intensity.
6. File menu: Save writes the document; Export… opens a dialog for web,
   desktop (Tauri) and Pomorog targets (`pnpm export` already supports
   web/desktop).
7. One Open… that recognizes document, item, atmosphere and texture JSON
   by shape and routes them (insert item, add asset…), or clearly separate
   "Open map" from "Import into this map…".

## Validation for every stage

- `pnpm check` (includes package boundary check).
- Relevant verify scripts with `pnpm dev` running: `verify:authoring`,
  `verify:textures`, `verify:api`, `verify:water`, `verify:gltf`,
  `verify:composition`.
- Walk the changed UI in the **Orca Browser** at
  `http://localhost:1440/?area=sandbox`. Pin browser commands to the editor
  tab with `--page <browserPageId>`; without it they can hit another
  worktree's active tab.
- Open an old saved document (`docs/examples/`, `docs/captures/*/*.json`)
  and confirm it loads and looks the same.
- Update `docs/log.md` with screenshots in `docs/captures/<topic>-<date>/`,
  and `START.md` / `docs/guia-editor-visual.md` where the workflow changes.

## Out of scope here (tracked elsewhere)

From the 2026-10-14 structure review, still open:

- Split `apps/editor/src/areas/sandbox.ts` (56 KB) into hierarchy, inspector,
  library, input and document modules. Stages 2–7 touch it heavily;
  splitting first or alongside will make them easier.
- Unit tests for non-DOM editor logic (selection, placement, layout, names,
  scene files); the editor `test` script is a placeholder.
- Media weight in git (`docs/showcase` and `docs/captures`, ~280 MB pack).
- Remaining Portuguese names in living docs.
- Core leftovers: `FOREST_WATER` as the generic water default,
  `./presets` and `./pomorog` exporting the same file, lost field comments
  on `AsciiStyle`, `POMOROG_FIRE` aliasing the same object as
  `DEFAULT_HEAT_GRID`, and the snow baseline (RMSE 0.11, predates the
  boundary refactor; regenerate only with owner approval).
