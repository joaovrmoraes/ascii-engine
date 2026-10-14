# Live GitHub Pages sandbox — 2026-10-14

The public gallery now links to the complete browser editor at
https://joaovrmoraes.github.io/ascii-engine/sandbox/.

- `?area=dark_forest`: forest, animated characters and scripted combat.
- `?area=sunken_cathedral`: interior lighting, glyph construction and water.
- `?area=sandbox`: scene authoring, including Texture, Effects and Atmosphere.
- Rain Marsh, Snow Pines and Old Mine are also linked directly.

The Pages workflow builds a fresh editor and combines it with tracked
documentation in ignored `.cache/pages`. Relative bundles work under the
project path. The hosted build retains the in-page authoring API and skips
local bridge connections and optional exported-game configuration; local MCP
and normal exported players retain their behavior. Compiled bundles stay out
of Git. Existing scene rendering and historical baselines are unchanged.

Local validation:

- [pnpm check](check.log): boundary guard, 101 + 12 + 1 tests, type checks
  and production build passed.
- [Production artifact](pages-local.log): 24 GPU Chromium assertions passed
  under `/ascii-engine/`, covering five areas, shareable area switching,
  camera/light controls, scene authoring, Texture Studio apply/undo and
  browser draft recovery. No failed HTTP responses, page exceptions or local
  WebSocket connections occurred.
- [Local MCP](mcp-local.log): all 32 assertions passed after adding the
  public-build flag.
- Inspected [gallery](gallery.png),
  [production cdpshot cathedral](cdpshot-cathedral-00.png) and
  [Orca Browser cathedral at localhost:1440](orca-cathedral-local.png).

Reproduce against the deployed public site:

```bash
pnpm verify:pages https://joaovrmoraes.github.io/ascii-engine/ /tmp/ascii-pages-public
```

This verifier uses an isolated browser profile and leaves existing drafts
untouched. Full test captures stay in ignored `.cache/`. Native desktop and
mobile touch interaction were not tested in this stage.
