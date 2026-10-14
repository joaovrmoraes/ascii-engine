# Composition — cameras and effect origins

Before: [Studio without positioning](../studio-assets-2026-10-11/efeito-void-salvo.png).

- [Layer origin/gizmo](efeito-origem-gizmo.png): moved Flame, other layers
  preserved, recipe saved.
- [Scene camera](camera-na-cena.png): editor-only gizmo/view volume.
- [Camera view](camera-cdpshot.png): cdpshot.mjs, 16:9 framing and inspector.
- [Player](camera-player.png): reopened document honors initial camera;
  no editor helpers.
- [MCP capture](mcp-camera.png): saved framing captured through API/MCP.
- [Orca Browser](orca-gizmo.png): Studio gizmo/XYZ fields, without saving
  test content into the owner's document.

[Composition](verify-composition.log), [authoring](verify-authoring.log),
[API/MCP](verify-api.log) and [visual regression](verify-visual.log) passed.

Composition checks use native mouse input on camera/layer gizmos; verify one
undo action per drag, independent effect history, Ctrl S, reopening and the
initial player camera. Orthographic cameras are supported; editor navigation
is independent. Screenshots show the historical Portuguese interface.
