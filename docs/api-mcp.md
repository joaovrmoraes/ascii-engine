# AI visual authoring — API and MCP

An agent can access the editor's full visual document: terrain, painting,
water, models, objects and their parts, effects, textures, lights, atmosphere, weather
and export. It can edit the open scene, show a preview or apply directly.
Each applied batch becomes one undo action.

This covers visual features implemented in the editor. The API does not
create game rules, install a Pomorog importer or add unsupported renderer
features.

## Start and connect

From the project root:

```sh
pnpm install
pnpm dev
```

Open `http://localhost:1440/?area=sandbox`. Development also starts the
API at `http://127.0.0.1:1442`. Every tab has its own session; the agent
must explicitly select `sessionId`. The server never chooses the first
available tab automatically.

The MCP server uses **stdio**. For an MCP client, adapt the paths in
[`.mcp.example.json`](../.mcp.example.json) to your installation. Run directly
from the project root with:

```sh
node apps/automation/node_modules/tsx/dist/cli.mjs apps/automation/src/mcp.ts
```

`pnpm mcp` also starts it through the workspace. The process speaks JSON-RPC
through stdin/stdout; it is not an interactive terminal. The project does
not modify your AI client's global configuration.

To use the built/desktop editor with a separate bridge, start `pnpm api`
and open the editor. Exported players never connect to authoring.
Desktop integration has not been executed in this stage; end-to-end
verification used the web editor with Chromium and GPU.

`ASCII_ENGINE_API` changes the address used by the MCP server. The bridge
listens on loopback only, on port 1442; it is not a public service.
Allowed browser origins are localhost:1440, 127.0.0.1:1440 and local Tauri
origins. The HTTP API does not enable CORS for external sites.

## MCP tools

| Tool | Operation |
| --- | --- |
| `engine_sessions` | Lists connected scenes, revision and pending preview. |
| `engine_reference` | Live catalog, command schema, complete effect/water/style presets and document contract. |
| `scene_read` | Reads scene and revision. `full: true` includes all arrays and embedded sources. |
| `scene_validate` | Validates a batch and its references without editing. Models are decoded when applied. |
| `scene_apply` | Applies a command batch. `preview: true` by default; `false` applies directly. |
| `scene_preview` | `accept` saves the preview; `cancel` restores the previous scene. |
| `scene_history` | `undo`/`redo` using the same history as the interface. |
| `object_inspect` | Object document, parts, ASCII options and animation clips. |
| `editor_view` | XYZ focus, horizontal angle, `elevation` in radians (0.02–π/2−0.01), zoom, pause, saved camera and Studio page. |
| `water_disturb` | Transient impulse: `index`, `x`, `z`, `strength` (−1–1), `radius` (0.05–8 m). Does not change revision/history. |
| `editor_capture` | Returns a rendered scene PNG as MCP image content. |
| `assets_import` | Imports GLB or GLTF and companion files from explicit local paths. |
| `scene_open` | Opens a local visual document, with preview or direct application. |
| `scene_export` | Exports a document with embedded models/effects; requires `overwrite: true` to replace a file. |

Recommended agent workflow: list sessions → read scene/revision → consult
catalog and required references → build a batch → preview → capture and
inspect → accept. An agent can accept its own preview or apply directly.
**Apply** and **Discard** buttons are also available in the editor; they
are not a mandatory human approval gate.

Editing controls are locked during a preview; camera navigation remains
available. Preview does not enter the draft or history until accepted.
Closing/reloading the tab discards an unaccepted preview. Manual edits
advance the revision; commands based on an older revision fail. Read again
before retrying, including after timeouts or disconnection, because the
editor may already have completed the operation.

## Document commands

`engine_reference(topic: "commands")` returns the complete JSON Schema.
Operations include:

| Group | Commands |
| --- | --- |
| Full document | `scene.replace`, `scene.patch` |
| Objects | `object.add`, `object.update`, `object.remove`, `object.scatter` |
| Terrain | `terrain.create`, `terrain.stroke` |
| Water | `water.paint`, `water.update`, `water.remove` |
| Resources | `effect.define`, `asset.define`, `resource.remove` |
| Environment | `atmosphere.set`, `environment.set` |
| Saved atmospheres | `atmosphere.define`, `atmosphere.apply` |
| Cameras | `camera.define`, `camera.update`, `camera.remove`, `camera.activate` |

`scene.patch` recursively merges objects and replaces entire arrays.
`unset` removes optional document fields. Use it to edit heightmaps,
terrain weights/layers, carpet, advanced recipes, global/type styles and
any `SceneDoc` field even without a dedicated command. `scene.replace`
accepts a complete document.

Positions and dimensions use meters; Y is height. `rotation3` uses radians.
Integer colors are hexadecimal RGB converted to a number; `inkTint` and
particle colors use triples. Do not assign `water`, `carpet` or `particle`
to ordinary meshes: those techniques require their corresponding geometry.

Example batch, sent with the current revision:

```json
{
  "revision": 0,
  "preview": true,
  "commands": [
    { "op": "terrain.create", "size": 32, "resolution": 129 },
    { "op": "terrain.stroke", "strokes": [
      { "brush": "raise", "x": 2, "z": -3, "radius": 5, "strength": 3 }
    ] },
    { "op": "water.paint", "mode": "terrain", "radius": 1,
      "points": [{ "x": 2, "z": -3 }, { "x": 0, "z": 0 }, { "x": -4, "z": 3 }] },
    { "op": "object.add", "object": {
      "id": "central-campfire", "prefab": "fogueira", "position": [-3, 0, -2]
    } },
    { "op": "atmosphere.set", "style": {
      "moon": { "intensity": 1.8 }, "inkTint": [0.8, 0.9, 1]
    } },
    { "op": "environment.set", "weather": "rain", "intensity": 0.3 }
  ]
}
```

Built-in prefab and effect IDs such as `fogueira`, `caixa` and `raio` retain
their historical spelling for compatibility. Their editor labels are English;
always use IDs returned by the live catalog in commands.

`water.paint` without `index` creates water; with `index` it continues the
same mask. `erase: true` erases only water. `terrain` mode follows existing
slopes; `level` mode digs the bed and keeps a flat surface. Surface movement
on slopes follows the normal; there is no volumetric fluid simulation.
Reflections remain planar, with local approximation for slopes.

To create new objects, compose available prefabs/shapes or import GLTF/GLB.
`assets_import` does not guess companion files: list the model, buffers and
images. The response contains new IDs for `object.add`. `asset.define`
accepts an embedded source directly. Invalid models do not replace the
open scene. For new effects, copy a recipe from
`engine_reference(topic: "effects")`, adjust emitters/light, register it
with `effect.define` and id `fx:custom-NAME`, then place it with `object.add`.

Save lighting to Assets with `atmosphere.define`, using `id`, `name` and
`style`; omitted fields inherit the current lighting. This adds
`SceneDoc.atmospheres[id]` without applying it. `atmosphere.apply` with that
`id` applies lighting while preserving the rest of the document.
`resource.remove` accepts `kind: "atmospheres"`. Catalog, export, preview
and history include these assets just like those created in the Studio.
`atmosphere.set` continues to adjust current lighting directly.
`editor_capture` captures the isolated preview when the effect Studio is open.

## Composition cameras

`camera.define` accepts `id` and `camera`:

```json
{"op":"camera.define","id":"wide-shot","camera":{"name":"Wide shot","projection":"orthographic","position":[10,12,16],"rotation":[-0.6,0.3,0],"span":8,"aspect":1.7777777778}}
```

XYZ rotation uses radians; `span` is half the visible height in meters.
`near`/`far` are optional. `camera.update` changes pose/framing;
`camera.remove` deletes; `camera.activate` chooses the initial player id
(`id: null` clears it). All operations participate in preview, history
and export. `object_inspect` accepts camera IDs.

`editor_view(cameraId: "wide-shot")` opens that framing in the editor;
`cameraId: null` returns to navigation. This view does not change the
document. Capture preserves aspect ratio. Cameras live in
`SceneDoc.cameras`; the initial choice lives in `SceneDoc.activeCamera`.
Orthographic is the supported projection.

Effect emitters accept `name` and `offset: [x,y,z]`. The offset also works
for heat and trails, and matches the position manipulated by the Studio gizmo.

## HTTP and JavaScript API

```sh
curl http://127.0.0.1:1442/v1/sessions
curl http://127.0.0.1:1442/v1/request \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"TAB-UUID","request":{"method":"scene.read","full":false}}'
```

The HTTP envelope is `{sessionId, request}`; success returns `{result}`;
errors return `{error}` with a non-2xx status. Available methods are in
`packages/authoring/src/schema.ts`, with names such as `scene.apply`,
`preview.accept`, `history.undo`, `assets.import` and `editor.capture`.
HTTP import `files` contains `{name, data, mime?}`, with base64 bytes.

Within the page:

```js
const api = window.asciiEngineApi
const state = await api.request({ method: 'scene.read', full: false })
await api.request({
  method: 'scene.apply', revision: state.revision, preview: false,
  commands: [{ op: 'object.add', object: { prefab: 'caixa', position: [1, 0, 2] } }],
})
```

`@ascii-engine/authoring` also exports `applyCommands(doc, batch)` to
generate/validate documents without an editor or GPU. The editor checks
catalog prefabs and decodes models when materializing the scene.

## Surface water physics

`water.update` accepts `patch.physics`, for example:

```json
{"op":"water.update","index":0,"patch":{"physics":{"enabled":true,"depth":0.08,"gravity":9.81,"damping":2,"source":0.04,"waves":0.012}}}
```

Values use meters/seconds; `source` replenishes depth at high edges. Zero
closes the inlet. Without a source, simulation conserves volume; moving
objects/actors produces waves. Use `water_disturb` to inject an impact and
`editor_view.paused: false` to propagate it. The HTTP method is `water.disturb`.

The simulation grid has at most 129 × 129 cells and stays inside the mask.
It does not include volumetric fluid, expanding shores, a separate free
waterfall curtain, ballistic splashes or rigid buoyancy. Objects reflect
on calm planar regions; moonlight on slopes follows normals, the camera
and `style.moon`. Transient state is never written to the scene file.

## Limits and validation

- 20000 objects, 256 effect recipes and 256 saved atmospheres; terrain/masks up to 513 × 513.
- Up to 2000 commands per batch, 1000 brush samples and 2000 scatter instances.
- 32 MB per imported model; 45 MB total MCP file import; 64 MB transport limit.
- Editor history: up to 30 actions/64 MB, reduced when models are large.
- Up to 8 additional point lights illuminate glyphs; water at many different
  levels requires more reflection passes.
- The API covers visual content and editor cameras, not panel layout,
  operating system configuration or arbitrary code execution.
- The connection does not automatically install MCP in an AI client.
  Configure the client using the example; repository files do not add
  tools to an already running conversation.

Checks: `pnpm check`, `pnpm verify:api` (official MCP → HTTP → real editor →
export/reopen, isolated profile), `pnpm verify:authoring`, `pnpm verify:visual`
and `pnpm compare`. Screenshots:
[`captures/api-mcp-2026-10-11`](captures/api-mcp-2026-10-11/README.md).

The server uses the [official MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/v2/get-started/first-server),
stdio transport and JSON Schema tool discovery.

## Texture resources

`texture.define` stores `{name,style}` in `SceneDoc.textures`. `style` is a
`GlyphStyle`: optional surface/body technique, family, size, RGB color,
custom alphabet/font/fontWeight, open, faces, rotation, palette, lighting,
emissive/emissiveIntensity, spacing, density, strength, gap, contrast,
toneOffset and shadowSteps. Optional `previewLighting` stores an AtmosphereStyle
for the editor; texture.apply preserves the scene lighting. Omit fields to preserve more specific part styles.
`texture.apply` merges a saved recipe into one object's options or a named
part. Existing applications are independent snapshots.

```json
[
  {"op":"texture.define","id":"leaf-ink","name":"Leaf ink","style":{"alphabet":" .oO@","gap":0,"spacing":1.4,"color":6404214}},
  {"op":"texture.apply","id":"leaf-ink","objectId":"tree-1","part":"crown"}
]
```

`resource.remove` accepts `kind: "textures"`. `editor.view` accepts
`studio: "textures"`; captures use the isolated texture stage. Limits: 256
texture assets; alphabet 1–128 single Unicode characters with a visible character
(no control/combining sequences); font family 1–100 characters; fontWeight
400/700; open boolean; faces front/both; rotation -π–π radians; palette 2–8
integer RGB colors; lighting scene/unlit; emissive RGB and intensity 0–4; size .01–10 meters, spacing .5–4, density .05–1, strength 0–4,
gap 0–.015, contrast .1–4, toneOffset -1–1, shadowSteps 2–16 (integer).
The editor size slider covers .01–1 meters; the numeric/API range is .01–10.
