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

| Area (game id)                        | Required engine features                                                                        |
| ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Dark Forest (`dark_forest`)           | circuit chunks, terrain, reflected lake/stream, bridge, `body` crowns, `carpet` grass, campfire |
| Rain Marsh (`rain_marsh`)             | legacy marsh water, rain with `\|_____\|` rings, wetland trees, shores                          |
| Snow Pines (`snow_pines`)             | snowy floor, falling snow, branch snow, pines                                                   |
| Old Mine (`old_mine`)                 | dark interior revealed by light, tracks, beams, copper veins, rocks                             |
| Sunken Cathedral (`sunken_cathedral`) | `surface` construction, reflected water, interior lighting                                      |

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

| `GlyphKind` | Technique                                                | Pomorog examples                         | Origin                                |
| ----------- | -------------------------------------------------------- | ---------------------------------------- | ------------------------------------- |
| `screen`    | per-cell screen pass, actor alphabet                     | hero                                     | `ascii.ts`, `actorInk.ts`             |
| `surface`   | local glyph grid injected into materials, six steps      | floor, bridge, buildings, crate, trunk   | `worldGlyph.ts`                       |
| `body`      | open glyph sprite cloud or dark occluder                 | crowns, rocks, creatures                 | `glyphBody.ts`                        |
| `carpet`    | upright instanced letters, biome recipes                 | grass, ground cover                      | `grass.ts`, `groundCover.ts`          |
| `particle`  | free glyphs                                              | heat-grid fire, sparks, rain, snow, hits | `glyphCloud.ts`, `effects.ts`         |
| `water`     | glyph water with planar reflections converted to letters | lakes, streams                           | `worldGlyph.ts`, `waterReflection.ts` |

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
  `global preset → object type → part type → model declarations → authored type fields
→ object texture → instance → part texture → instance part`.
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

Imported model appearances are editable defaults, including Blender custom
properties. Editor global/type/instance styles can override them. Named
groups and meshes are part boundaries; an undivided mesh is not automatically
segmented into semantic parts. `GlyphStyle.size` controls surface cells and
body base size in metres; `color` optionally overrides the model's RGB colour.
The inspector reports effective appearance and per-field sources. Edit letters opens
Texture Studio on the selected part/object; its Apply to selector writes only changed
fields to part, object, shared asset/type or global style, preserving mixed techniques.
Linking a saved texture removes the local fields defined by that recipe at the
linked level; an object link also clears those fields in parts without their own
link. The editor reports replaced fields. Other overrides stay intact. Part links
win over object-wide fields. Detach bakes these layers without changing appearance.
`linkTexture` is the shared core operation; `setInstanceOptions` replaces the whole
instance layer so removed overrides do not survive a merge.

Optional type authored field masks promote explicit editor choices above procedural
node declarations; absent masks retain legacy document ordering.

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
- `config.ts`: renderer settings and content-free defaults. Consumers supply
  object types and effect recipes explicitly through engine options.
- `presets/`: optional Pomorog appearance, water, campfire and ambient recipes.
  `@ascii-engine/core/pomorog` is the official alias for this content pack;
  `/presets` exposes the same API for compatibility.
- `weather/`: rain/storm; `world/`: circuit, distance-loaded chunks,
  ripples, brush terrain and JSON scene/prefab/connector generation.
- `fx/`: data-driven effects, Pomorog recipes and ASCII flipbooks.
- `import/gltf.ts`: GLTF/GLB with `userData.glyph`.

The **editor** is both showcase and authoring tool: five areas in `src/areas/`,
reference scene, terrain authoring, effects, GLTF import, adjustments, per-part
selection and presets. Game content such as models, prefabs and hunt pacing
belongs in `src/pomorog/` / `src/scene/`, never the core. `game.json` next to
`index.html` turns it into an exported game's visual player.

`apps/editor/src/engine.ts` supplies the approved Pomorog appearance and
effect library to both the main renderer and isolated previews. Combat timing,
hero/foe feedback, marsh foot/body contacts and snow track policy live in
`apps/editor/src/pomorog/`. Generic heat-grid data, water defaults and snow
particle samples remain in the core, with their established numerical values.
`DEFAULT_WATER_LOOK` and `DEFAULT_HEAT_GRID` are independent of the mutable
optional `FOREST_WATER` and `POMOROG_FIRE` preset copies.

Public package entries: `@ascii-engine/core` for the renderer and shared
settings, `/techniques`, `/world`, `/fx`, and optional `/presets` / `/pomorog`.
The root preserves generic exports; optional presets now require their
explicit entry. `@ascii-engine/authoring/schema` exposes the transport contract
without loading document/renderer implementations. Vite imports the development
bridge through `@ascii-engine/automation/bridge`. See
[ADR 0003](docs/decisions/0003-package-boundaries.md).

Sandbox document/history coordination lives in areas/sandbox.ts. Its editor
modules in editor/sandbox/ own library cards, hierarchy, object inspector,
terrain painting, Studio callbacks, file operations and pointer/keyboard input.
A typed context exposes live scene references and document/history operations;
modules do not own a second document or persistence path.

File separates Open map (replace) from Import into this map (items, models,
texture and atmosphere JSON). Save retains the portable document; Export opens
Web, native desktop or Pomorog targets. Web/desktop jobs use the loopback bridge
and the existing export CLI, with status/downloads and the same operations via
MCP. Jobs capture a revision and run in sequence; no publication occurs.
Pure file routing/item remapping now has editor unit coverage in pnpm check.
Water name/visibility are optional SceneDoc fields; XYZ maps to shape.x/level/z.
Terrain owns the water brush, the scene toolbar owns object erasing, and
Environment exposes the existing weather intensity.

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

**Visual Studio:** dedicated Effects, Atmosphere and Textures pages with a large preview
and controls. Effects use disposable empty-space preview engines and pause
the map. Atmospheres expose exposure, glyph tint, lights/direction, shadows
and fog. Essential controls and templates simplify creation. Effects live
in `SceneDoc.effects`; named atmosphere assets in `SceneDoc.atmospheres`;
current lighting in `SceneDoc.style`. Click texture/atmosphere assets to select; double-click to edit. Atmospheres
have an explicit Apply action; drag textures onto objects/parts to link. Advanced JSON exposes heat, curves and flipbooks.
Layers have name, XYZ origin, gizmo and separate history; heat, particles
and trails respect saved offsets. Graphical timeline/curves remain pending.

**Texture Studio:** select a placed object or named part and adjust its
letters in an isolated, disposable preview. Custom alphabets (up to 128 single Unicode characters), fonts/weight,
world size, spacing, rotation, density, RGB/palettes, ink strength, contrast,
light threshold and shadow levels work for surface/body glyphs. Letters-only
visibility removes solid occluders; body face visibility is explicit. Material
lighting supports scene response, uniform local shading and self light.
Preview lighting chooses the current scene, a built-in preset or a saved
atmosphere from the same catalog as Environment and Atmosphere Studio. Lights
are edited in Atmosphere Studio only; its header says Editing the live map.
Textures/Effects explicitly show Isolated preview / map paused. Legacy preview
lighting snapshots stay readable and can be saved as atmosphere assets once.
New texture recipes use black gaps; unmodified scenes retain Pomorog defaults.
Apply writes the selected scope with scene undo; saved recipes link to objects
and parts below local overrides. Saving an asset updates its users; Detach bakes
the current appearance into local fields. Old copied styles remain independent.
Texture Studio has its own undo/redo and portable .texture.json import/export.
texture.define/apply/detach expose resources through the authoring API. Optional
TextureAsset.previewLighting stores the selected preview snapshot; applying a
texture preserves map lighting. Font families use the viewing device's
installed fonts and fallbacks; font files are not embedded.

**Shared editor glyph catalog (consolidation stage 1):**
`src/editor/glyphCatalog.ts` supplies family/part/layer display labels,
technique-specific size defaults, alphabet lookup and model-color inspection
to the inspector and Texture Studio. Terrain labels use the same catalog;
legacy scene identifiers stay unchanged. This stage changes no document format
or renderer defaults. The appearance controls and lighting/file workflows remain
available until their later consolidation stages.

**View-only Display (consolidation stage 2):** zoom, rotation, live debug
post-pass mode, pause and PNG capture are session state. Exposure and screen
cell size are edited in Atmosphere; style preset files use the File menu.
The toolbar and Display share a pause controller. Screen grid is explicitly
a debug post-pass, never an authored style or exported document setting.

**Water dynamics:** `world/waterDynamics.ts` integrates gravity-driven flow,
depth and impulses on a shallow-water grid. `waters[].physics` stores depth,
resistance, source and waves. Mesh/current/foam follow simulation; moving
objects/actors generate waves. Simulation stays inside the mask, without
volumetric fluid or rigid buoyancy. Planar mirrors cover calm regions;
highlights follow light/camera direction. `water.disturb` / MCP
`water_disturb` are transient; documents store recipes, not simulation time.

**Component letters (consolidation stage 6):** water inspector exposes custom
water/foam/reflection alphabets/fonts, density through row sparsity, depth colors,
bank and reflection controls, and optional transient impact/rain glyph rings.
Terrain layers own optional surface `look` and standing-letter `cover` recipes;
Terrain edits alphabets/fonts, size, colors, palettes, ink and wind. Floor glyphs
follow dominant painted triangles in at most four material groups; vertex colors
still blend. Cover color/font edits preserve legacy distribution and dimensions.
Omitted looks keep original shaders/atlases and seeded recipes exactly. Stable
layer IDs remain unchanged. Water inspector and shared letter controls live in
editor modules; sandbox retains document/history coordination. `terrain.layer`
and `water.update` expose the same fields through authoring/MCP.

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

**Public presentation:** the README and Pages gallery include seven chapters,
including the English Texture Studio walkthrough, plus the supported AI/MCP
workflow. `scripts/preview-readme.mjs --github-pages --generate-only` generates
both `docs/index.html` and `docs/watch.html` from the README. GitHub Actions
publishes the gallery and five map demos at `/ascii-engine/sandbox/` on main
pushes. The public menu contains only Dark Forest, Rain Marsh, Snow Pines,
Old Mine and Sunken Cathedral, with camera, letter/light and capture controls.
The gallery embeds one responsive viewer with five map buttons. Switching a
button changes only the iframe. Its `embed=1` URL hides the duplicate area row;
camera, letter/light, pause and capture controls remain. A current-map link
opens the standalone five-map viewer separately. README map links
remain usable on GitHub, where interactive frames are not rendered.
Authoring URLs fall back to Dark Forest. Scene editing, file import, per-object
selection and the authoring API belong to the local editor.
`pnpm pages:build` assembles tracked docs and the public build in ignored
`.cache/pages`. `scripts/publish-pages.mjs` publishes it to the `gh-pages`
hosting branch with an isolated Git index and regular pushes; generated bundles
stay out of main. Pages serves that branch at its root. This branch-based
publication avoids a stale completed deployment blocking the artifact API.
The public build skips the local MCP bridge and optional exported-game probe.
Local development and exported players retain their setup. New MP4 footage
is generated in `.cache/showcase` and hosted as a release asset; its short GIF
and validation screenshots remain in the repository. Historical media is
preserved. See [showcase workflow](docs/showcase/README.md).

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
pnpm format              # format versioned source, configuration and documentation
pnpm format:check        # check formatting without writing
pnpm check               # formatting + package boundaries + typecheck + tests + build
pnpm bench --round=round-1 # fixed-step CPU/GPU study; repeat with round-2
pnpm bench --uncapped --round=uncapped-round-1 # repeat with uncapped-round-2
pnpm bench:report         # summarize uncapped rounds and bottlenecks; stop before Phase 2
pnpm tauri dev           # desktop editor
node scripts/preview-readme.mjs  # local README/video preview: localhost:4178
```

`pnpm check` also enforces package import direction and checks that generic
renderer entries cannot reach optional presets or application code.

Prettier is pinned in the workspace and uses a 100-column print width, two-space
indentation, single quotes and no optional semicolons. Print width is a wrapping
target, not a hard limit for strings, comments or template literals; embedded
shader/HTML strings retain their contents. See [Prettier's print-width guide](https://prettier.io/docs/options#print-width).
Formatting commands select Git-versioned files so untracked drafts are left
alone; add new source files to Git before checking them. `.prettierignore`
excludes the read-only reference archive, generated output, captured evidence,
scene fixtures and generated lockfiles. Review formatting separately from
behavior changes. The mechanical formatting commit is listed in
`.git-blame-ignore-revs`; use `git blame --ignore-revs-file .git-blame-ignore-revs`
or set `git config blame.ignoreRevsFile .git-blame-ignore-revs` locally.

Headless captures: `.claude/skills/pomorog-ascii-visual/scripts/cdpshot.mjs`
(Chromium with GPU and `--use-angle=gl`). Validate in **Orca Browser** too.

Display debug modes use engine.setRenderMode in every area, preserving authored
techniques. `?ascii=debug-screen` selects the screen-grid diagnostic. Historical
recipes are explicit Legacy screen comparison (`?ascii=legacy-screen`);
`?ascii=screen` stays a compatibility alias outside the sandbox. AreaOptions
legacyScreenComparison names that recipe; screen remains a deprecated alias.
The current pnpm compare views use default glyphs, with no ascii=screen flag.
Entering/leaving legacy comparison rebuilds its recipe; normal debug switches
remain live and never write scene appearance.

The opt-in study routes `/?bench=water`, `/?bench=particles` and
`/?bench=skinning` use a separate benchmark entry in the dev server, not the
sandbox. They never load its IndexedDB draft or authoring adapters. Each fresh
page advances by exactly 1/60 s when `benchmark.run(warmup, frames)` is called;
the ordinary editor clock and published builds are unchanged. Only these
benchmark documents receive isolation headers for high-resolution timers.

Core `createAsciiEngine(canvas, { profiling: true })` exposes `engine.stats`:
CPU sections, summed render draw calls and asynchronous GPU elapsed queries.
Profiling is disabled by default, with no clocks/queries created. Water step
and CPU texture/geometry preparation are separate; actual GPU transfer/submission
belongs to the remaining render. Skinning measures vertex math, with scene-graph
preparation left in the remainder. GPU ranges overlap CPU work; do not add them.

`pnpm bench` uses 1920×1080 at DPR 1, 600 warm-up and 600 measured frames on five
fresh loads per scene, serially. Results, environment and raw samples go under
`docs/captures/benchmarks-<date>/<round>/`; existing rounds are not overwritten.
`pnpm bench --verify --out=.cache/bench-study` checks exact state/visual parity
with profiling on/off and forbids IndexedDB calls. The report applies the
owner-confirmed [ADR 0004](docs/decisions/0004-webassembly-for-simulation.md),
which remains Proposed. Phase 2 now evaluates optimized JS and optional offscreen
water scheduling; WASM/GPU alternatives remain outside the authorized work.

The Phase 1 methodology amendment adds `--uncapped`, launching Chromium with
`--disable-gpu-vsync --disable-frame-rate-limit` while keeping fixed simulation
steps. Default capture/editor flags are unchanged. The report now requires the
two uncapped rounds; prior paced measurements remain as presentation context in
vsync-report.md. Qualification considers CPU/GPU dominance and the uncapped frame,
not just the active CPU fraction. CPU savings in a GPU-limited scene do not count
as measured frame gains. Phase 1 raw data retain the original JS implementation.
The uncapped harness bounds in-flight GPU frames to two through nonblocking
WebGL fences, keeping CPU/GPU overlap while preventing a queue of uncompleted
frames from being mistaken for throughput. It also reports observed completion
intervals, latency and scheduler overhead; GPU work drains before each run ends.
Uncapped render steps use free-running MessageChannel tasks, independent of rAF
compositor cadence; ordinary editor and paced benchmark retain rAF. Unsupported
rAF cadence in task mode is recorded as null. Earlier failed submission/rAF
experiments remain as diagnostic evidence; the report requires the task mode.

Phase 2 skins distinct source vertices once per body, caches double-precision
bone matrices and writes letter positions/normals directly to float32 arrays.
Interleaved/normalized attributes and custom mesh methods retain Three semantics
through a cached source-vertex fallback. Fixed-step array and image parity are
checked with scripts/verify-simulation.mjs against the preserved original core.
`/?bench=water-scale&waters=1|2|4|8&queue=2` adds a seeded large-map fixture
(one visible 129×129 water, others 64 m apart). `pnpm bench --uncapped
--scenes=skinning,water-scale-8-off` selects workloads without changing the
Phase 1 defaults. Phase 2 evidence is retained in the dated capture directory.

`createAsciiEngine(canvas, { offscreenWater: { mode: 'pause', margin: 4 } })`
opts into camera-dependent scheduling. The default remains absent/update-all.
A water's entire world-space bounding sphere must miss the frustum enlarged
by 4 metres before engine-driven integration, geometry/texture preparation and
actor contacts skip. Bounds are conservative and include parent transforms.
On return it advances only the current dt, with no catch-up; visible waters
retain identical states and images. Shader/ring clocks continue globally, so
wind phase can jump on return. Explicit rain/disturb/refresh API calls still
modify hidden waters. Paused/offscreen simulation therefore depends on camera
history and external calls. This runtime policy is not stored in SceneDoc,
not enabled in the editor/player and not suitable as an implicit deterministic
v0.2 default. Enabling it by default requires the owner's separate decision.

`pnpm bench --uncapped --renderer-cpu=6` optionally pins only the main thread
of the active benchmark page to a P core. A 150 ms CPU probe identifies the
executing renderer before warm-up; it advances no simulation state. Spares
and extensions are excluded. /proc verifies the applied mask and unchanged
masks on existing non-main threads. GPU/browser processes and machine power
settings stay unchanged; no affinity is applied unless requested. Phase 2
water follow-up controls observed P/E migration. Failed unpinned rounds and
a stopped spare-affinity attempt remain as diagnostics. The default editor
clock, simulation, frame counts and acceptance thresholds are unchanged.

`--fresh-browser` starts a new Chromium process and temporary profile for each
execution instead of reusing one process across fresh scene pages. Phase 2
water measurements pair this with active-page CPU affinity: a fixed-CPU
1→2→1-water diagnostic still changed the one-water step cost, while a new
process returned it near its initial value. This avoids cross-variant browser
history; it does not identify JIT/GC/thermal/driver effects individually.
Process IDs/generations and the isolation policy are recorded per run. The
default runner behavior remains available for Phase 1 reproduction.

`--no-extensions` disables system/user and component extension background pages
for the owned benchmark Chromium, and checks that no extension target exists
before/after measured runs. It does not edit browser/system configuration.
A fresh temporary profile alone can still load distro-installed extensions.
Phase 2 water measurements additionally block by map size: two five-run rounds
per off/pause pair, reversing their order in round 2. Counts, fixed dt, GPU queue
and the 5% full-frame repeatability gate remain unchanged. Earlier failed
full-matrix rounds remain in extension-background-diagnostic/.
