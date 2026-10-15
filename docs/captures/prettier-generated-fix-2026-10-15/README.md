# Generated Pages and editor teardown — 2026-10-15

Fix commit: `b3d3784`.

## Generated-output audit

Compared the files touched by `393b309` with the output paths used by repository
generators. Only `docs/index.html` and `docs/watch.html` were generated outputs
that Prettier had changed. Both are now explicitly excluded and regenerated.

| Generator | Outputs | Formatter protection |
| --- | --- | --- |
| `scripts/preview-readme.mjs` | `docs/index.html`, `docs/watch.html`, local `docs/showcase/index.html` | Two new explicit exclusions; showcase already excluded |
| `scripts/build-pages.mjs` and Vite build | `.cache/pages/`, `apps/editor/dist/` | `.cache/` and `dist/` exclusions |
| `scripts/publish-pages.mjs` | Hosting Git objects, isolated `.cache/pages.index` | Outside source files or inside `.cache/`; publication not run |
| Showcase preparation/recording | `docs/showcase/`, `docs/captures/`, `.cache/showcase/`, temporary caption files | Existing exclusions or outside the repository |
| CLI/bridge project exports | `exports/`, `apps/editor/dist/`, native `target/` | Existing exclusions |
| Tauri-generated schemas/icons | `apps/editor/src-tauri/gen/`, binary/XML icons, native `target/` | Existing gen/target exclusions; icons were not formatted and have no supported parser |
| Independent video tools | `tools/video-edit/public/`, `out/`, `.cache/`, external edition directory | Explicit public/out exclusions added; cache already excluded; external output outside tracked files |
| Verification/comparison scripts | Capture folders, `.cache/`, temporary profiles/fixtures | Existing exclusions or outside tracked files |

`apps/editor/index.html`, `apps/editor/src-tauri/tauri.conf.json`, build scripts
and video source modules are maintained generator inputs. Build/export copies
are written elsewhere. No other generated output from the formatting commit
needs regeneration, and no generator needs to produce Prettier-formatted text.

## Validation

- [Cycle 1](check-1.log) and [cycle 2](check-2.log): regenerated Pages, then
  ran `pnpm check` successfully, with 159 tests per run.
- [Cycle metadata](two-cycles.json): exact source revision, matching page
  SHA-256 hashes and empty tracked status after generation and checking in
  both cycles. Full status preserved the two preexisting untracked owner plans.
- [Open-handle diagnosis](open-handles.log): before the fix, Vitest retained
  a listening bridge server on `127.0.0.1:1442` and emitted its close timeout.
- [Editor test](editor-teardown.log) and [owned-port test](editor-teardown-owned.log):
  tests exit normally after the fix, including when Vitest owns the bridge.
  The owned port was verified released after exit. No warning was suppressed.
- [Pages verification](verify-pages.log): 37 production gallery/demo checks.
- [Orca check](orca-editor.json): explicit isolated editor tab at port 1440;
  the saved owner draft was not edited.
- [Generated gallery capture](gallery-00.png): inspected page-only capture
  made with `cdpshot.mjs` against the local Pages artifact at port 4179.

No desktop screenshot, private window, push or publication is included.
