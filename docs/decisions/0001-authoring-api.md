# ADR 0001 — Local visual authoring through API and MCP

Date: 2026-10-11. Owner-requested scope: an agent can create all visual
content and edit the open scene, with preview and undo.

The contract is the same `SceneDoc` the editor saves/exports. Atomic
commands in `packages/authoring` transform copies and validate before
materialization. `scene.replace/patch` expose all fields, alongside
convenience commands for terrain, water, objects, resources and environment.

The editor adapter materializes the candidate before releasing the old
scene, maintains a session revision, locks editing during preview and
uses the existing history. An agent can apply directly or accept its own
preview; human approval is not mandatory. Stale revisions are rejected.

The HTTP/WebSocket bridge lives in `apps/automation`, listens on loopback:1442
and requires an explicit session. It never selects another tab automatically.
Vite starts it in development; `pnpm api` is the independent entry point.
The official MCP server uses stdio and adapts tools to the API. Local file
access stays in the MCP process with explicit paths; documents embed assets
without retaining private machine paths.

The core imports no HTTP, MCP, UI or game rules. Pomorog recipes remain
in the editor library. Exported players do not connect to the bridge.
Final game integration is outside this change.

Limits: the editor must be open; sessions change on reload; unaccepted
previews are volatile; desktop execution still needs validation; panel and
OS control are outside the content API. Tests cover contracts, isolation,
errors, transport and MCP through the real renderer, import, export and reopen.
