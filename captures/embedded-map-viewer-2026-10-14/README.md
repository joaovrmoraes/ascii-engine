# Embedded five-map viewer — 2026-10-14

One iframe now shows the live demo inside both Pages gallery routes.
Five map buttons switch its document while the surrounding page stays open.
The buttons update the description, frame title and separate-window link.
Embedded URLs use `embed=1` to hide the duplicate area row, as requested.
Camera, light, pause and capture remain usable. Opening separately retains
the standalone viewer's five-map menu.

The README retains ordinary map links. The generator derives the iframe's
choices and descriptions from them. The local README preview embeds the public
origin; the production artifact shares its origin with the child viewer and
keeps the chosen map when a viewer control reloads its document.

Validation: pnpm check passed (114 tests, types/build and package boundaries).
The production artifact passed 37 real GPU/browser checks covering all five
embedded map switches, keyboard activation, control reloads, both gallery
routes, a 390px layout and the existing standalone viewer restrictions.
No failed HTTP requests, uncaught exceptions or local WebSockets occurred.

Representative desktop/mobile screenshots and logs are saved here. Full
verification captures stay in ignored .cache. Orca verified map switching and
the hidden area row; its full-window screenshot timed out. The desktop image
was captured with cdpshot and inspected instead. Historical rendering baselines
are unchanged. Mobile touch gestures and native desktop were not tested.

```bash
pnpm verify:pages https://joaovrmoraes.github.io/ascii-engine/ /tmp/ascii-embedded-viewer
```
