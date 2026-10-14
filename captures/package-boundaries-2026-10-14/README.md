# Package boundaries — 2026-10-14

The owner chose package-boundary corrections after the public Texture/MCP
showcase. Generic renderer entries now avoid optional Pomorog presets;
the editor supplies appearance and effect libraries explicitly. Combat,
marsh contacts and snow-track policy moved into the editor.

## Validation

- [Checks](check.log): 112 tests, type checks, production build and the new
  import-direction/entry-graph guard passed. The guard inspected 41 generic
  modules and rejected a deliberately introduced dynamic cross-package import
  in an isolated [negative probe](boundary-negative-probe.log).
- [Texture WebGL](textures.log): 72 assertions passed, including a standalone
  core engine with no implicit game types or named game effects, supplied
  custom effect recipes, all rendering controls and document/file roundtrips.
- [Real MCP](mcp.log): 31 assertions passed through the stdio client, including
  textures, named parts, scene previews/history, actual image capture,
  import and complete export/reopen.
- [Authoring](authoring.log): the full existing editor interaction suite passed.
- [Cold startup](startup.log): Vite started through the public automation bridge
  entry, using the workspace dependency and public schema contract.

## Visual preservation

Captured the original six scenes before changes at main commit 957f64c.
The [controlled comparison](comparison.json) passed: reference 0.0000,
forest 0.0005, marsh 0.0098, snow 0.0071, mine 0.0085, cathedral 0.0134.
The normal limit is 0.04.

The first snow comparison measured 0.1093. Repeating the unchanged original
main on a separate server reproduced 0.1093 against that initial capture.
Comparing the fresh original control with the modified renderer measured
0.0071. The snow field/footprint/drawing function bodies are unchanged.
The initial samples and both comparison logs are retained; historical
`docs/captures/baseline` images were not updated.

All original, modified and difference screenshots are retained in the
[complete evidence archive](https://github.com/joaovrmoraes/ascii-engine/releases/download/v0.1.0/package-boundaries-2026-10-14-evidence.zip).
It includes before/, after/ and original-repeat/ plus the original logs.
The repository keeps the [cdpshot snow](cdpshot-snow-00.png) and the actual
[Orca renderer](orca-reference.png) with [runtime metadata](orca-runtime.json).
Orca confirmed the reference scene and the six explicitly supplied editor
types. Its full-window compositor capture timed out; direct WebGL capture
and GPU Chromium screenshots succeeded.

The archive is validation evidence for the main branch's boundary refactor,
based on commit 957f64c. Its storage under v0.1.0 does not change that source
tag or imply the refactor belongs to the tagged release.

Native desktop execution, arbitrary decoder-dependent models and compiled
consumer distributions were not verified. Saved scene versions/IDs and the
published v0.1.0 source tag were preserved. Source imports of optional presets
now use `/presets` or `/pomorog`; see ADR 0003 for migration and follow-ups.
