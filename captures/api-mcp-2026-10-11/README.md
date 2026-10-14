# Real authoring through MCP — 2026-10-11

Screenshots from `pnpm verify:api`, isolated GPU Chromium, without modifying
the owner's browser draft. The official MCP client started the stdio server,
discovered tools and passed through HTTP/WebSocket into the same visual
editor. Tested authoring commands did not use direct scene injection.

- `mcp-previa.png`: complete unaccepted batch, Apply/Discard buttons and
  manual editing locked.
- `mcp-cena.png`: image returned by `editor_capture` to the MCP client.
- `mcp-cena-editor.png`: accepted scene with imported model; later manual
  edits tested revision conflict.
- [Portable document](../../examples/mapa-mcp.pomorog.json): MCP export
  with terrain, water, trees, campfire, blue effect, atmosphere, rain and
  an embedded test GLTF.

Verified atomic application, complete cancel, one undo per batch, redo,
errors without resource loss, stale revisions, companion import, part
inspection, PNG capture, export without accidental overwrite and identical
reopen. The owner's MCP client configuration was not changed; this used
the integration client.

`orca-api-canvas.png`: read-only access to the owner's scene through its
API in Orca (revision 0). Canvas was rendered on demand because the tab
was not running animation frames. Viewport screenshot still timed out;
this is a canvas image, not the viewport. Historical UI language: Portuguese.
