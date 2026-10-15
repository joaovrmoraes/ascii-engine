# Development log

Entries describe the state at each stage. Earlier limitations may have been
resolved later; START.md and the editor guide describe the current scope.
Historical filenames, reference IDs and captured interfaces are preserved.

## 2026-10-15 — Generated Pages formatting and editor test teardown

Excluded docs/index.html and docs/watch.html from Prettier with their generator
identified in .prettierignore, then regenerated both from the current README.
The generated gallery now also reflects the README's existing 16 MCP tools and
project export description. Generated HTML stays in the generator's own format.

Audited all outputs of build/Pages, showcase, exports and the independent video
tool against files changed by 393b309. Only those two generated HTML files had
been formatted. Other generated outputs already live under ignored dist/,
target/, src-tauri/gen/, .cache/, exports/, docs/showcase/, docs/captures/ or
docs/examples/. Video tool public/ and out/ are also explicitly excluded now.
The editor index.html and Tauri base configuration are maintained inputs; the
builds write separate output copies. Scripts and video source files are inputs,
not generated files. No generator is required to emit Prettier-formatted output.

Traced Vitest's open handle with async_hooks: the editor's Vite plugin started
the bridge on 127.0.0.1:1442, while Vitest's middleware server had no HTTP server
to emit the close event. Added an awaited, idempotent closeBundle teardown;
the existing HTTP close path shares the same closure. Editor tests now exit
normally both with an existing dev bridge and when they own the free port,
which is released after teardown. No timeout suppression was added.

Initial validation: editor tests with the hanging-process reporter, free-port
release, format:check, production Pages build and verify:pages passed. Orca
checked the isolated sandbox page 4d61c29e-ae0f-4880-a018-3d0e6313dbfe without
editing the document. Two regeneration/check cycles on the committed fix are
the remaining final validation; results will be recorded below. Owner plans
remain untracked and untouched. No push or publication.

## 2026-10-15 — Consistent formatting and check gate

Adopted pinned Prettier 3.9.10 with a 100-column wrapping target, two-space
indentation, single quotes and no optional semicolons. Added pnpm format and
format:check; pnpm check now runs the formatting gate first. Commands select
Git-versioned files and exclude reference archives, generated output, scene
fixtures and captured evidence. Untracked owner plans were preserved. Embedded
shader/HTML strings keep their contents and may exceed the wrapping target.

The other agent's terminal was confirmed idle before formatting. Isolated
formatting/tooling commit 393b309 changes 182 files; its full hash is recorded
in .git-blame-ignore-revs. An audit confirms 176 modified files match Prettier
applied directly to their previous contents; START/package/lockfile changes
only configure and document the formatter. No renderer behavior was changed.

Validation: pnpm check passed (11 CLI + 148 workspace tests), verify:authoring
84 and verify:textures 106 passed with pnpm dev running. All four generated
JS/CSS assets match the previous build byte for byte. The historical item
SceneDoc has before/after world RMSE 0. An isolated Orca profile opened that
document at localhost:1440/?area=sandbox using explicit page
4d61c29e-ae0f-4880-a018-3d0e6313dbfe; owner draft was not edited. Captures use
the page-only headless Chromium helper. Orca image-capture follow-up and native
desktop testing are deferred at the owner's request. No push.

[Formatting evidence, captures and validation logs](captures/formatter-2026-10-15/README.md).

## 2026-10-15 — Consolidation review, group 7 and final validation

Confirmed visible rain glyph rings with Simulate water unchecked: scene rain
uses the nonempty wet mask independently of physics. Rendered comparison changes
116 pixels above 8/255, and rings stay transient. Added browser coverage and
captures; no water renderer change was needed or made. Isolated Orca verified
physics=false, unchecked control, 515 wet cells and an active ring. Additional
Orca checks confirmed Detach then Apply edits only the target, preserving users.

Final validation: pnpm check (11 CLI + 148 workspace tests), textures 106,
authoring 84, actual stdio MCP/API 39, water 28 plus eight bank views, export 11,
and display 21 passed with dev running. Web and Linux native exports used literal
flag-like titles correctly; native window remains untested. Historical item and
terrain SceneDocs match original world captures exactly (RMSE 0). No baselines
were changed. The temporary prior-source comparison server was stopped.

[Review evidence and logs](captures/editor-review-fix-2026-10-15/README.md).
Orca commands used a separate profile and explicit editor page; owner draft was
not edited. Orca image capture timed out, so inspected GPU Chromium captures
provide the visual evidence. All seven groups have local commits, with no push.
Untracked owner plans were preserved outside the commits.

## 2026-10-15 — Consolidation review, group 6: explicit debug/comparison

Inspected compare.mjs and baseline metadata: current comparison views have no
ascii=screen parameter. The reference documents that historical URL, so it and
the old AreaOptions.screen alias remain. Renamed the primary area option to
legacyScreenComparison and labeled its UI Legacy screen comparison. Normal
Display modes use setRenderMode live in reference and all five maps, preserving
object techniques; debug-screen and legacy-screen URLs distinguish the paths.
Entering/leaving the legacy recipe rebuilds only that comparison scene.

Validation: pnpm check, verify:display (21 checks) over six areas, isolated Orca
sandbox debug/document checks, and old/new legacy captures against a source
archive of 578dec6. Visible Old Mine at 3 s has world RMSE 0.0000627474;
no baseline regeneration. [Before](captures/editor-review-fix-2026-10-15/legacy-screen-before.png),
[after](captures/editor-review-fix-2026-10-15/legacy-screen-after.png),
[live debug](captures/editor-review-fix-2026-10-15/live-debug-screen.png).
No legacy controls removed, owner draft untouched, no push.

## 2026-10-15 — Consolidation review, group 5: texture registry lifetime

Adopted the reviewed preexisting keepUsed/setTextures/buildScene edits. A new
scene registers its own textures plus only previous recipes still linked by live
objects. Removed resources no longer linger. Failed construction restores the
registry; disposing/replacing the old scene releases its last retained link.

Validation: pnpm check (11 CLI + 148 workspace tests), verify:authoring (84
checks), including actual WebGL registry lifetime, rollback and final release.
Pinned isolated Orca confirmed the same [registry state](captures/editor-review-fix-2026-10-15/registry-orca.json).
No previous agent changes were discarded. Owner draft untouched; no push.

## 2026-10-15 — Consolidation review, group 4: export arguments/retention

The CLI consumes named values exactly once and accepts --key=value. Flag-like
titles cannot enable desktop builds or replace scene paths. Added parser tests
to pnpm check. The bridge retains the latest five completed project-* exports,
pruning old disk directories and in-memory jobs, including previous-run output.
Active jobs and unrelated folders remain. The dialog handles pruned job status.

Validation: pnpm check (11 CLI + 148 workspace tests), retention tests with
queued jobs/old folders/manual output, and verify:export (11 checks). Actual
Web --desktop and native Linux --scene titles built/downloaded correctly;
the static player preserved its scene. Native window not opened.
[Literal-title export](captures/editor-review-fix-2026-10-15/literal-title-export.png).
Restarted only this worktree's Vite/bridge to load the Node implementation.
No owner draft edits or push.

## 2026-10-15 — Consolidation review, group 3: sandbox modules

Proposed the split before editing. Extracted library/cards, hierarchy, object
inspector, terrain tools/painting, Studio callbacks, file/import operations and
interaction. The sandbox coordinator shrank from roughly 59 KB to 19 KB;
its typed context keeps current scene/selection references and document/history
operations explicit. Default scene moved to a shared editor scene factory.
Core behavior, DOM selectors and persistence ownership remain unchanged.

Validation: pnpm check (147 tests), verify:authoring (81 checks), and isolated
pinned Orca selection/inspector/library checks passed. Drag/gizmos, brushes,
imports, undo/redo, reload and studios use their existing browser scenarios.
[Unchanged panels](captures/editor-review-fix-2026-10-15/modular-panels.png).
Owner draft untouched. No push.

## 2026-10-15 — Consolidation review, group 2: shared Apply warning

A changed shared recipe labels Apply with its complete affected-object count.
Apply asks before updating other users and suggests Save copy or Detach.
Cancel leaves both the resource and instances unchanged. Detach now ends shared
asset editing, so subsequent Apply writes only the target's local appearance.

Validation: pnpm check (147 tests), verify:textures (106 checks), including
cancel/accept and actual rendered shared users. The isolated Orca profile tested
the warning; owner profile was not edited. [Studio capture](captures/editor-review-fix-2026-10-15/shared-apply-00.png).
No push.

## 2026-10-15 — Consolidation review, group 1: visible texture links

Reviewed and adopted the existing uncommitted core/authoring implementation:
object texture → instance → part texture → instance part; linkTexture clears
only recipe-defined local fields, including unlinked parts for object links.
Detach preserves the new ordering. setInstanceOptions replaces the entire layer.
Integrated the helper in all library drops, Studio Apply and isolated previews;
replaced fields are reported. Updated START, API/MCP descriptions and schema.
Existing texture validation tests were retained alongside relink/part tests.

Validation: pnpm check (147 tests), verify:textures (104 checks), actual mesh
relink after Detach, and a pinned isolated Orca profile passed. Owner draft was
not edited. [Capture](captures/editor-review-fix-2026-10-15/relinked-after-detach.png).
The preexisting keepUsed/scene registry edits remain for group 5. No push.

## 2026-10-15 — Editor consolidation stage 7: panels and project files

Water inspector now has Name, Visible and XYZ (shape.x / level / shape.z),
with matching hierarchy labels/visibility. These required optional SceneWater
format fields; omitted values retain the old fallback labels and visible mesh.
Validation, authoring schema/MCP descriptions, API docs and tests were updated.
Terrain owns water painting and the inspector links back to that tab. Water
mode appears only with that brush; object erasing moved to the scene toolbar.
Environment exposes the existing weather intensity and preserves it on changes.

File separates Open map from Import into this map. Unified import recognizes
items, texture/atmosphere recipes, models and companions (including mixed
selections), with atomic replacement and independent asset/texture/type IDs.
Extracted pure routing/insertion helpers and added meaningful editor unit tests
to pnpm check. Existing style preset save/load stays in File.

Save retains document download. Export opens Web, Desktop and Pomorog targets.
The local bridge snapshots a revision, queues the existing Vite/Tauri CLI,
serves finished ZIPs/JSON and exposes job status, including after browser reload.
Added project_export/project_export_status MCP tools (16 total); no publication.
Pomorog remains a visual SceneDoc requiring a game importer. Output stays in
fresh ignored exports directories; no built binaries were added to git.

Validation: pnpm check 144 tests, boundaries/types/build; authoring 81, textures
103, GLTF 19, water 25 plus eight bank views, actual stdio MCP/API 39, export 9,
with dev running. Web ran from a static nested URL; native Linux executable
built and was checked inside the desktop ZIP. The native window was not opened.
Pinned Orca tested the new fields/targets; owner document and selection restored.
Historical item and terrain world crops both RMSE 0; no baseline regeneration.
[Captures, logs and limitations](captures/consolidation-stage7-2026-10-15/README.md).
Orca image capture still timed out; inspected GPU Chromium images instead.

All seven consolidation stages are complete in local stage commits, without
push. The owner's original untracked plan is preserved. Broader sandbox
splitting, media/history weight, documentation filename cleanup, additional
editor unit coverage, native window/platform tests and visual approval of the
preexisting snow baseline remain outside this consolidation.

## 2026-10-14 — Editor consolidation stage 6: component letters

Added optional WaterLook alphabets for water/foam/reflections, fonts/weight,
initial/simulated depth colors and scale, reflection strength and glyph impact/
rain rings. Existing controls now also expose cell size, row sparsity, base/sheen/
foam colors, bank and reflection tint/threshold/rows. Rings are transient, bounded
and clipped to water. Legacy marsh visuals are unchanged. New water fields were
missing from the plan's assumed format, so the extension was reported explicitly.

Terrain layers own optional surface look and standing-letter cover recipes.
Floor alphabets, fonts, dimensions, colors/palettes, ink and lighting follow the
dominant painted triangle while vertex colors still blend. Four material groups
bound draw calls. Cover controls include glyphs/fonts, colors/palettes, dimensions,
amount/density and wind. Color/font-only edits preserve default distribution and
sizes. Old documents keep their original atlases/shaders/seeded recipes.

Extracted waterInspector and shared letterControls; Texture Studio shares alphabet
validation/input construction. Sandbox keeps document/history coordination. Added
core format validation, atomic terrain.layer, water.update descriptions, MCP
references/descriptions, API docs and meaningful validation/recipe/geometry tests.
Stable musgo/terra/pedra/neve IDs are preserved under English display labels.

Validation: pnpm check 139 tests; water 25 checks plus eight bank views, textures
103, authoring 73, actual stdio MCP/API 35, with dev running. Pinned Orca tested
terrain fields and actual water alphabet edits; owner document restored unchanged.
Old terrain/grass/water world RMSE 0. [Captures/logs](captures/consolidation-stage6-2026-10-14/README.md).
No push. Stage 7 panels/files remains. Orca images unavailable; inspected GPU
Chromium captures. Native desktop unverified; no baseline regeneration.

## 2026-10-14 — Editor consolidation stage 5: one lighting home

Extracted one built-in/saved atmosphere catalog for Environment, Atmosphere
Studio and texture previews. Environment can apply saved assets; texture preview
selects Current scene, a built-in or a saved atmosphere. Its duplicated light
fields and Apply lighting to scene were removed after explicit owner approval.
Atmosphere Studio remains live; the shared header says Editing the live map,
while Textures/Effects say Isolated preview / map paused.

Old TextureAsset.previewLighting snapshots still open/export unchanged. An
unmatched rig offers Save as atmosphere; conversion adds an asset, selects it
and stops offering conversion. Selecting a preview rig never changes map light.
The existing snapshot field also stores selected presets; no format migration.

Validation: pnpm check passed 120 tests; verify:textures 103 and authoring 73
with dev running. A CDP target interruption required a clean authoring rerun;
all final checks passed. Pinned Orca validated selectors/migration/headers,
removed controls and unchanged map. Old item world RMSE 0. [Evidence](captures/consolidation-stage5-2026-10-14/README.md).
No push; component letters and file/panel consolidation remain stages 6/7.
Orca image capture remains unavailable; native desktop unverified.

## 2026-10-14 — Editor consolidation stage 4: linked texture resources

Objects and named parts can reference SceneDoc.textures by ID. Core layering
places both recipes below local instance/part overrides. setTextures re-resolves
users; buildScene loads definitions and rolls back failures. Old copied styles
are never migrated. Authoring texture.apply accepts link:true, texture.detach
bakes appearance, and resource.remove rejects textures in use. Validation,
MCP descriptions/schema and API docs were updated.

Texture Studio lists users, opens linked recipes, preserves preview precedence,
and offers detach/delete (confirmation before detaching users for deletion).
Saving a resource updates every link. Library click selects, double click edits;
texture cards drag onto scene parts, hierarchy objects or the selected inspector
part. Atmosphere cards select and expose an explicit Apply action. Item export
includes texture definitions; insertion remaps texture/asset/type IDs and keeps
source global/type layers below linked recipes instead of flattening them.

Validation: pnpm check passed 120 tests; textures 98, authoring 73 and actual
stdio MCP/API 34 assertions, with dev running. Restarted only this worktree's
stale standalone bridge to load the new schema. Pinned Orca checks preserved
the owner's document after a temporary fixture. Old item world RMSE 0.
[Captures/logs](captures/consolidation-stage4-2026-10-14/README.md).
No push. Lighting/components/files remain stages 5–7; native desktop unverified.

## 2026-10-14 — Editor consolidation stage 3: one appearance editor

Texture Studio now edits part, object, shared asset/type and global scopes.
Inspector reports effective technique, alphabet (including custom letters), size,
color and per-field sources. The owner approved removal of its duplicate fields
and save-to selector. Edit letters and toolbar pass selection through callbacks.
Screen recipes are available with explicit legacy atlas/cell-size limits.
Library recipes open without an implicit target. Studio headings distinguish new
and saved assets; imported recipes remain intact when selecting parts/scopes.

Plan correction: procedural declarations require an optional authored field mask
on type styles. Only edited fields are promoted above model defaults; documents
without masks retain old layering. Added validation, authoring/MCP descriptions,
API docs and meaningful precedence tests. Actual MCP cancellation exposed and
fixed type leakage from a previous candidate during document replacement.

Validation: pnpm check passes 118 tests and builds; verify:textures 92,
verify:authoring 72, verify:gltf 18 and actual stdio verify:api passed with dev.
Pinned Orca walkthrough confirmed inspector/Studio color and unchanged document.
Historical item world crop RMSE 0. [Captures and logs](captures/consolidation-stage3-2026-10-14/README.md).
Orca captures still time out; inspected GPU Chromium images instead. No push.
Linked textures and consolidated lighting are pending stages 4/5; water/terrain
letters and file/panel routing remain stages 6/7. Native desktop unverified.

## 2026-10-14 — Editor consolidation stage 2: view-only Display

Display now contains zoom, rotation, pause, PNG capture and live debug render
mode only. Exposure and screen cell size live in Atmosphere's Scene and glyphs
group; cell size remains a scene field, outside reusable lighting-only assets.
Style preset save/load was moved to File without removing the feature. Demo
area menus/import/presets retain their existing behavior. Added a Display tab.

Extracted session pause controls and preset file helpers from DOM wiring.
Toolbar and Display call the same pause controller. The core's setRenderMode
provides a debug post-pass override without touching techniques or exportStyle;
Screen grid is an analysis view of the already-rendered world, not a scene
style or a conversion back to the original smooth model. Legacy code-built
demo screen recipes are preserved. Sandbox decomposition stays incremental.

Validation: pnpm check passed (114 tests), verify:authoring passed 72 checks
and verify:composition passed 27, with pnpm dev running. Orca with its explicit
editor page ID confirmed live modes and unchanged document. The historical
item-roundtrip viewport remains identical (RMSE 0). Captures and logs:
[stage 2 evidence](captures/consolidation-stage2-2026-10-14/README.md).
Local commit only; stage 3 follows under the owner's request to execute all
remaining stages. Native desktop remains unverified.

## 2026-10-14 — Editor consolidation stage 1: shared glyph catalog

Created `apps/editor/src/editor/glyphCatalog.ts` and reused it in selection,
Texture Studio and the sandbox terrain layer menu. Family labels, known part
names, default world sizes, alphabet lookup and model-color inspection now
have one editor source. The Studio uses Wet grass / Character and the same
part labels as the inspector. Its inherited character body size now matches
the renderer's existing .155 m default instead of displaying .19 m.

No controls were removed. Saved IDs, document format and rendering recipes
remain unchanged. The sandbox only needed a catalog import/label lookup;
decomposition was unnecessary at this stage. The owner's uncommitted plan
remains untouched. No authoring/MCP format migration is needed for stage 1.

Validation: pnpm check passed (114 tests, boundaries, types/build), plus
verify:textures (85 checks), verify:gltf (18) and verify:authoring (67) with
pnpm dev running from threadfin. Added browser assertions for panel parity,
inherited character size, explicit RGB, parts and stable terrain layer names.
The historical item-roundtrip document was opened with cdpshot before/after:
the world viewport comparison has RMSE 0. Orca commands used the editor's
explicit page ID at localhost:1440; labels and color matched and its document
was preserved. Orca screenshot capture timed out; GPU Chromium images were
inspected instead. See [stage evidence](captures/glyph-catalog-stage1-2026-10-14/README.md).

The observed A5 mismatch was not reproduced on the current pretzel selection:
both panels already showed #d1894b before the refactor. Model-color detection
is shared now. Moss is a terrain layer, not a supported glyph family; its
label/ID was preserved pending stage 6. The core follow-ups at the end of the
plan are partly stale after c93f647; the snow baseline remains pending.

Stage 1 ends with a local commit and no push. Stage 2 and subsequent stages
have not started. Native desktop and physical mobile interaction are untested.

## 2026-10-14 — Embedded map switching in the Pages gallery

The owner requested an iframe so visitors can click between the five demos
without leaving the presentation. The gallery now contains one viewer with
Dark Forest, Rain Marsh, Snow Pines, Old Mine and Sunken Cathedral buttons.

- Map buttons replace only the iframe document and update its selected button,
  description, title and separate-window link. The owner also requested removal
  of the duplicate area row: public `embed=1` views omit it. The separate-window
  link opens the standalone viewer with its five-map menu.
- Kept plain links in the README and derive gallery choices/descriptions from
  them. Added small viewer CSS/JS files; the local preview serves their MIME
  types and embeds the published public demos.
- Kept the public five-map restriction and visualization controls. Engine,
  scene recipes, saved documents and historical baselines are unchanged.
- Extended the real browser verifier with embedded map switching, keyboard
  activation, control reloads, viewer interaction, both routes and mobile layout.

Validation: pnpm check passed (114 tests, boundary guard, types/build). The
production artifact passed 37 GPU/browser checks, with no page exceptions,
failed HTTP responses or local WebSockets. The 390px gallery viewport has no
horizontal overflow; this does not validate touch gestures on physical devices.
Orca confirmed switching and absence of the area row. Its full-window screenshot
timed out; the desktop image was captured with cdpshot and inspected instead.
See [embedded viewer evidence](captures/embedded-map-viewer-2026-10-14/README.md).

## 2026-10-14 — Five-map public viewer and hosting branch

The owner clarified that the public demo should expose only Dark Forest,
Rain Marsh, Snow Pines, Old Mine and Sunken Cathedral for viewing.

- Limited the public area registry/menu to those five IDs. Unknown and authoring
  URLs fall back to Dark Forest. Removed the public Scene Editor link.
- Retained camera, glyph/light, pause and PNG capture controls. Public views
  disable object selection, file/preset import and authoring API initialization.
  The local editor and exported players retain their tools and area library.
- Changed publication to the gh-pages hosting branch after GitHub repeatedly
  blocked artifact deployment on completed commit c93f647 and refused its
  cancellation. The source and compiled artifact had passed all checks.
- Added a publisher with an isolated Git index, append-only hosting commits and
  regular pushes. Main contains source; generated files live in the hosting
  branch. Actions requests the native Pages build after publishing.

Validation and final viewer captures are recorded in
[five-map evidence](captures/five-map-demos-2026-10-14/README.md).
Publication succeeded from source 66dbe5c through hosting commit 64e224e.
Both the native Pages deployment and main publication workflow passed.
All 24 checks also passed against the live HTTPS site, including the five-map
menu and authoring URL fallback. Orca opened the public cathedral and confirmed
the five options. The public viewer produced no failed HTTP responses, page
exceptions or local bridge connections.
Historical renderer recipes, baseline images and scene IDs are unchanged.

## 2026-10-14 — Live browser sandbox on GitHub Pages

The owner requested public, interactive links for Dark Forest and Sunken
Cathedral rather than local-only URLs. Added a prominent browser section in
the README/Pages gallery linking both demos, Scene Editor and the other areas.

- Added a GitHub Actions Pages workflow that checks the workspace and publishes
  the gallery plus a fresh editor at /ascii-engine/sandbox/ on main pushes.
- Added pnpm pages:build. The artifact combines tracked docs and relative-path
  application bundles in ignored .cache/pages; browser profiles are excluded
  and compiled bundles stay out of Git. Existing gallery/media URLs remain.
- The public build skips optional game.json probing and local bridge sockets
  while retaining in-page authoring. Local MCP and exported games keep their
  setup. Added a self-contained glyph favicon to avoid missing-icon requests.
- Added pnpm verify:pages for production/public browser checks, including area
  switching, scene creation, texture editing/undo and persistent drafts.

Validation: pnpm check passed (114 tests, boundary guard, types/build).
The production artifact passed 24 GPU WebGL/browser assertions beneath the
project prefix, without failed HTTP responses, page exceptions or local
WebSocket attempts. Local MCP passed 32 assertions. Inspected cdpshot and
Orca at localhost:1440 plus the generated gallery. See
[evidence and public verification command](captures/live-sandbox-pages-2026-10-14/README.md).
Rendering recipes and historical baselines are unchanged. Native desktop and
mobile touch interaction remain unverified; MCP still uses the local setup.

## 2026-10-14 — Independent preset defaults and documented alias

Applied the four small follow-ups to the package-boundary review:

- Documented core /pomorog as the official alias for the optional content pack;
  /presets exposes the same API for compatibility. Updated START and ADR 0003.
- Added generic DEFAULT_WATER_LOOK for rendering, scene validation, authoring
  commands and the MCP reference. Moved FOREST_WATER to the optional pack as
  an independent deep copy. All existing water numbers are byte-identical.
- Restored AsciiStyle field comments with the established adjustment ranges.
- Made POMOROG_FIRE an independent deep copy of DEFAULT_HEAT_GRID. Added
  two regression tests that mutate nested preset data and check core isolation.

Validation: pnpm check passed (101 + 12 + 1 tests, boundary guard, type checks
and production build). Water WebGL verification passed 14 assertions and eight
bank/camera checks; actual MCP passed 32 assertions, including generic water
defaults. Inspected cdpshot, water reflection and full-window Orca captures.
Orca capture succeeded in this session; native desktop remains unverified.
See [evidence](captures/preset-defaults-2026-10-14/README.md).

Historical snow baselines are unchanged and still require a separate approved
visual update. Large-file decomposition, editor unit coverage, historical media,
live document filenames and shared skill storage remain outside this stage.

## 2026-10-14 — Enforced package boundaries and explicit presets

After Pages/MCP publication, the owner selected the package-boundary portion
of the architecture review. Added [ADR 0003](decisions/0003-package-boundaries.md)
and updated START and consumer guidance.

- Moved combat timing/feedback, marsh contact state and snow-track policy
  from core presets to editor src/pomorog. Shared combat timing now comes
  from the existing editor motion module. Recipes and draw order are intact.
- Moved AsciiStyle and type-free defaults into config.ts. The renderer
  owns copied settings and receives its type/effect libraries explicitly.
  The editor factory supplies Pomorog for the map and isolated previews.
- Separated generic heat-grid data and snow particle sampling from optional
  content. Added core /techniques, /world, /fx, /presets and /pomorog entries;
  the root retains generic exports and no longer imports optional presets.
- Published the lightweight authoring/schema and automation/bridge entries.
  Transport and Vite imports use package names; the editor's automation
  dependency is development-only. Updated the workspace lockfile.
- Added a package-direction/import-graph guard to pnpm check and meaningful
  config ownership tests. A dynamic cross-package negative probe failed as
  expected; standalone WebGL verified that no game library is implicit.

Validation: pnpm check passed (112 tests, types/build and 41-module boundary
guard), 72 texture WebGL assertions, 31 actual MCP assertions and the full
authoring regression passed. Cold dev startup through public entries passed.
All six controlled scene comparisons are below .04, reference exactly zero.
Initial snow capture variation reproduced on unchanged original main;
fresh original/current comparison was .0071. Historical baselines are intact.
See [evidence and limits](captures/package-boundaries-2026-10-14/README.md).
Orca direct rendering/runtime and cdpshot succeeded; Orca full-window capture
still timed out. Native desktop and compiled consumer distributions remain
unverified. The published v0.1.0 tag retains its original source API.

Follow-ups: large-file decomposition/formatting, editor logic unit coverage,
historical media storage, live document filenames and shared skill storage.
Checked that docs/captures/diff contains no tracked files. No history rewrite
or reference-archive changes were performed.
New full comparison screenshots are retained as a release evidence archive;
only logs/results and representative images enter this stage's Git commit.

## 2026-10-14 — Public Texture Studio and AI/MCP showcase

The owner noticed the release had not updated the Pages gallery and asked to
make AI authoring visible. Confirmed six old chapters and a 404 at the Pages
root. Added chapter 07 and a prominent AI/MCP workflow with setup, an example
prompt, real scene capture and explicit coverage of supported visual features.

- Recorded the current English Texture Studio in isolated GPU Chromium:
  object/part, letters/fonts, layout, letters-only, ink/palette, preview lights
  and Apply/Save/Assets. Preserved the owner's normal draft.
- Uploaded the 36.33-second, 5.4 MiB MP4 to v0.1.0; its SHA-256 matches the
  local file. New full footage stays in ignored .cache/showcase, while its
  344 KiB GIF and screenshots are versioned. Historical media is unchanged.
- Generated docs/index.html and docs/watch.html from README. Chapter
  navigation/video sources now derive from the README, including release
  assets. Updated showcase instructions, START and portable MCP setup paths.
- Extended actual MCP integration with Unicode/font/open/palette textures,
  independent preview lights, imported named parts and export/reopen.

Validation: pnpm check passed (109 tests, types/build), 31 real MCP assertions
passed, MP4/GIF full decoding passed, GIF has 32 distinct frames, and local
gallery playback/desktop/mobile checks passed with seven players and no
horizontal overflow or runtime errors. Orca decoded the MP4 and verified
content; its background-media policy/full screenshot could not verify visible
playback, so GPU Chromium supplied that evidence. See
[captures](captures/texture-pages-2026-10-14/README.md).

The owner selected package-boundary corrections as the next stage after
Pages/MCP publication. Git history/media migration and broad formatting remain
separate follow-up work. Native desktop remains unverified.
Pages commit 957f64c completed its build; live root/watch pages, public release
video playback and mobile layout were verified successfully.

## 2026-10-14 — Texture Studio release publication

The owner explicitly authorized committing the validated texture work to main
and publishing a GitHub release. Published the repository's first source
release, v0.1.0 — Texture Studio, from feature commit 2c42abf.

- Added [versioned release notes](releases/v0.1.0.md) with the editing workflow,
  glyph/font/visibility/color controls, independent preview lights, reusable
  assets, automation, compatibility and concrete current limits.
- Reused the actual [Orca screenshot](captures/texture-controls-2026-10-14/orca-window.png)
  and attached the validated Blue hatch / Emerald symbols texture files plus
  the portable multipart example scene as downloadable release assets.
- Fetched origin/main before integration; it matched the feature branch's
  starting commit, 07eee6a. Fast-forwarded the clean main checkout and pushed
  main and the annotated v0.1.0 tag atomically, without overwriting other work.

Validation reviewed: pnpm check (109 tests, types/build), 71 texture WebGL
assertions, full authoring/API regressions, Orca and cdpshot evidence, and
git diff --check. This publication stage changes documentation only beyond
the already validated implementation. Native desktop execution and arbitrary
decoder-dependent models remain unverified; no reference files were changed.
Verified the published release is neither draft nor prerelease, all three
assets are uploaded, and its screenshot URL serves image/png with HTTP 200.
At publication, remote main and the peeled tag both resolved to 2c42abf;
both local checkouts were clean. This follow-up records publication without
changing the release tag or runtime implementation.
Published release: [v0.1.0](https://github.com/joaovrmoraes/ascii-engine/releases/tag/v0.1.0).

## 2026-10-14 — Expanded texture, visibility and lighting controls

The owner asked for broader control over letters, character sets, letters-only
rendering, illumination and its colors. Explained that the initial editor did
not expose every engine parameter, then expanded the concrete requested areas.

- Up to 128 single Unicode characters, starter alphabets, installed font
  families and regular/bold weight; atlas dimensions/indexes use character
  counts, preserving supplementary characters. Added letter rotation.
- Explicit letters-only/dark-occluder choice and front/both body faces. Surface
  gaps are discarded in letters-only mode, allowing the world behind to show;
  body meshes become invisible. Existing defaults remain unchanged unless
  these new fields are authored.
- Editable 2–8-stop color palettes, scene/uniform local shading and emissive
  color/intensity. Palettes replace base color and receive colored lighting;
  self light does not create lights affecting other objects.
- Studio light controls for exposure/background, main color/intensity/
  direction/shadows, ambient sky/ground, fill and fog. Optional
  TextureAsset.previewLighting saves the rig separately from material style.
  Texture application preserves scene lights. Explicit actions apply studio
  lighting with scene undo or save it as an atmosphere asset.
- Added navigation between control groups and avoided rebuilding letter
  geometry/materials during lighting-only edits. Extended validation,
  texture.define metadata, API references, START and the editor guide.

Validation: pnpm check passed (109 tests, types/build). The real WebGL texture
suite passed 71 assertions, including changed surface/body pixels, Unicode,
fonts/weight, rotation, palettes, self light, real gaps, face visibility,
colored lighting, uniform shading, both histories and all save/reopen/file
paths. No runtime/shader errors. Existing authoring and API regressions passed.

Evidence: [expanded texture captures](captures/texture-controls-2026-10-14/README.md),
including Orca full-window/direct renderer screenshots, cdpshot and logs. The
API bridge was restarted after dev reloads temporarily left it unavailable;
an authoring run interrupted by live source reload was rerun after edits
finished. Isolated profiles handled save/apply checks, preserving the owner's
normal draft. Prior texture-stage evidence remains available.

Limits: named surface/body parts, not automatic face/material-slot splitting.
Fonts use installed families/fallbacks and are not embedded. Compound glyph
sequences, raster painting and transparent PNG export are not supported here.
Water, terrain/carpet and effects keep their own modules. Native desktop and
arbitrary external/decoder-dependent GLTFs were not validated in this stage.
No push or publication was performed.

## 2026-10-14 — Separate texture authoring module

Added Studio → Textures alongside Effects and Atmosphere, plus Create texture
on the main toolbar and a Textures category in Assets. Reviewed both supplied
WhatsApp videos for the character/contrast/color adjustment workflow.

- Dedicated texture editor and disposable object preview modules. Select a
  placed object or named part; orbit, pan, zoom, frame and pause motion. The
  map pauses while the preview engine renders the selected model independently.
- Custom printable ASCII alphabets, world size, spacing, density, RGB,
  strength, contrast, light threshold and discrete shadows work on surface and
  body letters. New recipes use black gaps. Existing Pomorog defaults remain
  unchanged when these optional fields are absent.
- Presets preserve each target's technique/family unless explicitly chosen.
  Applying a crown texture preserves trunk styles. Applying then switching
  parts retains committed changes in the preview. Local history handles edits
  and resets; applying to the source creates one normal scene undo action.
- SceneDoc.textures stores named appearance snapshots. Save/update/copy,
  library reopen/reuse and .texture.json download/import are supported.
  Drafts, project files, item insertion and exports preserve the assets.
- Added texture.define / texture.apply, resource removal, scene summaries,
  Studio navigation and capture support to authoring/API/MCP. Core remains
  independent of editor/UI/game content. Custom atlases release with materials.
- Updated START, editor guide and API documentation. Added validation of all
  texture shader parameters, recipe boundaries and printable ASCII limits.

Validation: pnpm check passed (97 tests, types/build); 38 real WebGL texture
assertions passed, including changed rendered pixels, named imported parts,
source isolation, both histories, clearing prior alphabet/RGB, save/reuse,
file import/download, reload and module switching. Existing full authoring and
API regressions passed. No shader or runtime errors.

Evidence: [texture studio captures](captures/texture-studio-2026-10-14/README.md),
including before/after, all control groups, body/imported parts, cdpshot and
actual Orca renderer capture/runtime results. Orca full-window captures timed
out because its panel did not draw compositor frames; DOM and direct renderer
captures succeeded. Save/apply tests used isolated Chromium profiles and the
owner's normal draft was preserved.

Outstanding scope: raster painting/image texture creation, semantic face or
material-slot segmentation, cross-project libraries, live preset links and
native desktop execution are not part of this stage. Image/video conversion
continues through Effects. No push or publication was performed.

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
