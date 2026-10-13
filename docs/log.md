# Development log

Entries describe the state at each stage. Earlier limitations may have been
resolved later; START.md and the editor guide describe the current scope.
Historical filenames, reference IDs and captured interfaces are preserved.

## 2026-10-13 — Imported model appearance and named parts

The owner reported that imported GLTF appearance/letter-size controls did not
work and asked whether a tree's crown and trunk must be separated in the file.
Reproduced with pretzel.gltf, piramide.gltf and esfera.gltf from Downloads.
Each contains one mesh and material. The surface size field saved .12/.40 but
produced identical pixels; letter family and technique changes already worked
after Apply. Imported models had no editable shared type.

- Surface shaders and their material/program caches now include world cell
  size. Body sizes retain the original Pomorog multipliers/defaults.
- Added optional GlyphStyle.color, with RGB validation and a color picker/model
  color reset. Renamed Material to Glyph family and show the selected letters:
  selecting Wood changes letters, while Color recolors the model's ink.
- Inspector reads resolved descendant styles, shows mixed techniques, and
  applies only edited fields. Whole-tree size/color edits preserve separate
  crown/body and trunk/surface techniques. Clicking a part selects its named
  group rather than just the hit leaf mesh.
- Imported assets register a shared editable type. Their inferred and Blender
  authored appearance is an initial default below editor layers; type/global
  changes reach imports, while instance/part overrides remain more specific.
- Import assigns unique IDs. Previously, after deleting objects, a newly
  imported object could collide with a retained object-N ID and be rejected.
- Updated START, editor guide and live API/style descriptions. Named groups
  and meshes are the supported part boundaries. No semantic face segmentation
  is inferred from an undivided mesh; Blender glyph extras are optional.

Validation: pnpm check passed (**81 tests**, types/build), full
pnpm verify:authoring passed, and pnpm verify:gltf passed with all three real
files plus a generated GLTF tree with two leaves under a named crown group.
Checks cover changed rendered pixels, family/body/color/reset, shared types,
instance isolation, undo/redo, reopen, named-group mouse selection and import
after deletion. No runtime/shader errors. Orca imported and exercised the real
files in an isolated profile and verified both crown leaves separately from
the trunk. The owner's normal browser draft was preserved.

Evidence: [GLTF appearance captures](captures/gltf-appearance-2026-10-13/README.md),
including Orca before/after, Chromium interaction captures, cdpshot and logs.
Later Orca screenshots timed out because the embedded page did not draw a
frame; DOM/runtime checks still succeeded. Tree screenshot evidence is from
GPU Chromium, with a separate Orca runtime result.

Historical pnpm compare exceeds .04 for reference/forest/snow/cathedral in
this environment. A separate read-only HEAD snapshot reproduced those failures.
Controlled before/after differences are below .01 for all six default scenes
(reference exactly zero); the initial forest capture under concurrent GPU
load was repeated sequentially. Historical baselines were not updated.

Outstanding: custom per-part alphabets, independent spacing, ink/gap/shadow
controls and semantic face splitting remain outside this inspector. Material
slot-specific editing and arbitrary external/decoder-dependent GLTFs have not
been validated. Native desktop execution remains unverified. The owner
subsequently authorized committing this validated stage and pushing it to main.

## 2026-10-12 — Animated README previews and public video gallery

The owner reported that repository MP4 links and PNG thumbnails did not show
motion in the GitHub README. Replaced them with seven GIF previews extracted
from existing footage: animated opening plus one excerpt per feature.

- Each GIF: 4 seconds, 8 fps, 32 distinct frames, infinite loop; 720 px hero
  or 800 px chapter width, 128 colors, below 5 MiB. Full MP4s are unchanged.
- Chapter previews link to a native-player gallery at
  https://joaovrmoraes.github.io/ascii-engine/watch.html. Generated docs/watch.html
  has project-relative media paths and a GitHub link; .nojekyll supports
  branch-based Pages publication from main:/docs.
- Added scripts/prepare-showcase-gifs.mjs and a GitHub Pages mode to the README
  renderer. Local preview serves GIF with image/gif and still exposes six
  native video players. Explicit download links replace misleading watch links.
- Validated syntax, exact GIF frame counts, unique-frame hashes/full decoding,
  screenshots and browser loading. GitHub-rendered Markdown includes seven
  GIF images. Evidence: [readme-gifs captures](captures/readme-gifs-2026-10-12/README.md).
- Publication verified: seven GIFs loaded in the actual GitHub README,
  rendered screenshot pairs changed, Pages build succeeded, and all six full
  videos played at 1920×1080 from the public URL. Streaming responds 206 for
  byte-range GET. Public playback used isolated Chromium software decoding
  after headless hardware decoding failed; no system settings changed.
- Rendering/engine code, shaders, source footage, reference archive and
  comparison baselines unchanged. Prior 79-test validation remains applicable;
  verification here targets the new media and presentation paths.

## 2026-10-12 — Public repository and initial publication

The owner explicitly authorized committing and publishing the project as a
public GitHub repository after the README review.

- Created [joaovrmoraes/ascii-engine](https://github.com/joaovrmoraes/ascii-engine)
  with public visibility and configured it as the local origin remote.
- Initial publication targets main, preserving the existing project history.
  The task branch contains the English editor/documentation, six re-edited
  feature videos, posters, example scene and local README gallery.
- Reused the completed validation from the presentation stage: 79 tests,
  types/build, authoring/composition/API integration, six visual comparisons,
  Remotion type checks and actual playback of all six videos in Orca.
- git diff --check passed. No source changes were needed for publication;
  temporary browser capture profiles are excluded from Git. reference/ and
  comparison baselines remain unchanged.

## 2026-10-12 — English project and README presentation

The owner chose ASCII Engine, requested a README to review before repository
creation, and confirmed English throughout the editor and technical docs.
They subsequently requested re-editing existing videos rather than recording
again. Owner conversation remains Portuguese.

- Translated menus, inspector, asset labels, terrain tools, effects/atmosphere
  studios, cameras, accessibility labels, status/error text, API/MCP help and
  CLI output. Serialized prefab/preset IDs remain stable; user-authored names
  and the read-only Pomorog archive remain original.
- Translated README, START, agent instructions, editor/API guides, authoring
  plan, ADRs, historical audit/capture notes and this log. ADR 0002 records
  the language decision and the explicit existing-footage exception.
- README has a final-scene image, six separate feature chapters, setup/export
  instructions and an honest gameplay status. Gameplay scripting remains
  future work; existing combat is a programmed demo sequence.
- Re-edited the existing Living Shore footage with English cards, headings
  and timed captions. Its recorded historical Portuguese interface remains
  visible. Original OBS footage and masters are unchanged; no new film was
  recorded. English copy of the example: examples/living-shore.ascii.json.
- scripts/preview-readme.mjs renders the root README with six native players
  and HTTP range support at localhost:4178. scripts/prepare-showcase.mjs
  prepares MP4s/posters and verifies frame counts and complete decoding.
- pnpm check passed: **79 tests**, types and build. Authoring, composition and API/MCP
  integration checks passed in disposable GPU Chromium profiles, including
  native dragging, persistence, imported assets, camera/effect gizmos and
  the initial camera in Preview/player. Existing Vite/Zod warnings remain.
- Evidence: [English editor and checks](captures/english-2026-10-12/README.md),
  [README/media validation](captures/readme-2026-10-12/README.md).
- Orca initially returned runtime_unavailable. After the environment restarted,
  snapshot and screenshots worked. The English editor was inspected without
  changing its saved draft, and all six gallery videos played/seeking worked
  in the real Orca Browser. Six-view comparison passed with unchanged
  baselines: reference .0000, forest .0014, marsh .1096, snow .0063, mine
  .0163, cathedral .0396 RMSE. No Tauri/mobile launch this stage.
- Local branch docs/readme-showcase. GitHub repository creation/publication
  waits for the owner's requested README review; no push or remote created.

## 2026-10-12 — Historical close-up recording: Margem Viva

- Requested closer views of grass wind, water and effects, retaining the
  six-part Remotion edit. Created Margem Viva (Living Shore) entirely through
  visible editor controls: terrain, lake/path, objects, layered/lit Brasa Viva
  effect, Luar da Margem Viva atmosphere, camera, save and export.
- Working zoom 1.0–1.9, panning to the edited area. Low grass view; 9-second
  holds on wind/fire/water and 14-second final Preview. Final frame height
  **6.5 m**, previously 15 m.
- Native OBS in a separate workspace, PipeWire window capture, 2560×1080/
  30 fps, I444/Rec.709 from capture, x264 CRF 16, zero dropped frames.
  4:4:4 master; saturation 1.0. Compatible 4:2:0 still loses fine-stroke color.
- Original approximately 7:34; edit **13149 frames, 7:18.3**, 2560×1440.
  Water/grass/fire/camera normal speed; other stages 1.15×–1.30×. Earlier
  timeline retained in tools/video-edit/src/editions/lago-das-brasas.ts.
- Files: /home/jonny/Videos/ASCII-Engine-Closeup-2026-10-11/ (OBS originals,
  silent MP4, editable map, exported document and edicao/).
- parseScene accepted 10 objects, one water body, one saved effect, one
  atmosphere and one initial camera. Four sampled 3-second crops each had
  90 unique frames, without freezing in those samples.
- pnpm check: **79 tests**, types/build; Remotion types passed. Full film,
  six chapters and 4:4:4 master passed frame counts/full decoding.
  [Evidence extracted from video](captures/regravacao-proxima-2026-10-11/README.md).
- No engine/map changes, narration/audio or Pomorog import test. External
  Chromium recorded; OBS/browser closed normally and focus returned to Orca.

## 2026-10-11 — Remotion edit and recording color diagnosis

- Independent tools/video-edit project, Remotion 4.0.534: editable six-part
  timeline, intro/outro, animated chapter cards and synchronized notes.
- 2560×1440/30 fps, native 2560×1080 footage unscaled. Indicated speeds
  1.15×–1.40×; **8236 frames**, approximately 4:35. Full film, six parts and
  gallery in /home/jonny/Videos/ASCII-Engine-2026-10-11/edicao/.
- Full browser rendering pressured RAM; Remotion produces graphics/bands,
  FFmpeg composes source with two threads. Headless browser/disk cache.
- OBS source NV12/4:2:0, correctly tagged limited-range Rec.709. Same-PNG
  experiment confirmed glyph-color loss through chroma subsampling; gray
  barely changed. No global gamma/black-level adjustment.
- Editorial saturation 1.4× via RGB matrix; H.264 4:4:4 master and compatible
  4:2:0 encoded once, split at exact chapter keyframes. Personal OBS settings
  untouched. Correction cannot recover discarded chroma information.
- pnpm check: 79 tests, types/build; Remotion types, exact frame counts and
  full decode of all outputs passed. No audio or engine/map changes.
  [Color diagnosis and evidence](captures/edicao-remotion-2026-10-11/README.md).

## 2026-10-11 — Full composition session recorded in OBS

- Owner accepted the preceding water work and requested visible UI creation,
  native OBS, and care with Omarchy/Hyprland window placement. Editor on
  workspace 5, OBS on 6, Orca preserved on 3. Disposable demo profile.
- PipeWire editor-window capture with real cursor. API used only for reading
  state; the map was assembled through visible controls.
- Lago das Brasas (Ember Lake): 32 m terrain, elevation/path, calm lake,
  trees/rocks/ruin/log, layered/lit Brasa da margem effect, Luar do Lago das
  Brasas atmosphere and initial camera. Assets saved; finished in Preview.
- Delivery: /home/jonny/Videos/ASCII-Engine-2026-10-11/ with
  ASCII-Engine-criacao-completa.mp4, Lago-das-Brasas.ascii.json and
  Lago-das-Brasas.pomorog.json. **5:11**, 2560×1080, 30 fps, H.264, six
  chapters, no audio. Original MKV remains outside Git.
- Early XComposite property query aborted OBS; another attempt froze frames.
  Both takes discarded. PipeWire final take checked; OBS closed normally.
- MP4 fully decoded, video frames inspected, parseScene accepted 10 objects,
  one water/effect/atmosphere and valid initial camera. pnpm check passed
  **79 tests**, types/build, with known Vite chunk/Zod annotation warnings.
- No engine changes. This covered composition, not all advanced options or
  model import; exported-scene import into Pomorog untested.
  [Recording evidence](captures/sessao-gravada-2026-10-11/README.md).

## 2026-10-11 — Calm water and low-angle correction

- Owner requested calm lake, readable reflection and gentle waves, flagging
  water/grass while orbiting. Inspection found broad dark regions and blocky
  foam on slopes. Copied scene/depth/current after approximately 11 minutes
  reproduced the case in an isolated profile.
- Continuous/slower visual wave fronts, short-phase advection and stepped
  color; wave amplitude also controls flicker/highlight. Foam follows flow
  convergence, advects and fades; accumulated depth no longer creates an O grid.
- Reflection plane follows simulated height in nearby calm regions.
  Atlas derivatives now come from the continuous grid before fract/glyph
  selection, reducing green stripes apparently crossing the shore.
- Boundary pixel test: four rotations/two elevations, projected edge thickness,
  zero water pixels outside tolerated shoreline in eight views. An infinitely
  thin plane assumption had produced false positives at low angles.
- pnpm check: **79 tests**, types/build; verify:water and six-view compare
  passed. New tests cover stationary deep pools, foam dissipation, 120-second
  sources and reflection at the current surface.
- Orca real canvas, isolated multi-angle copies and cdpshot sequence at 60 fps.
  One Orca timeout and one tiled capture discarded; owner's document preserved.
  [Captures/logs](captures/agua-calma-2026-10-11/README.md).
- Limits: shallow flow inside painted masks, planar reflection per water body,
  no splashes/buoyancy/volumetric fluid. Tauri untested; visual acceptance is
  separate from these checks.

## 2026-10-11 — 3D orbit, camera thumbnail and shallow water dynamics

- Orbit (O): left drag rotates/elevates; Alt-left and Shift-middle also orbit.
  Isometric resets orientation. Near-horizon pan uses the view plane.
- Selected camera has a 12 fps thumbnail with Expand, sharing the renderer
  and proportional viewport. No second world/context or double simulation.
- Preview uses the initial camera and exit restores navigation. Visible Orca
  tab had stalled requestAnimationFrame at time 0; 20 fps fallback restored
  rendering/navigation. Normal rAF remains preferred; hidden documents pause.
- Object reflection improved; cylinder appears when its reflected projection
  lies inside the lake. Slopes no longer receive displaced horizontal mirrors.
  Moonlight highlight follows main light, camera and surface normal; atmosphere
  exposes light rotation/elevation in degrees.
- world/waterDynamics.ts: shallow cell flow, depth, gravity, resistance,
  stability bound, optional high-edge source, conservation without source and
  impulse waves. Mesh/current/foam follow state; terrain remains unchanged.
- waters[].physics persists parameters. Inspector exposes simulation, depth,
  source, resistance, waves and test impact. Moving objects/engine.setActors
  disturb water. Transient state resets on open, outside history/files.
  Custom GLSL boundaries have matching physics distance functions.
- API/MCP: editor_view.elevation, water_disturb, physics patching; 14 tools.
  Disturbance does not change revision. Bridge restarted, client settings untouched.
- pnpm check: **77 tests**, types/build. Composition/water/visual/authoring/API
  integrations passed, including native orbit/gizmos, pixels and conservation.
  [Evidence](captures/camera-agua-2026-10-11/README.md).
- Compare: five initial passes; forest RMSE .0595, then .0095 isolated,
  without code/baseline change. Known time-integration variability.
- No expansion beyond painted masks, volumetric fluid, ballistic spray,
  separate free fall or rigid buoyancy. No sky moon disk; main-light reflection
  only. Calm-region object mirror excludes separate-pass particles.
  Perspective/keyframes/Tauri remain unverified or unimplemented.

## 2026-10-11 — Saved cameras and effect-layer positioning

- Create camera captures current view: hierarchy entries, editor-only icon/
  frustum, W/E gizmos, XYZ/rotation, frame height/aspect, duplicate/delete/history.
  Camera view preserves pose/aspect; returning restores free navigation.
- SceneDoc.cameras/activeCamera and applySceneCamera in core; player/export
  honor initial camera. Helpers never enter world geometry/ASCII pass.
- Named effect layers, XYZ origin/gizmo in the void, reset and local undo/redo.
  One drag is one action; drafts do not alter scene history. Saved recipes
  include origin/name. Heat and trails respect all EmitterDef.offset axes.
- Ctrl S saves studio assets. Original presets retained; authored copies add
  Flame/Embers/Sparks/Smoke names. Scene placement has whole-object gizmo.
- API camera.define/update/remove/activate, editor_view.cameraId and camera
  object_inspect; export/history preserve cameras and layer positioning.
- pnpm check: **72 tests**, types/build. Composition, authoring, API and visual
  passed: native gizmos, history, Ctrl S, placement, reload/player; reflection
  405 changed pixels and fire lighting 3640. cdpshot and Orca captures.
  [Evidence](captures/composicao-2026-10-11/README.md).
- Orthographic only; perspective/keyframes, graphical curves/timeline and
  global asset library pending. No Tauri launch or game-rules editor.

## 2026-10-11 — Empty effect preview and atmosphere assets

- Separate terrain-free preview engine with orbit/pan/zoom/frame, pause/stop/
  restart/speed. Map pauses during editing; preview context freed on exit.
- Fire/Smoke/Sparks/Magic/Explosion/Lightning templates, Basic/Advanced controls,
  layers and fixed save footer. Both studios support Save/Show in Assets.
- Named SceneDoc.atmospheres, category, click to apply/double-click to edit,
  Save copy. Effects reopen on real double-click and update the same asset.
- Assets survive local draft, file/export and history. API atmosphere.define/
  apply, catalog and Studio capture. Library remains document-local.
- pnpm check **61 tests**, types/build; authoring/API passed, cdpshot/Orca
  checked. Embedded-host animation could stall. Graphical curves/timeline
  pending; next owner request was layer gizmos and saved composition cameras.
  [Evidence](captures/studio-assets-2026-10-11/README.md).

## 2026-10-11 — Dedicated studio, terrain water and API/MCP authoring

- Owner confirmed dedicated Effects/Atmosphere workspace, water following
  mountains and complete visual content creation/editing through AI commands.
- Large studio canvas/right controls; exit restores layout. Atmosphere exposes
  exposure/tint/background/main/ambient light/shadow/fog and portable files.
  Effects expose lights; real placement previews support W/E/R, Enter/Esc.
- Continuous Water brush, Shift erase, flat/follow-terrain modes. Mesh/ripples
  follow slopes without flattening terrain. Explicit legacy-water conversion;
  serialized masks/heights restore on undo/reopen.
- All visible reflections updated; equal planes share textures. Lit auxiliary
  materials avoid applying letter loss twice; final water remains glyphs.
  Local planar approximation on slopes, no separate-pass particle reflection.
  Physics was not yet implemented at this stage.
- Up to eight PointLights affect bodies/grass/particles. Studio enables
  bodySceneLighting/inkFog; historical scenes keep approved lighting. Baselines intact.
- packages/authoring: atomic validated scene/object/scatter/terrain/water/
  effects/assets/atmosphere/weather commands; no editor/renderer dependencies.
  scene.replace/patch expose all visual-contract fields.
- Editor API: per-tab session/revision, preview without autosave, accept/discard,
  history, inspect/camera/PNG/import. Direct AI acceptance allowed; manual
  edits invalidate stale writes. Build failure preserves scene/resources.
- apps/automation: loopback HTTP/WebSocket on 1442, 13 stdio MCP tools, official
  SDK v2. Vite starts bridge; pnpm api independent. Explicit import paths,
  temporary-file portable export, explicit overwrite option. .mcp.example.json
  provided without changing global owner configuration.
- START/ADR 0001, [API guide](api-mcp.md), [editor guide](guia-editor-visual.md).
  **56 tests**, types/build; API/visual/authoring and all compare views passed.
  Known large-chunk/Zod PURE warnings. Isolated MCP example:
  [mapa-mcp.pomorog.json](examples/mapa-mcp.pomorog.json).
- Orca tab/API session available but viewport screenshot timed out with stalled
  animation. API forced render returned orca-api-canvas.png without changing
  revision 0. UI captures from GPU Chromium; Vite also started with existing bridge.
- [API evidence](captures/api-mcp-2026-10-11/README.md),
  [studio/water/light](captures/studio-agua-2026-10-11/README.md).
  Tauri connection, owner's MCP client configuration and Pomorog importer
  pending. This authors visuals, not game logic or a complete RTS.

## 2026-10-11 — Camera correction, movable panels and effects tab

- Fixed reversed vertical pan/arbitrary 1.4 gain using screen-to-ground
  projection. Right/middle pan follows pointer without Ctrl.
- Floating/resizable panels, drag handles, docking on three edges, recovery
  and persistent localStorage layout; canvas uses freed space.
- Effects tab: emitter/color/shape/motion/duration/loop fields, preview, presets,
  save/place, import/download and advanced JSON. SceneDoc.effects validates
  recipes/builds prefabs; isolated runtime definitions do not replace presets.
  Save/reopen/export/duplicate/insert preserve effects.
- pnpm check **44 tests**, types/build; authoring passed without page exceptions;
  six compare views passed unchanged. [Evidence](captures/paineis-efeitos-2026-10-11/README.md).
- One docked panel per edge, no separate native windows. Graphical timeline/
  curves and full particle scale/rotation pending. Next request covered water,
  continuous painting, placement previews, effect lights and atmosphere.

## 2026-10-11 — Unity-inspired editor workspace

- Reorganized confusing placement flow: left hierarchy, central scene, right
  inspector, bottom library; SVG icons/search/categories/File menu and tabs.
- Native library drag/drop with ground indicator, or click then place. Shift
  repeats, Esc cancels; placed object selected in Move. W/E/R gizmos, local/
  global space, snap and XYZ fields. A drag is one history action. Alt orbit,
  right/middle/Q pan. Preview disables editing and hides scene helpers.
- Editor-only TransformControls overlay; no dependencies/core/shader/recipe/
  document changes. Guide/START updated. pnpm check **41 tests**, types/build;
  authoring native placement/three gizmos/history/import/export passed.
  Large-bundle warning remained; no page exceptions.
- [Before/after evidence](captures/editor-unity-2026-10-11/README.md) from
  cdpshot, integration CDP and full-page Orca. Five compare passes; forest
  failed during concurrent execution (.1352), passed isolated (.0096), with
  code/baseline unchanged. Temporal cause not fully isolated.
- Fixed panels, single selection/no grouping at this stage; water uses
  inspector rather than object axes. Pomorog/biome authoring limitations
  remain. No desktop/mobile check. Branch feat/unity-editor-workspace; no push.

## 2026-10-11 — Portable visual authoring and export

- Owner confirmed terrain/maps/items, excluding game rules/UI. Scope in
  [authoring plan](plano-autoria-pomorog.md); guide records limitations.
- Read-only inspection of ~/Documents/pomorog main f79d3c7 (owner local
  changes) and pearleye visual worktree 27af922; reference matches pearleye.
- Normalized/validated documents, stable identities/seeds, 3D transforms,
  visibility/names/global/type/part styles, embedded GLTF/GLB and clip choice.
  Failed scene builds release resources; editor preserves old scene until ready.
- Sandbox default, hierarchy/inspectors/transforms/duplicate/delete/focus,
  per-part selection, maps/terrain-free items, saved-item insertion, per-action/
  stroke history, IndexedDB draft with visible failures, visual JSON export.
- Rain/snow and library effects persist. Lake/stream digging uses waterEdge;
  grass mask respects shoreline. Basic shapes compose items.
- Removed carpet/particle/rain unregister updates; layers can be re-added
  when retained; effects cancel immediately; campfire buffers independent.
  engine.resources supports reload checks.
- **41 tests**, types/build, real Chromium authoring checks: transforms/parts/
  history/terrain-free/GLTF+bin/GLB/clips/malformed/build failures/reopen/weather/
  brushes/lake/reload. No page exceptions. Six compare views unchanged.
  [Evidence](captures/autoria-2026-10-11/README.md).
- /tmp/ascii-authoring-export served on 1441: player with three objects/lake/
  rain captured by cdpshot. Orca snapshot/canvas worked; full-page timed out.
- Examples/START/README updated. Remaining at this stage: Pomorog importer,
  full biome fidelity, grouping/gizmos, linked library, chunks/seams, advanced
  water/brushes/effect editor. Branch feat/scene-authoring, no push/publication/
  desktop/mobile test, no changes to Pomorog/reference.

## 2026-10-11 — Audit and project resumption

- [Report](relatorio-engine-2026-10-11.md), clean initial ed2d4f3 tree.
  Functional renderer/five demos; game authoring incomplete. START corrected
  phase-completion claims; README linked audit.
- Reproduced missing instance/global JSON styles, prefab-overwritten type,
  nondeterministic rebuilt tree, removed carpet still updating, terrain-free
  sandbox crash. Imported models not portable; reload disposed old scene
  before validating candidate; authoring/chunk/project-asset gaps identified.
- **25 tests**, types/build and six compares passed without baseline updates.
  No editor tests yet. Reference/five areas/sandbox/GLTF/effects/web/Orca
  [captures and probes](captures/auditoria-2026-10-11/README.md).
- Temporary web export verified over HTTP/player; no desktop/mobile run.
  Recommended milestone: create, adjust parts, import, save, reopen identically,
  export. Start with persistence/seeds/validation/disposal before new tools.
  Documentation/evidence only; findings unresolved then, no reference/push changes.

## 2026-10-11 — Phase 1: extracted core

Ported reference/pomorog/src-visual to packages/engine/src, preserving
numbers/alphabets/colors/drawing order. Added style resolution global → type →
type part → node userData → instance → instance part. Declared techniques,
per-node glyph metadata, cached material variants and preserved original materials.
Material.clone does not copy onBeforeCompile; copying it fixed gray forest floor.
CSS-height pixelScale/screen resolution retained for fidelity (DPR 1.5 changes
body/particle apparent size); later improvements need before/after evidence.

Modules: surfaceAlpha centralizes toFixed(2); independent illumination with
interior/obstacles/placeable light; removed swamp coupling in favor of hook;
worldGlyph→surface, glyphBody→body with per-engine uniforms/mesh lists/removal;
grass→recipe carpet with extent/center; particle cloud buffer; markScreen;
pomorog light/fog/cell 6/brightness 1/shadow .62 preset, tree/rock/creature/hero/
prop/ground types, ground/carpet/pomorogSpan; data-based HeatGridSpec fire.
Engine API: add/style/parts/types/carpet/particles/lights/actors/frame/render
(dt clamped 0–.08), debug.raw. No game/React/Tauri imports, only Three.

Reference editor scene: forest camp ground/logs/sleeping bag/crate/seat/shelter
as surface with original pomorogKind classification; body stone ring/boulder/
pebbles; four trees with surface trunk/body crown; 70000-glyph carpet,
particle fire, static screen traveler. URL screen/raw/angle/zoom/pause/yaw,
scene=terrain; drag rotates view. **9 tests**, types/build; no console errors.

Captures: fase1-referencia.png, fase1-referencia-girada.png,
fase1-referencia-perto.png, fase1-perto-3x.png, fase1-modo-tela-antes.png,
fase1-relevo.png. GPU Chromium 1600×757/DPR 1. Compare Pomorog forest start,
close-up and fire references. Ground/props/crowns follow geometry; legacy
screen-all view is deliberate rejected-style comparison.

Pending then: Orca hidden panel timed out; static hero; 45-degree terrain-grid
seam/stretch on slopes; water/rain/snow/combat/fireflies/lantern motes; full
part-cloud rebuild on style changes remained unoptimized.

## 2026-10-11 — Slice 1: Dark Forest

- Water component: stream/pond JS/GLSL waterEdge, data WaterLook/FOREST_WATER,
  .15×.19 cells, original wave/foam alphabets, .05 reflection threshold and
  blank row every four; 640² planar glyph mirror. Only nearest water <11 m
  updates reflection. circuit/chunks distance loading −1..+2 with seeded indices.
- Ambient fireflies/lantern motes/running dust. remove({dispose}) frees owned
  geometry/materials/glyphs/water, preserving shared pieces/nested styles.
- Reflection clipping had recompiled approximately 800 materials twice/frame:
  27 fps/36 ms CPU. Fixed retained clipping plane restored **60 fps**, versus
  measured Pomorog 47. Infinite grass spread 26 m/wrapped 36 m created 10 m gap;
  corrected to full extent at constant density, 90000×(36/26)²≈172600 blades.
- forestWorld port: 100 m closed trail, 90-second hunt, 30-second camp loop,
  animated traveler, 64 m ground following in 3.4 m steps, masked carpet,
  trees/rocks/ruins/logs/stones/mushrooms, lakes/streams/bridges/shore/camp at s=0.
- Live panel area/mode/size 5–12 px/light 65–140%/zoom/rotation/pause/capture.
  URL area/ascii/hunt/at/camp/zoom/angle/pause. **13 tests**, types/build.
- Captures: floresta-fogueira.png, floresta-lago.png, floresta-riacho-ponte.png,
  floresta-riacho-modo-tela.png, floresta-antes-faixa-sem-grama.png.
  Owner side-by-side acceptance, combat, raycast occluder clipping and HTML
  name/health labels remained pending at this slice.

## 2026-10-11 — Slice 2: Rain Marsh

Approved legacy screen water/rain retained; floodplain trees/rocks/reeds/plants/
shore/walkway/cabin use object glyphs. stormAt/rain with 1 px streaks and
ASCII lightning, deterministic drops; fixed-step damped rippleField.
Legacy water data/islands/flood height, IDs water .8/submerged grass .3/
reflection 0, tangential ASCII rings, steps/rain/body/hit splashes, boot wakes
and shoulder drips. marshHooks adds submerged-actor blue tint without biome
imports. addWater/createRainStreaks/setGain/setFlash; ShaderMaterial retains
its own ID. Fixed ignored LineSegments so rain renders.

Common fixed-area campfire/steam/traveler/lantern/floor; marsh/shoreDetails
ported swamp environment with catalog §19 node techniques. Captures:
pantano.png, pantano-perto-chuva-aneis.png, pantano-relampago.png.
40–49 fps headless versus forest 60; CPU ripple field/always-on mirror costs
remain. No thunder audio.

## 2026-10-11 — Slice 3: Snow Pines

60 fps; presets/snow: masked ground, camp clearing grows 1.48→1.83 m,
512² footprint map with toes/heel fading in 110 s, slow . + * flakes excluded
under crowns/melting at camp, snowAccumulation, body ambient .42.
Pine body foliage and thickening snow shelves/ramp, boulders/broken fence/
dry grass/crust carpet. Captures neve.png, neve-perto-pegadas.png.

## 2026-10-11 — Slices 4/5: Old Mine and Sunken Cathedral

Both 60 fps. setObstacles rebuilds exploration/lantern visibility; free water
boundary via edgeGLSL/crestGLSL/flow/distance supports flooded corridors.
Near-literal interior assembly: rails/supports/rocks/crystals/lamps/gravel/cart;
slabs/ribbed columns/pews/arches/altar/glowing stained glass/moss debris.
createLitFloor, lantern 19, pomorogInterior, gravel/moss carpets.
Shelter was incorrectly included in marsh/snow; restored procedural-forest-only
condition and recaptured. mina.png/catedral.png plus updated neve/pantano.
Five Pomorog areas selectable; owner comparison and visible Orca check pending.

## 2026-10-11 — Creatures and combat effects

presets/combat preserves Pomorog glyph effects at 1.4×: sword crescent/star/
sparks, red claws, three-column lightning, fireball/trail/explosion, ice spikes,
engagement/impact rings, lit casting aura lighting grass via carpet.setGlow,
dissolve and emergence/dash/flight effects. fx.hit accepts game feedback.
Scripted wolf/larva/spider/wasp/goblin encounters use .155 m body glyphs,
colored dark occluder, alternating spells/death/screen loot. Forest peaceful=1
disables encounters; camera 1.25 m ahead, 32% toward opponent.
Captures floresta-combate-lobo.png, floresta-magias-aura-fogo.png.

## 2026-10-11 — Phase 3: GLTF import

loadGlyphModel(URL/ArrayBuffer) handles glTF/GLB; Blender extras→userData glyph,
glyph_surface/glyph_size/glyphStyle. Named nodes become parts; mixer plays clips.
Fallback by name/geometry, never color: skinned/foliage/snow/faceted→body,
otherwise surface with named bark/wood/stone/earth family. Skinned letters store
triangle/barycentric weights, updateSkinnedBody follows bones each frame.
Demo exports/reimports six-bone swimming serpent and tree with marked parts
through Three GLTFExporter; editor file import/drag-drop. **16 tests**,
gltf-serpente-arvore.png. No actual Blender-exported GLB fixture yet.

## 2026-10-11 — Phase 4: adjustment editor

Part picking/gold box; second click/Esc selects whole object. Resolved technique/
family/size with instance, type-part or global scope. pick returns object/node/
part/type/style; setInstanceStyle/exportStyle/types, glyphResolved, global/type
re-resolution and nested-object style preservation; no type/parts style leakage.
JSON presets include global/types/lights/cell/brightness.

pnpm compare uses frozen GPU Chromium views and ImageMagick RMSE against
captures/baseline; differences in captures/diff (ignored), --update explicit.
Measured repeatability ≤.014 for reference/forest/snow/mine/cathedral;
marsh up to .15 due to rain-ring timing. estilo-por-parte-uma-copa.png deliberately
shows rejected surface crown on one tree; others stay body glyph clouds.
Full §16 shader/material/ramp/wind controls remained constants; only screen
cell/brightness/zoom/rotation/part style were editable at this stage.

## 2026-10-11 — Phase 5: scenes, prefabs, chunks and terrain brushes

32 m/129² height grid, raise/lower/smooth/flatten/dig/paint, up to four colored
layers/grass densities (moss/earth/stone/snow); heightAt/layerAt/grassAt.
Declared surface terrain follows height. SceneDoc style/terrain/water/carpet/
prefab transforms/instance/part styles, buildScene/place/remove/addWater/regrow/
toJSON. Prefab becomes type. generateChunkGrid matches trail/stream/brush
connectors with weights/biomes/fixed chunks/boundaries/seed/backtracking;
rotateConnectors and distance streamer.

Sandbox brushes, radius/strength/regrow/save/open/new, browser localStorage;
tree/boulder/crate/bridge/ruin/standing stones/log/lit fire prefabs.
**21 tests**; cenario-pincel-lago-ponte-morro.png built using pointer events.
Pending then: steep-slope carpet alignment, automatic seams/chunk editor,
generator integration in scene editor and undo/redo.

## 2026-10-11 — Phase 6: effect system

EffectDef duration/loop/emitter timeline: continuous/burst emission; point/
sphere/cone/ring/box/line spawning; velocity/speed/gravity/drag/noise/attraction/
spin/ground; lifetime size/color/alpha curves, glow and glyph sequences.
Particle/ring/zigzag beam/ribbon/heat/decal/ASCII flipbook rendering; flickering/
fading lights; object/part/bone attachment; per-emitter max/scene budget.
Lazy engine.fx.play('fogueira', target), data Pomorog presets and flipbook
image/sprite sheet/animated GIF-WebP ImageDecoder/video sampling.
Effects demo: loop/once/stop, moving target attachment, live JSON/file, image/
GIF/video import, glyph/effect/emitter counters. **25 tests**;
efeitos-presets.png covers fire/lightning/explosion/ice/aura/dissolve/trail/flipbook.

Fidelity finding: Pomorog particle atlas omits @ and x, requested by fire;
indexOf −1 maps to dot, consistent with ascii-fire-grid.png. Engine preserves
that behavior; adding @/x/& requires an approved before/after improvement.
Pending: graphical curves/gradients, mesh-surface spawn/named bones,
event triggers still invoked from code, sound.

## 2026-10-11 — Phase 8: web and desktop export

Player reads adjacent game.json (title/area/scene/style/zoom), hides panels/
selection; ?player=1 tests same path. Vite base './' supports relative hosting.
pnpm export --title … --area id | --scene scene.json [--zoom] [--desktop]
[--bundle deb,appimage] builds/copies exports/<game>/web, writes game/scene JSON;
optional Tauri name/identifier config/build.

Web Dark Forest served statically and captured without panels:
exportacao-web-floresta.png. Release binary built in 2:33 at
apps/editor/src-tauri/target/release/ascii-engine-editor; no installer.
Desktop window never opened. Android/iOS SDKs unavailable (adb only);
future path tauri android init/build and tauri ios init/build with same web folder.

## Remaining general checks from the initial implementation

Hidden Orca panel previously prevented frames/screenshots; GPU Chromium used.
Phase 7 (Pomorog consuming the engine) requires a separate owner request.
