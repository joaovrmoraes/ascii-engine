# ASCII Engine — starting point

Read this entire file before making changes. It applies to every agent
(Claude, Codex and others) and to people working on the project.

## 1. Purpose

An engine that receives a 3D scene (Three.js) and renders it **made of letters**.
Letters stay attached to objects. The visual approach comes from **Pomorog**,
a pomodoro game with automatic hunting in isometric ASCII 3D, approved by the
owner on 2026-10-10–11. Its knowledge is copied to
[`reference/pomorog/`](reference/pomorog/README.md).

The owner's intended use, translated: “put a 3D model in and convert it to
ASCII.” Objects declare their technique and receive Pomorog's finish, without
hand-tuning shaders for every case.

## 1.1 Success criterion (owner, 2026-10-11)

> “If I can make my game, I think that's good enough — all its maps,
> marsh and so on, that's success for me.” (Translated.)

The engine is ready when all **five Pomorog areas** can be authored through
the editor with the quality of approved screenshots:

| Area (game id) | Required engine features |
| --- | --- |
| Dark Forest (`dark_forest`) | circuit chunks, terrain, reflected lake/stream, bridge, `body` crowns, `carpet` grass, campfire |
| Rain Marsh (`rain_marsh`) | legacy marsh water, rain with `\|_____\|` rings, wetland trees, shores |
| Snow Pines (`snow_pines`) | snowy floor, falling snow, branch snow, pines |
| Old Mine (`old_mine`) | dark interior revealed by light, tracks, beams, copper veins, rocks |
| Sunken Cathedral (`sunken_cathedral`) | `surface` construction, reflected water, interior lighting |

Work order: **Forest → Marsh → Snow → Mine → Cathedral**. Each is a milestone
and pulls only the features it needs. Finish with owner-approved side-by-side
Pomorog/engine screenshots. Features in §3.1–3.4 unused by these areas — sea,
waterfalls, erosion, video import and others — follow this criterion.

## 2. Visual principle

- **The world is made of letters attached to things.** Camera rotation follows
  object surfaces; letters do not stay fixed to screen pixels.
- The owner rejected three approaches, which must not return:
  1. a **screen filter over the entire world**;
  2. **smooth 3D textured with letters**;
  3. **solid letter-filled spheres** for crowns, rocks and creatures.
- Courier New regular, material color, dark gaps, six shadow steps and readable
  outdoor moonlight.
- Parameters and the per-object catalog are in
  [`reference/pomorog/docs/visual-pipeline.md`](reference/pomorog/docs/visual-pipeline.md).
  Approved/rejected images:
  [`reference/pomorog/images/`](reference/pomorog/images/README.md).

## 3. Techniques

| `GlyphKind` | Technique | Pomorog examples | Origin |
| --- | --- | --- | --- |
| `screen` | per-cell screen pass, actor alphabet | hero | `ascii.ts`, `actorInk.ts` |
| `surface` | local glyph grid injected into materials, six steps | floor, bridge, buildings, crate, trunk | `worldGlyph.ts` |
| `body` | open glyph sprite cloud or dark occluder | crowns, rocks, creatures | `glyphBody.ts` |
| `carpet` | upright instanced letters, biome recipes | grass, ground cover | `grass.ts`, `groundCover.ts` |
| `particle` | free glyphs | heat-grid fire, sparks, rain, snow, hits | `glyphCloud.ts`, `effects.ts` |
| `water` | glyph water with planar reflections converted to letters | lakes, streams | `worldGlyph.ts`, `waterReflection.ts` |

Shared foundation: offscreen render target with depth and **material ID in
alpha** (`surface.ts`, `glyph = .85`, always `toFixed(2)`).

**Engine rule:** each object **declares** its technique, e.g.
`engine.add(mesh, { glyph: 'body' })` or `userData.glyph` from Blender/GLTF.
Pomorog inferred it from HSL color because its models were handcrafted;
a general engine cannot depend on color classification.

### 3.1 Style per part (owner requirement)

Style is adjusted **per part**, not only per whole object. The owner wants
different finishes for a tree's crown and trunk. Pomorog already uses
`body` for the crown and `surface` for the trunk.

- A **part** is a named node/mesh (`Object3D`) or material slot. Named Blender
  parts become named GLTF parts.
- Each has a **glyph style**: technique, alphabet, glyph size/spacing, color,
  color multiplier, strength, dark gap, shadow steps, open/occluded and
  animation such as sway/flicker.
- More specific layers win:
  `global preset → object type → part type → instance → instance part`.
  Changing every tree crown differs from changing this tree's crown.
- API: `engine.add(obj, { glyph, parts: { crown: { glyph: 'body', … }, trunk: { glyph: 'surface', … } } })`,
  `engine.setPartStyle(target, part, style)` and GLTF per-node
  `userData.glyph`/`userData.glyphStyle`.
- Authoring: first click selects the object; second click on its part, or
  the inspector list, selects the part. Demo scenes select the part first.
  Show technique/parameters and save scope: this instance, every matching
  part of this object type, or global. Highlight selected parts.
- Phase 1 data structures must support layered style resolution even
  before a complete editor exists.

### 3.2 Water as a component (owner requirement)

Water is a placeable/configurable object, not an effect tied to a biome.

- Types: painted lakes/puddles; width/flow paths for streams/rivers; sea
  with shore; approved legacy marsh rings; vertical waterfalls with foam.
  Additional types may derive from these.
- Parameters: alphabet/density, shallow/deep/foam colors, wave speed/scale,
  flow direction/speed, reflection strength/glyph conversion, foam/shore
  glyphs, depth-based transparency, rain/step rings (`|_____|`, `-----`,
  `||----`) with size/lifetime.
- Steps, rain, falling objects and effects generate rings. Actors in water
  receive reflection/waterline clipping.
- Initial presets: forest lake/stream, legacy marsh and cathedral, with
  per-water overrides.

### 3.3 Effects system (owner requirement)

A full effect system inspired by Unity Shuriken/VFX Graph and Unreal Niagara,
with every visual element represented as **letters**.

- **Effect:** one or more emitters with a timeline, looping or one-shot.
- **Emitter:** continuous/burst count, lifetime, birth shape (point, sphere,
  cone, ring, mesh edge, part surface), velocity, gravity, drag, noise,
  attraction and ground collision. Lifetime curves affect size, color,
  glow, rotation and **glyph sequence**, e.g. `. : * # @`.
- Render types: particles, trails/ribbons, rings/shockwaves, beams,
  heat/smoke simulation grids, ground decals, animated `body`/`surface` meshes.
- Emitters may own flickering lights and trigger sound.
- Attachment: object, part, bone or world position. Triggers: birth, hit,
  death, water entry, time or code, e.g. `engine.fx.play('fogueira', target)`.
- Imported animation:
  - sprite sheets, GIF or video: convert each frame to glyph cells by
    brightness and source color; camera-facing/world-plane flipbooks can
    also drive particle birth shapes;
  - animated GLTF: play clips using the chosen glyph technique;
  - configurable alphabet, scale and color, saved as presets.
- Editor goal: live timeline, editable curves/gradients, visible glyph and
  emitter budgets, JSON presets.
- Performance: per-effect/per-scene budgets, distance detail reduction and
  particle reuse.

### 3.4 Brush terrain (owner requirement)

Sculpt and paint terrain with **brushes**, inspired by Unity Terrain,
producing a world made of letters.

- Base: per-chunk heightmap vertex grids, automatic neighbor seams and
  painted grass/earth/stone/sand/snow/mud/leaf layers. Each layer has
  `surface` floor style and `carpet` cover.
- Brush: size, strength, falloff, round/square/image stamp, mirroring,
  grid snap, Shift inversion and per-stroke undo.
- Sculpting: raise/lower, smooth, flatten to a chosen/clicked height,
  noise, terraces, simple erosion and point-to-point ramps.
- Painting: ground type with edge blending; optional height/slope rules
  for steep stone, high snow and shoreline sand.
- Detail brushes: scatter trees/rocks/shrubs with density, varied transform,
  ground alignment and eraser; grass/flower carpet density.
- Water brushes: dig/fill lakes, trace and excavate streams/rivers with
  width/flow adapted to terrain, global sea level. Terrain edits update shores.
- Paths flatten/paint beneath trails and connect chunks.
- Steep mountains/cliffs use denser stone glyphs and stronger shadow steps;
  vertical `surface` grids align to faces without stretching.
- Generate first, then sculpt: phase 5 supplies initial terrain/water and
  brushes provide manual refinement.

## 4. Architecture

```text
ascii-engine/
├── START.md · AGENTS.md · CLAUDE.md
├── packages/engine/        @ascii-engine/core: pure TS + Three.js
├── packages/authoring/     atomic SceneDoc commands and schemas
├── apps/editor/            Vite editor (1440), Tauri 2 shell
├── apps/automation/        local HTTP/WebSocket bridge (1442), stdio MCP
├── reference/pomorog/      read-only docs, images and visual source
├── docs/showcase/          README presentation and feature videos
└── tools/video-edit/       independent recording/editing project
```

The **core** knows no game, UI or Tauri and runs in a browser:

- `engine.ts`: `createAsciiEngine`; `add`, `remove`, `setPartStyle`,
  `setInstanceStyle`, `setTypeStyle`, `setStyle`, `pick`, `render(dt)`;
  carpet, particle, water and rain creation, and `fx`.
- `surface.ts`: alpha IDs; `style.ts`: layered per-part styles;
  `ascii.ts`: screen pass with `AsciiPassHook`; `illumination.ts` /
  `exploration.ts`: local lighting/discovery.
- `techniques/`: screen, surface, skinned body, carpet, particle and
  glyph-reflecting water.
- `presets/`: Pomorog style/types, campfire heat grid, fireflies/lantern
  motes/running dust, combat, legacy marsh water and snow.
- `weather/`: rain/storm; `world/`: circuit, distance-loaded chunks,
  ripples, brush terrain and JSON scene/prefab/connector generation.
- `fx/`: data-driven effects, Pomorog recipes and ASCII flipbooks.
- `import/gltf.ts`: GLTF/GLB with `userData.glyph`.

The **editor** is both showcase and authoring tool: five areas in `src/areas/`,
reference scene, terrain authoring, effects, GLTF import, adjustments, per-part
selection and presets. Game content such as models, prefabs and hunt pacing
belongs in `src/pomorog/` / `src/scene/`, never the core. `game.json` next to
`index.html` turns it into an exported game's visual player.

Commands: `pnpm compare` compares screenshots with the baseline;
`pnpm export -- --title … --area …|--scene … [--desktop]` exports web/Tauri.

**Tauri** supplies filesystem/packaging features the browser lacks.
Develop and validate in the browser first (`pnpm dev`). Linux WebKitGTK
WebGL is slower than Chromium.

## 5. Phases and current state

Every phase ends with passing `pnpm check`, before/after evidence and an
entry in `docs/log.md`.

### Phase 1 — Extracted core

Port from `reference/pomorog/src-visual/`:

1. `surface.ts` and a `toFixed(2)` test.
2. Offscreen renderer with `DepthTexture`, draw order from visual-pipeline §2 /
   recreate-from-zero step 10, brightness/cell-size controls.
3. `ascii.ts`, direct pass-through for `glyph` materials. Remove biome imports
   such as `swampShoreGLSL`; biome features enter through hooks.
4. Independent local lighting module.
5. `worldGlyph.ts` → surface; `glyphBody.ts` → body; `grass.ts` → carpet;
   `glyphCloud.ts` → particle.
6. Initial engine API and `pomorog` preset.
7. Reference editor scene: surface floor/crate, body rock/crown, carpet grass,
   particle campfire and screen actor. Compare `orca-world-glyph.png` and
   `after-world-glyph-closeup.png`.

Complete when the reference scene matches approved captures and the core
imports no game-specific modules.

### State on 2026-10-11, presentation language update on 2026-10-12

**Visual authoring:** sandbox startup, hierarchy, transforms, parts,
duplicate/delete, undo/redo, IndexedDB draft, embedded GLTF/GLB and `SceneDoc`
export. Maps/items without terrain can be saved/reopened; library rain,
snow and effects compose documents. This closes basic persistence/authoring,
not every feature below. See the [editor guide](docs/guia-editor-visual.md)
and [examples](docs/examples/). Current scope is exportable visuals without
game rules/UI.

**Workspace:** Unity-inspired hierarchy left, scene center, inspector right,
library bottom. Drag/drop or click/place; W/E/R move/rotate/scale with
local/global axes and snap. O or Alt + drag orbits/tilts; right drag pans
with the mouse. Terrain/environment tabs are separate. Panels move,
resize, detach/dock at edges; localStorage stores layout separately from
scene data. Reset restores it. TransformControls draw in an editor-only
overlay outside the ASCII pipeline/exported document.

**Visual Studio:** dedicated effects/atmosphere pages with a large preview
and controls. Effects use disposable empty-space preview engines and pause
the map. Atmospheres expose exposure, glyph tint, lights/direction, shadows
and fog. Essential controls and templates simplify creation. Effects live
in `SceneDoc.effects`; named atmosphere assets in `SceneDoc.atmospheres`;
current lighting in `SceneDoc.style`. Click atmosphere assets to apply,
double-click to edit. Advanced JSON exposes heat, curves and flipbooks.
Layers have name, XYZ origin, gizmo and separate history; heat, particles
and trails respect saved offsets. Graphical timeline/curves remain pending.

**Water dynamics:** `world/waterDynamics.ts` integrates gravity-driven flow,
depth and impulses on a shallow-water grid. `waters[].physics` stores depth,
resistance, source and waves. Mesh/current/foam follow simulation; moving
objects/actors generate waves. Simulation stays inside the mask, without
volumetric fluid or rigid buoyancy. Planar mirrors cover calm regions;
highlights follow light/camera direction. `water.disturb` / MCP
`water_disturb` are transient; documents store recipes, not simulation time.

**Composition cameras:** named `SceneDoc.cameras` poses include XYZ radians,
orthographic span and aspect ratio. `activeCamera` selects preview/player/
export framing. Selection shows a live thumbnail using the same renderer
without double-stepping simulation. `applySceneCamera` is editor-independent.
Editor helper icons/view volumes/gizmos are excluded from the ASCII world.
Create from view, move/rotate, frame, duplicate/delete, undo/redo and
aspect-preserving camera view are supported. Perspective remains pending.

**Water/placement:** continuous water masks can stay level or follow terrain.
Coplanar water shares object reflections; horizontal mirrors are not applied
to steep faces. Placement previews use actual prefabs and support gizmo
adjustment before confirmation.

**Authoring API/MCP:** `packages/authoring` applies atomic commands to
`SceneDoc` without editor/renderer. The editor adapter provides revisions,
preview/accept/discard and shared history. `apps/automation` supplies local
HTTP/WebSocket on 1442 and stdio MCP. Vite starts the bridge; `pnpm api`
starts it separately. Catalog, parts, terrain, water, assets, effects,
atmosphere, weather, cameras, captures, import/export and full documents
are accessible. The core imports no adapters. See [API/MCP](docs/api-mcp.md)
and [ADR 0001](docs/decisions/0001-authoring-api.md).

**English project language:** the owner requested English UI, README,
technical documentation and presentation on 2026-10-12. Display labels
are separate from legacy prefab/preset IDs; existing documents remain
compatible. Preserve user-authored names and the original reference archive.
See [ADR 0002](docs/decisions/0002-project-language.md). Scripts/gameplay
components discussed as future work are not part of the current runtime.

The core validates documents in `world/validation.ts`, stores bounded
snapshots in `world/history.ts`, resolves embedded assets in `import/assets.ts`
and applies document precipitation through `weather/sceneWeather.ts`.
Pomorog object recipes remain in the editor; game consumers must supply
compatible libraries to `buildScene`.

**Earlier audit context:** phases 1–6 and 8 had initial implementations and
five code-built areas. That did not satisfy editor-based authoring. Scene
creation, asset/style persistence and cross-system integration were incomplete,
not merely awaiting aesthetic approval. Findings/priorities are in the
[2026-10-11 audit](docs/relatorio-engine-2026-10-11.md). The recommended milestone
was create, customize parts, import, save, reopen identically and export;
first fix persistence, prefab seeds, validation and resource disposal.

Historical `pnpm check` and six baseline comparisons passed; sandbox was
captured in Orca Browser. Full Pomorog equivalence remains pending. Desktop
has historical build evidence but no validated execution. Phase 7 requires
authorization in the game repository. See `docs/log.md` for implementation history.

### Actual order: vertical milestones per area

The phases below describe **systems**. Execute per §1.1 area: after phase 1,
each area is an end-to-end slice with its minimum terrain/brush, water,
chunks, effects, per-part adjustments and save/load features. Grow systems
with each area. Dark Forest is the first proof of the workflow.

### Phase 2 — Water, reflection, weather and fire

Faithfully port glyph water/reflection, water shapes, legacy marsh water,
rain rings, snow, campfire heat grid and combat effects. Water becomes a
configurable component (§3.2); effects become data (§3.3). Existing Pomorog
features supply initial presets rather than biome-bound implementations.

### Phase 3 — Import

GLTF/GLB with `userData.glyph` Blender properties, defaults when unmarked,
and skinned `body` letters sampled from bones. GLTF animations play normally.
Every named node becomes a styleable part (§3.1).

### Phase 4 — Adjustment editor

Live controls from visual-pipeline §16, layered per-part selection,
JSON presets, screenshots and automated image comparison.

### Phase 5 — Scenes and chunks

Build worlds from reusable scene **chunks**, as in Pomorog's forest circuit:

1. **Prefab:** reusable saved composition, e.g. campfire with logs/effect/light/
   sound, or bridge with boards/ropes/water. Editing updates instances;
   individual copies may override part styles.
2. **Chunk:** scene prefab with size, terrain, water, cover, objects, lights,
   effects and edge **connectors** for trails/streams/vegetation. Library
   metadata includes biome and rarity.
3. **Scene:** grid or circuit, placed manually or generated by matching
   connectors, seed, weights and fixed chunks such as the camp. Generated
   results remain editable/saveable.
4. **Distance loading:** load nearby chunks, unload distant ones; already
   used by the forest circuit.
5. **Chunk/scene editor:** placement, rotation, scale, duplicate, grouping,
   undo/redo and terrain brushes (§3.4); sculpt, paint, scatter, dig lakes,
   trace rivers/paths. Automatic neighbor seams for height/ground/water/trails.
6. **Scene environment:** rain, snow, night/moonlight, fog and local lights.

Save prefab, chunk and scene data as JSON, loadable without the editor.

### Phase 6 — Effects system

Implement §3.3 with glyph visuals: emitter editing, timeline/live preview,
imported sprite/GIF/video/animated GLTF, triggers and attachment points.
Pomorog campfire, hits/claws, lightning, ice, aura, dissolve, dust and spawn
recipes serve as fidelity tests.

### Phase 7 — Pomorog consumes the engine

The game imports `@ascii-engine/core`. Approved screenshots must remain
identical to prove faithful extraction. Work only with owner authorization
in the Pomorog repository.

### Phase 8 — Export

Package scenes/games for web and Tauri desktop; Android/iOS follow.

## 6. Commands

```bash
pnpm install
pnpm dev                 # editor: http://localhost:1440
pnpm check               # typecheck + tests + build
pnpm tauri dev           # desktop editor
node scripts/preview-readme.mjs  # local README/video preview: localhost:4178
```

Headless captures: `.claude/skills/pomorog-ascii-visual/scripts/cdpshot.mjs`
(Chromium with GPU and `--use-angle=gl`). Validate in **Orca Browser** too.
