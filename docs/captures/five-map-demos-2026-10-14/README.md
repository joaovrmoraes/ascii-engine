# Five-map public viewer — 2026-10-14

The owner narrowed the hosted demo to five maps for viewing: Dark Forest,
Rain Marsh, Snow Pines, Old Mine and Sunken Cathedral.

The public menu contains only those IDs. Direct authoring URLs fall back to
Dark Forest. Camera, glyph/light, pause and capture controls remain, while
object selection, file import, preset loading and authoring initialization
are disabled. The local editor remains available through the documented setup.

Publication uses an automatically maintained gh-pages branch and native Pages
builds. GitHub's artifact deployment API repeatedly reported completed commit
c93f647 as in progress and rejected cancellation because it had finished.
The hosting branch preserves existing documentation/media URLs and the main
source checkout. The publisher uses a separate index and regular pushes.

Validation: pnpm check passed with 114 tests, type checks, production build
and the boundary guard. The public production artifact passed 24 browser/GPU
assertions; local MCP passed 32. See [check](check.log), [viewer](viewer.log)
and [local MCP](mcp-local.log). The publisher dry run preserved the source
checkout and its Git index. Representative screenshots show the updated
gallery and five-map viewer; full-window Orca and cdpshot were inspected.

Public verification also passed all 24 checks on the actual HTTPS site; see
[public browser log](public-viewer.log) and [network results](public-result.json).
Orca confirmed the public cathedral menu contains exactly the five maps.
Source 66dbe5c was published through hosting commit 64e224e. Both the
[Pages deployment](https://github.com/joaovrmoraes/ascii-engine/actions/runs/38603343784)
and [main publication workflow](https://github.com/joaovrmoraes/ascii-engine/actions/runs/38603348578)
completed successfully.

Run the
same GPU Chromium verifier against the live site:

```bash
pnpm verify:pages https://joaovrmoraes.github.io/ascii-engine/ /tmp/ascii-five-map-demo
```

It checks five-map navigation, visualization controls, unsupported-area fallback,
and absence of authoring tools, failed HTTP requests, page exceptions and local
WebSocket connections. Full captures stay in ignored .cache. Native desktop
and mobile touch interaction were not tested; historical baselines are intact.
