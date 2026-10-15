# ASCII Engine audit — 2026-10-11

> Later update: the main persistence, seed, disposal and basic authoring
> issues were addressed. See the [visual editor guide](guia-editor-visual.md)
> and [validation log](log.md). This report preserves the earlier state.

**Diagnosis at audit time:** a substantial working ASCII graphics core and
five Pomorog demos existed. The editor remained a tools prototype that did
not reliably close create → edit → save → reopen → export for an original
game. The existing base was worth continuing.

Audit of `ed2d4f3` using code review, `pnpm check`, visual comparison,
new captures and browser probes. This stage changed documentation/evidence;
implementation findings below were still open then. `reference/` remained
unchanged.

## Stopping point

The last commit added player mode and web/desktop export. Earlier stages
added effects, terrain/scenes, per-part selection, GLTF, combat and five
areas. The previous log described phases 1–6 and 8 as implemented while
listing outstanding work that prevented calling them complete.

The owner's criterion in `START.md` is **authoring all five areas through
the editor** at Pomorog quality. Selecting/watching those areas was possible;
their construction lived in TypeScript under
[`apps/editor/src/areas/`](../apps/editor/src/areas/). That did not prove users
could build equivalent areas through the tools.

Phase 7, integration back into Pomorog, had not happened. Its purpose is
proving a real game can consume the extracted core.

## Working and partial systems

| System          | Existing evidence                                                                                    | Limitation at audit time                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| ASCII rendering | Six techniques: screen, surface, body, carpet, particle, water; lighting, shadows, depth/reflections | Narrow per-part alphabet/spacing/finish API                                                                                        |
| Pomorog content | Forest, marsh, snow, mine, cathedral; ported models/weather/fire/combat                              | Code-built areas; final visual equivalence unapproved                                                                              |
| Per-part style  | Selection/highlight, technique/family/body size and global/type/instance/part layers                 | Selection edits not collected by scene saving                                                                                      |
| GLTF/GLB        | Reader, Blender properties, animations/skinned glyphs; demo round-trips two GLBs                     | No persistent assets; imports outside SceneDoc; Three-exporter tests rather than production Blender files                          |
| Terrain         | Raise/lower/smooth/flatten/paint/dig; JSON heightmap                                                 | One finite area, no undo, chunk seams, drawn rivers/paths or advanced brushes; painting changes color/density, not layer technique |
| Prefabs/scenes  | Eight prefabs, place/remove, terrain/water/JSON/local storage                                        | Code-defined library, no prefab editing/saving or UI transforms; some prefabs vary after reopen                                    |
| Chunks          | Circuit, distance streaming, deterministic connector generator                                       | Grid generator tested separately, not integrated into scene editor                                                                 |
| Effects         | Emitters, bursts, data curves, light, attachment, budget, flipbooks/presets                          | JSON editor, no visual curves/audio/full event triggers or scene effect persistence                                                |
| Export          | Web script with game.json and player mode without main panels                                        | Known app content rather than complete project/asset packaging; desktop only historical compilation                                |
| Quality         | 25 core tests, TypeScript/build and six visual comparisons passed                                    | No editor automation, save/reopen/import/export or long-session checks                                                             |

The editor uses Vite + TypeScript + DOM, without React. Tauri was a minimal
shell without native file commands. The core imported no editor, React,
Tauri or game runtime. Pomorog defaults remained in `engine.ts` and the
effect system; preset separation existed but neutral configuration could
still improve.

## Authoring experience gaps

Startup opened a demo. The area selector mixed maps, editable scene,
effects and technical tests. No project unified scenes, assets, prefabs,
effects and configuration. Area changes reloaded the page; features were
separate without a central document representing all work.

Sandbox lacked hierarchy, transform controls, duplicate/grouping,
undo/redo and free terrain navigation. Its camera orbited/zoomed around
a fixed focus. The effect panel overlapped the main panel at 1600×757.
These usability issues mattered more than adding another graphics technique.

The exported player reproduced an area/scene. Forest encounters in
[`encounters.ts`](../apps/editor/src/areas/encounters.ts) were scripted, not
an extensible character/collision/navigation/combat/progression runtime.
Pomorog rules belong in the game; the core needs enough integration to
receive its events/states.

## Concrete findings

### 1. Scene saving loses appearance changes — critical

Real API reproduction in isolated Chromium:

- Create a tree through `buildScene`; set instance crown size to .31,
  type crown size to .29 and brightness to .8.
- `toJSON()` leaves `objects[0].options` and `style` absent.
- Reopen: instance override is missing and type size returns to library .19.

[`world/scene.ts`](../packages/engine/src/world/scene.ts) returned the original
document plus updated terrain without reading current engine styles.
`buildScene` also applied `doc.style` before registering prefab defaults,
which could overwrite saved type styles. Panel changes went directly to
the engine without updating the document.

**Acceptance:** edit every style layer, save and reload in a new session
with identical values and appearance.

### 2. Imported objects are absent from saved scenes — critical

Code flow confirmed that [`main.ts`](../apps/editor/src/main.ts) kept models
in `imported`; `importFile` added them directly to the engine. Sandbox
saving only knew `buildScene` objects. SceneDoc lacked catalog/model references.

A GLB could animate on screen without entering the saved file/exported game.
Local GLTF import also lacked companion `.bin`/texture selection/resolution.
That needs real assets; the demo covered GLB.

**Acceptance:** import a GLB, place/customize parts, close/reopen and export,
preserving the model, resources and animation.

### 3. The same document can produce a different tree — high

Two builds of the same document had different mesh positions/scales/matrices.
[`prefabs.ts`](../apps/editor/src/scene/prefabs.ts) used `Math.random()` for
trees, rocks and log mushrooms without storing instance seeds.

**Acceptance:** retain each instance's seed/construction parameters;
geometry must repeat on load and export.

### 4. Opening unsuitable documents can break editing — high

`createSandbox(engine, { scene: emptyScene() })` threw
`TypeError: Cannot read properties of undefined (reading 'data')`.
The core allows terrain-free scenes, but editor controls assumed
`scene.terrain!`.

`reload` also disposed of the current scene before constructing its
replacement. Unknown prefabs/invalid data could fail after the previous
scene was removed. This second conclusion came from code review,
not a UI recovery test.

**Acceptance:** validate document/version before replacement; preserve
current content on failure with a readable error; support valid terrain-free scenes.

### 5. Removing layers does not stop all work — high

Probe: create/add a carpet, remove with `{ dispose: true }`, instrument
its update and render. The removed carpet received another update;
`engine.remove` did not clear the internal `carpets` array.

Regrow grass repeated create/remove. Cloud/rain registries also deserved
review. Carpet retention was confirmed; cumulative memory/FPS impact was
not measured.

**Acceptance:** repeated creation/removal/regrowth must not increase active
layer count or keep updating disposed layers.

### 6. Visual evidence is not product acceptance

`pnpm compare` compares the engine against its own earlier screenshots.
It detects regressions rather than automatic Pomorog/engine equivalence.
Marsh allows normalized error up to .20 because rain varies.

Screenshots confirmed broad identity and techniques: glyph cover, open
crowns, surface buildings, legacy hero pass and snow/marsh exceptions.
Camera/time/resolution were not exactly aligned with original Pomorog.
Occluder clipping, actor labels and imported-model finish remained pending.
The GLTF demo serpent had an apparent continuous silhouette and needed
close inspection against the “body made of letters” criterion.

## Recommended order

| Order | Deliverable                                                                      | Completion proof                                                                                    |
| ----- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1     | Reliable saving/reopening: styles, seeds, validation, disposal                   | Same edited scene in a fresh session; invalid files preserve current scene; no retained layers      |
| 2     | Authorable scene: persistent assets, hierarchy, transforms, duplicate, undo/redo | Build a clearing with tree, bridge, lake and imported model; save/export without editing TypeScript |
| 3     | Unified scenes/prefabs/effects project                                           | Load all data/assets; prefab edits update copies while retaining overrides                          |
| 4     | Forest authorable through editor                                                 | Document supplies chunks/connectors/environment; edited map matches player map                      |
| 5     | Repeat across the other four areas                                               | Marsh/snow/mine/cathedral use shared systems and are compared with Pomorog                          |
| 6     | Pomorog consumption/distribution                                                 | API-driven game events/animation/effects; validate desktop execution after web                      |

The first useful milestone: **build a scene, customize crown/trunk, add
an external model, save, close, reopen identically and export**. It uses
existing work while exposing missing connections.

Sea, waterfall, erosion, graphical curves and more effects can follow.
Game rules do not need to enter `packages/engine` to reach this milestone.

## Audit validation

| Check        | Result                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| pnpm check   | TypeScript, 25 tests in 7 files, build passed                                                          |
| Editor       | Test script only reported no tests yet                                                                 |
| Web build    | 62 modules; main JS 896.18 kB / gzip 256.65 kB; >500 kB warning                                        |
| pnpm compare | Reference .0000, forest .0095, marsh .0272, snow .0041, mine .0134, cathedral .0088; all within limits |
| cdpshot.mjs  | Sandbox/GLTF/effects ready=true; swim clip and live effect emitters/glyphs                             |
| Orca Browser | Sandbox opened, controls inspected, valid screenshot                                                   |
| CDP probes   | Reproduced lost styles, variable geometry, removed carpet updates and terrain-free scene error         |

New captures: [`captures/auditoria-2026-10-11/`](captures/auditoria-2026-10-11/).
The [evidence record](captures/auditoria-2026-10-11/README.md) contains URLs,
image provenance, web export and probe reproduction.

Frozen headless views reached 60 FPS; this is **not a game benchmark**.
Orca showed a lower/variable rate without an isolated cause measurement.
Desktop execution, mobile, long sessions, every flipbook format,
production GLBs and Pomorog integration were not validated.

## Next-session documentation

Use `START.md`, `AGENTS.md`, this report and `docs/log.md`.
The global `ascii-engine-workflow` skill still cited nonexistent
`specs/project/`, ADRs and “Milestone 1”, and suggested push on completion
while local rules require an owner request. Those passages did not describe
this checkout. The current plan lives in START; nothing was pushed or
published during this audit.
