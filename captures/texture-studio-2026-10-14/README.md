# Texture studio — 2026-10-14

The owner requested a texture creator as a separate module, like the existing
Effects and Atmosphere studios: select an object, adjust the appearance and
save it for reuse. Reviewed both supplied WhatsApp videos (2026-10-14 at
08.06.08 and 2026-10-13 at 21.14.19 (2)); their character/contrast/palette
controls informed the workflow. The renderer continues to attach letters to
objects and parts, following the existing Pomorog visual rules.

| Evidence | Content |
| --- | --- |
| [Starting surface](01-surface-before.png) | Sample block with its original family and the studio's black gaps. |
| [Adjusted surface](02-surface-after.png) | Custom alphabet, cyan ink, larger letters and spacing. |
| [Layout and ink controls](05-layout-and-ink-controls.png) | World size, spacing, density, RGB, strength, contrast, threshold and shadow levels. |
| [Crown](03-body-crown.png) | Open body letters with the trunk's technique preserved. |
| [Imported part](04-imported-part.png) | Reused ink recipe on both leaves of a named imported crown, preserving foliage/body. |
| [cdpshot](cdpshot-texture.png) | Required GPU Chromium capture of the saved tree/crown texture. |
| [Orca preview](orca-preview.png) | Canvas captured from the actual Orca Browser renderer through the preview capture hook. |
| [Orca runtime](orca-runtime.json) | Selected target and draft style; source scene options stayed unchanged. |
| [Texture file](my.texture.json) | Downloaded appearance recipe, also reopened through the file input. |
| [Scene](test-scene.ascii.json) | Portable project containing the texture, per-part overrides and embedded multipart GLTF. |

Validation:

- `pnpm check`: 97 unit tests, all type checks and production build.
- `pnpm verify:textures`: 38 interaction/rendering assertions with an isolated
  Chromium profile. Every surface/body control changed real pixels with motion
  paused. Preview edits left the source unchanged. Applied crowns kept the
  trunk's technique; changing parts preserved committed preview edits.
- Applied textures, source undo/redo, editor undo/redo, asset save/reuse,
  download/import, project reopen, browser draft reload, clearing an existing
  alphabet/RGB override and module switching passed. No shader/runtime errors.
- Existing `pnpm verify:authoring` and `pnpm verify:api` suites passed, including
  effects, atmosphere, panels, cameras, complete exports and stale revisions.

Run with the editor on localhost:1440:

```sh
pnpm verify:textures docs/captures/texture-studio-2026-10-14
```

Logs: [checks](check.log), [texture regression](regression.log),
[authoring regression](authoring.log), [API regression](api.log),
[cdpshot](cdpshot.log), [result](result.json).

Orca's full-window screenshot repeatedly timed out because its embedded panel
was not drawing compositor frames, including after focusing the tab. Its
actual WebGL preview and DOM/runtime checks succeeded; the PNG above is that
renderer's canvas, not a full-window screenshot. Other UI screenshots are GPU
Chromium evidence. The owner's Orca draft was preserved; save/apply tests used
isolated profiles. Native desktop execution was not tested in this stage.

Scope: reusable 3D mesh/part appearance snapshots, not raster painting, semantic
face segmentation, material-slot editing or a global cross-project library.
Existing scenes retain their original defaults. New recipes use black gaps;
technique/family changes are stored only when explicitly selected. Saved
presets do not update existing instances automatically. Image/video-to-glyph
conversion remains in Effects.
