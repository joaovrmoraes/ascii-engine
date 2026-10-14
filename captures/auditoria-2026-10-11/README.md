# Audit evidence — 2026-10-11

Examined code: ed2d4f3. [Report](../../relatorio-engine-2026-10-11.md).
The engine was unchanged at this stage; these are observations, not a visual
before/after comparison. reference/ and comparison baselines were preserved.
Historical screenshots retain the interface language used at capture time.

## Captures

| File | Source / URL |
| --- | --- |
| [referencia.png](referencia.png) | pnpm compare, /?area=reference&pause=3 |
| [floresta.png](floresta.png) | pnpm compare, /?area=dark_forest&pause=5&peaceful=1 |
| [pantano.png](pantano.png) | pnpm compare, /?area=rain_marsh&pause=6 |
| [neve.png](neve.png) | pnpm compare, /?area=snow_pines&pause=6 |
| [mina.png](mina.png) | pnpm compare, /?area=old_mine&pause=5 |
| [catedral.png](catedral.png) | pnpm compare, /?area=sunken_cathedral&pause=5 |
| [sandbox.png](sandbox.png) | cdpshot.mjs, /?area=sandbox&pause=3 |
| [gltf.png](gltf.png) | cdpshot.mjs, /?area=gltf&pause=3 |
| [effects.png](effects.png) | cdpshot.mjs, /?area=effects&pause=3 |
| [sandbox-orca.png](sandbox-orca.png) | Orca Browser, localhost:1440/?area=sandbox, 1705×919 |
| [exportacao-web.png](exportacao-web.png) | cdpshot.mjs, exported player on port 1441, /?pause=5 |

GPU Chromium (--use-angle=gl): 1600×757 captured viewport from a requested
1600×900 window. Comparison images were copied from docs/captures/diff/
without updating baselines. Pomorog references inspected:
procedural-forest-start.png, after-world-glyph-closeup.png and
all-areas-ground-cover.png. Different camera framing makes this a qualitative
style comparison; owner acceptance remains separate.

## Checks

- pnpm check passed: 25 tests in 7 files, types and build. No editor tests yet.
- pnpm compare passed all six views: reference 0.0000, forest 0.0095,
  marsh 0.0272, snow 0.0041, mine 0.0134, cathedral 0.0088 RMSE.
- GLTF demo exported/reimported 26852- and 31268-byte models with swim clip
  and named parts. No page exceptions in its captures.
- Running campfire: 74 glyphs, one effect, four emitters, 6000-glyph budget.
  The UI counter can lag the engine reading by one frame.
- Orca snapshot returned sandbox controls and screenshot returned a valid
  image. The earlier hidden-panel failure did not occur in this session.

## Web export

node scripts/export.mjs was run with --title 'Auditoria ASCII Engine',
--area dark_forest and --out /tmp/ascii-engine-audit-export-20261011-1700.
The web folder was served over HTTP on port 1441 and captured with cdpshot:
expected title, player class, hidden main panel and ready canvas. No new
Tauri build or desktop launch. The temporary server was stopped afterward.

## Authoring probes

[sondas.js](sondas.js) uses the real API and editor prefabs, without mocks;
[resultados-sondas.json](resultados-sondas.json) records observations. Tests
used a disposable Chromium profile, without changing owner files/localStorage.
The probes mutate only their test scene and deliberately finish with a scene
without terrain. To reproduce, start pnpm dev and run cdpshot in a disposable
profile with PRE set to the contents of sondas.js and EXPR to
JSON.stringify(window.audit), URL /?area=sandbox&pause=3 and a 4000 ms wait.

Observed at that commit: instance size .31 missing from JSON; brightness .8
missing; type size .29 replaced by prefab default .19; rebuilt tree geometry
differed; removed carpet still updated; emptyScene() caused a TypeError.
These findings are historical and were addressed in later authoring stages.
The probes do not replace automated UI tests; long-session behavior and
recovery after open failures remained unverified at audit time.
