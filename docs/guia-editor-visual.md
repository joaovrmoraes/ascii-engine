# Visual editor — terrain, maps and items

The editor opens at **http://localhost:1440** (`pnpm dev`). This release
covers create → edit → save → reopen → export for visual content.
Game rules and game UI remain in Pomorog.

## Workspace

The layout follows editors such as Unity:

- **Hierarchy**, left: searchable objects already in the map.
- **Scene**, center: mouse selection, placement and transforms.
- **Inspector**, right: object name, transform and appearance,
  with separate **Terrain** and **Environment** tabs.
- **Project / Library**, bottom: searchable assets in Nature, Buildings,
  Shapes, Effects, Atmospheres and Imported categories.
- **File**, top: new map/item, open, save and export.
  **Display**, above the scene, contains camera and global settings.

To place an asset, **drag it from the library onto the ground and release**.
It is selected with movement arrows. Alternatively, click an asset and
then the ground. Shift places multiple copies; Esc cancels placement.

With an object selected, use **W** to move, **E** to rotate and **R** to
scale; drag the colored axes/rings. Enter XYZ values in the inspector.
**Global/Local** selects axis orientation. **Snap** uses 0.5 m, 15° and
0.1 scale increments. One complete drag is one undo action. Transform
controls apply to objects; water uses inspector fields.

**Preview** uses the saved initial camera, or the current view when none
is saved. It hides selection controls and disables editing panels until
**Back to editing**. The adjacent button pauses animation. This is a
visual preview without game rules.

## Arrange panels

- Drag the **heading or ⠿ handle** of Hierarchy, Inspector or Project
  to detach and move a panel within the editor window.
- A blue strip near the left, right or bottom edge shows the docking
  target. Drop there. The previous occupant swaps positions or floats
  without losing its content.
- Drag the **divider beside the scene** to resize a docked panel.
  Use the **bottom-right corner** for a floating panel.
- **Dock** or double-click the heading returns a panel to its original
  edge. **File → Reset panels** restores the initial layout.

Panel positions and sizes are saved in this browser, separately from the
map file. Panels stay inside the editor window; they are not separate
native windows. The toolbar and scene remain in the main layout.

## Create a map

1. **File → New map** opens 32 × 32 m terrain with a tree, rock and campfire.
2. In the Inspector **Terrain** tab, choose Raise, Lower, Smooth, Flatten
   or Paint. Drag over the ground; each stroke is one undo action. Shift
   reverses Raise/Lower. Flatten keeps the height at the start of the stroke.
3. **Water** is a continuous brush: drag to paint channels/lakes; Shift
   erases only water. **Follow terrain** follows slopes without flattening,
   with downhill surface movement. **Flat level (lake)** digs the bed.
   Select water in the hierarchy to adjust shape, level, flow and reflection.
   **Fit to terrain** explicitly converts older water shapes to a mask
   on the terrain; the conversion can be undone.
4. Click a library asset to hold its actual model, or drag it onto the
   ground. W/E/R lock the placement preview to adjust the gizmo; Enter
   places the complete transform and Esc cancels. Assets include trees,
   rocks, crates, bridges, ruins, logs, basic shapes, campfire and effects.
5. The hierarchy selects whole objects. Rename, hide, move, rotate,
   scale, duplicate or delete them in the inspector.
6. The first scene click selects an object. Click the same part again,
   or select it from **part** under **ASCII appearance**, to adjust
   technique, glyph family, size and color. Scope can be instance, type or
   global; all layers are saved in the document.
7. **Environment → Weather** selects rain/snow. **Studio → Atmosphere**
   opens lighting, color and fog controls. Settings are saved with the
   map; they do not automatically convert objects or terrain to another biome.

**Orbit (O)** rotates in 3D with left drag, including up/down tilt.
**Alt + left drag** and **Shift + middle button** also orbit.
**Isometric** restores the initial angle. Right/middle drag, **Q** or
Shift + drag in selection mode pans; scroll zooms. **F** focuses an object.
**Ctrl D** duplicates, **Delete** removes, **Ctrl Z** undoes,
**Ctrl Shift Z** redoes and **Ctrl S** downloads the document.
Shortcuts do not intercept text field editing. Panning needs no Ctrl:
right drag moves the map with the mouse in the same direction and distance,
including vertical screen movement, regardless of rotation or zoom.

Objects keep their inspector-defined height when terrain changes.
Initial placement height comes from the ground. Grass regrows after a
stroke. A water mask is local to its shape.

## Water: flow, reflections and interaction

Select **Water** in the hierarchy. **Simulate water** enables shallow-water
simulation: per-cell depth, neighbor flow, gravity and resistance. Water
moves downhill and accumulates in low parts of the painted area.
**Initial depth** sets the starting amount; **Source rate** replenishes
water at high edges. With zero source rate, the domain conserves volume.
**Wave amplitude** controls small surface waves; **Test waves** creates
an impact. Moving objects in water and actors supplied through
`engine.setActors` produce waves and trails.

The default favors a calm lake, slow wave fronts and readable reflections.
Wave amplitude also controls reflection jitter and small-wave highlights.
Foam appears with agitation, follows the current and dissipates when the
water settles; depth alone does not create foam. The mirror follows the
simulated height of calm regions.

An object's reflection depends on camera angle and its position relative
to the shoreline. Use **Orbit** to inspect every side. Reflections are
not permanently projected directly beneath objects. Moonlight depends on
the camera, surface normal and main light under **Studio → Atmosphere →
Light rotation / Light elevation**. Its color and intensity also affect
water highlights.

The heightfield simulation stays within the painted area, up to 129 × 129
cells. It is not volumetric: automatic spread beyond the paint, ballistic
splashes, water beneath overhangs and rigid-body buoyancy are absent.
Falls follow terrain; no separate free curtain exists. Calm regions have
planar object reflections; slopes reflect light rather than copying a
horizontal mirror over the drop. Particles in the separate pass are not
included in the mirror yet.

The file stores `waters[].physics` and the initial surface; waves/flow
restart on reopening. Simulation does not modify terrain or write each
frame to history. Pause freezes movement.

## Create and reuse items

**File → New item** opens a document without terrain. Compose shapes,
prefabs or imported models with position/rotation/scale. **Save file**
saves the entire composition. **Export this item** saves only the selected
object with its origin repositioned to `[0, 0, 0]`.

In another document, **Insert saved item** adds file objects near the
camera and embeds their models/styles. Items enter as individual objects:
grouping, parenting and linked prefab editing are not implemented yet.
**Open** replaces the whole document and can be undone.

## Import models

Use **Import model** above the library or drop files onto the editor:

- GLB with embedded assets.
- GLTF with its `.bin` files and images, selected together. Missing
  resources show an error while preserving the open scene.
- Current limit: 32 MB per model file. The library/final JSON may be
  larger because sources are embedded as data URIs.
- Named nodes become parts. Blender declarations `glyph`,
  `glyph_surface` and `glyph_size` are supported.
- Each instance has its own geometry, material and mixer. Choose a clip
  or **Animation stopped** in the inspector. Files save the clip rather
  than playback time; animations/effects restart on reopening.

After import, there is no dependency on the machine's original file path.
External GLB textures and formats requiring additional decoders have not
been validated; prefer embedded GLB or GLTF with explicit companions.

### Edit imported appearance and parts

Select the model in **Hierarchy**, then use **ASCII appearance**:

- **Glyph family** chooses the letter ramp (Wood, Bark, Stone, Foliage, etc.).
  It preserves the original material color; it does not replace image textures.
- **Size (m)** changes surface cell width or body base letter size in world
  meters. Blank inherits the default shown in the placeholder. For **Character
  (screen)**, use the pixel-size control under **Display** instead.
- **Color** overrides the model color. **Model color**, followed by Apply,
  restores the inherited material color for the selected style layer.
- **Apply appearance** saves changed fields. Adjusting only the whole object's
  size or color preserves different techniques on its parts. Mixed values
  are shown without choosing one technique for every part.
- **save to** chooses this instance, all matching parts of this model's type,
  or the global style. More specific instance/part overrides still win.
  Imported files now have a shared type, so the all-copy scope is available.

For a tree, export a parent object with named **crown** and **trunk** objects
or groups from Blender. A crown group may contain several leaf meshes.
These names appear in **part**, alongside **Whole object**. Use **Glyph body /
Foliage** for the crown and **Surface glyphs / Bark** for the trunk. The editor
can change those choices after import; glyph custom properties are optional.
If supplied, export Blender custom properties as glTF `extras` to carry the
initial appearance. Editor styles override those imported defaults.

A single mesh with one material has one editable part. The engine does not
infer which faces are a crown, trunk, handle or blade, and has no face-selection
tool for splitting them. Separate the desired parts in the source model before
export. Transform controls still move the placed object as a whole.

Custom per-part alphabets, independent spacing, ink/gap controls and shadow
steps remain outside this inspector. Family presets retain the Pomorog ramps.

## Composition cameras

**Create camera** captures the current framing and adds a hierarchy object.
The first camera becomes the document's initial camera. Selecting it shows
a **small live corner preview**, including during gizmo drags. **Expand**
opens that camera view in the scene. Available controls:

- **Position / Rotation** fields or **W / E** gizmos.
- **Frame height** adjusts the orthographic composition's visible extent.
- **Aspect ratio** selects 16:9, 4:3, 1:1 or 9:16 without stretching.
- **View through camera** opens the saved framing. **Back to navigation**
  restores the free editor camera without changing the saved pose.
- **Capture current framing** replaces the pose with the editor view.
- **Aim at view center** points the camera toward the current focus.
- **Use as initial camera** selects the view used by Preview, player and export.
- **Duplicate camera** lets you try a second shot while retaining the first.

Cameras support deletion and undo/redo. Name, pose, size and aspect ratio
survive save, reopen, local draft and export. The icon/view volume are
editor helpers and never appear in the game. Projection is orthographic,
matching Pomorog; perspective and camera keyframes are not implemented.

## Create effects

1. Open **Studio → Effects** or **Create effect**. The dedicated screen
   shows the effect in empty space while the map is paused.
   **Back to scene** restores the scene and panels.
2. Choose **Fire, Smoke, Sparks, Magic, Explosion or Lightning**, or
   **Start from scratch**. The selector also lists Pomorog presets and
   saved effects. Presets are copied, preserving original recipes.
3. Name the effect. **Basic** adjusts the selected layer's count, glyph
   size, lifetime, upward/downward movement, spread and color as applicable.
   Add, duplicate or delete layers. **Advanced** exposes shape, XYZ
   velocity, gravity, appearance and JSON for curves, heat and flipbooks.
   Name layers and set **Origin X/Y/Z**, or drag the preview gizmo.
   **W** shows the gizmo, **Q** hides it and **F** frames it.
   **Reset position** returns a layer to the origin without changing the map.
4. The preview updates as you edit. **Restart, Pause, Stop, Frame** and
   playback speed sit below it. Drag to orbit, right drag to pan and
   scroll to zoom. One-shot effects automatically repeat only in the preview.
5. **Save to Assets** adds the recipe under **Effects**. **Show in Assets**
   opens that category. **Save and place in scene** starts placement;
   click the ground to add an instance. Double-click a saved asset to
   reopen its recipe; saving updates that asset.
6. **Import or download file** includes **Download effect** (`.effect.json`)
   and **Open effect**. Save after importing to add it to Assets.

**Ctrl S** saves to Assets inside either Studio. ↶/↷ and Ctrl Z/Ctrl Shift Z
undo/redo the effect draft. One full gizmo drag is one action. Effect history
is separate from scene history. Saving embeds positions in the recipe;
**Save and place in scene** moves the entire composition in the map.

**Emit light** configures a point light that illuminates objects and grass
when placed in the map. Empty-space preview has no surfaces to show that
lighting.

Saved effects survive saving, reopening, undo/redo, map export and item
export/insertion through `SceneDoc.effects`. Instances follow their object
position; orientation/scale do not transform the whole particle simulation
yet. Non-looping effects play once in the scene; preview repetition does
not change this setting.

## Create atmospheres

In **Studio → Atmosphere**, start with Moonlight, Dusk or Ember and adjust
exposure, glyph color, background, main light direction/color/intensity,
shadows, ambient light, fill and fog. Preview uses the open map.
Ctrl Z undoes scene changes.

Name it and choose **Save to Assets**. The preset appears under
**Assets → Atmospheres**; **Show in Assets** opens that category. Click
an asset to apply lighting; double-click to apply and open the Studio.
Save updates the same preset; **Save copy** creates another. Presets live
in `SceneDoc.atmospheres` and survive project files, local draft, undo/redo
and export. Current lighting remains in `SceneDoc.style`.

**Download atmosphere** / **Open atmosphere**, under **Import or download
file**, transfer a preset as `.atmosphere.json`. Save to Assets after
importing. The library belongs to the open document; it is not a shared
global library across projects.

## Create with AI

The API/MCP reads and edits the full visual document, imports models,
creates effects, sculpts/paints, controls atmosphere and exports.
An AI preview shows **Apply/Discard**; accepting a batch records one
undo action. An agent may also apply directly. Each tab has a session
and each edit has a revision to prevent overwriting newer changes.
See [connection, tools and examples](api-mcp.md).

## Save and export for Pomorog

A per-browser/origin automatic draft lives in **IndexedDB**. The toolbar
reports success/failure. History lasts for the session, up to 30 actions
and 64 MB of snapshots; large documents reduce action count. Downloaded
files are the way to transfer work between machines.

**Save file** (`.ascii.json`) and **Export for Pomorog** (`.pomorog.json`)
contain the same version 1 `SceneDoc`: name, painted terrain, water, grass,
environment, styles, instances with identities/seeds, transforms,
embedded assets and effect recipes. Both reopen in this editor.

Pomorog still needs an importer. Export does not modify a game checkout.
Built-in prefabs are named recipes, not generated GLBs: the consumer
needs `apps/editor/src/scene/prefabs.ts` and `pomorogKit.ts`, or compatible
recipes. Imported models are embedded in the document. Legacy prefab IDs
are preserved even though their editor display labels are English.

Consumption contract:

```ts
const doc = parseScene(json)
const assets = await loadSceneAssets(doc)
const scene = buildScene(engine, doc, { ...gamePrefabs, ...assets.library })
// Visual loop: scene.update(time); engine.render(dt).
// On exit: scene.dispose(); assets.dispose().
```

The core imports neither the editor library nor Pomorog rules.
`parseScene` validates before allocation; `buildScene` cleans up if
construction fails. The editor releases the previous document only after
the new scene is constructed.

For an independent web preview with runtime/library included:

```bash
pnpm export -- --title "My map" --scene docs/examples/mapa-prova.pomorog.json --out exports/my-map
python -m http.server 1441 --directory exports/my-map/web
```

This presents visuals without authoring panels. It does not include
game rules, inventory, quests or game UI.

## Examples and validation

- [Lake and rain map](examples/mapa-prova.pomorog.json): created by the
  interaction check, including a customized crown.
- [Item with embedded animated models](examples/item-roundtrip.json):
  a block and two minimal GLTF/GLB test models, not finished art.
- [Cameras, movable panels and effect creation](captures/paineis-efeitos-2026-10-11/README.md).
- [Initial workspace rearrangement](captures/editor-unity-2026-10-11/README.md).
- [Persistence/export validation](captures/autoria-2026-10-11/README.md).
- `pnpm check`: types, unit tests and build.
- With `pnpm dev` running, `pnpm verify:authoring` exercises the real editor
  in isolated Chromium, including library drag/drop and axis move/rotate/scale
  with native mouse events. Output: `/tmp/ascii-authoring-verification`,
  or an explicit directory argument. Requires Chromium.
- `pnpm compare`: six views against the existing baseline, without updating it.

## Still incomplete

This is a working visual authoring base, not every system in `START.md`.
Outstanding: multiple selection/grouping, linked compound prefabs,
chunk editing with seams/connectors, the full five-biome palette,
sea/waterfall/spline rivers, advanced brushes, graphical effect curves
and timeline, complete per-part alphabet/color/spacing controls and real
game integration. Existing areas remain code-built references.

Editor rain/snow reuse visual recipes but not all footprint, accumulation,
melting and marsh-ring interactions. Objects, effects and terrain can overlap;
authoring does not enforce collision or placement rules. Panel docking
provides one region per edge; arbitrary column splits and universal tab
groups remain unavailable. Native Tauri/mobile were not validated in this
release. Full visual equivalence approval against Pomorog is still pending.
