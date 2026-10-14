# Imported appearance and named parts — 2026-10-13

Reproduced the owner's report with pretzel.gltf, piramide.gltf and esfera.gltf.
All three files have one mesh/material, with embedded buffers. Changing a
surface letter size from .12 m to .40 m previously left the pixels unchanged.
The correction makes that size affect the local surface lattice.

| Evidence | Content |
| --- | --- |
| [Orca before](orca-before.png) | All three files with Wood and size .40; the shader still used .17 m. |
| [Orca after](orca-after.png) | Same models/family/size, visibly larger cells and new appearance controls. |
| [Imported models](imported-models.png) | GPU Chromium checks for surface/body sizes, families and RGB color. |
| [Imported tree parts](imported-tree-parts.png) | Named crown group selected independently of the trunk; two leaf meshes share its overrides. |
| [cdpshot](cdpshot-imports-00.png) | Three imported files with different sizes/families/techniques, captured by the required cdpshot.mjs script. |
| [Orca tree result](orca-tree-check.json) | Runtime evidence: both leaves body/foliage/.12/green, trunk surface/bark/.28. |
| [Regression log](regression.log) | Real WebGL import/control/persistence/ID checks; no runtime or shader errors. |
| [Check log](check.log) | Type checks, 81 unit tests and production build. |
| [Result](result.json) | Tested filenames and successful regression status. |
| [Default scene comparison](default-scene-comparison.json) | Same-machine original-code control against the changed core; historical baseline limitation. |
| [Example scene](test-scene.ascii.json) | Portable document embedding the three test models and their appearance settings. |
| [Tree fixture](tree-parts.gltf) | Small generated GLTF with named trunk, crown group and two leaves, plus optional glyph extras. |

Run with the editor at localhost:1440:

```bash
pnpm verify:gltf /tmp/gltf-verification /path/to/pretzel.gltf /path/to/piramide.gltf /path/to/esfera.gltf
```

Without model paths, the script uses its generated tree fixture. Checks use an
isolated Chromium profile and actual file-input upload. They verify visible
pixel changes, body point size/density, color/reset, all-copy and instance
scopes, undo/redo, save/reopen, whole-tree edits preserving techniques, nested
part groups, mouse selection, Blender defaults and import after deletion.
The full authoring interaction suite also passed; its captures are in
`authoring/`.

Orca used a separate browser profile to preserve the owner's draft. Early
before/after screenshots succeeded; later captures timed out when the embedded
page stopped drawing. Named-tree checks still ran through Orca's runtime, and
the tree image was captured in GPU Chromium.

Historical baseline comparisons exceeded their threshold in the original HEAD
snapshot as well as the changed code. Same-machine before/after RMSE is zero
for reference and below .01 for every default scene after a sequential forest
capture. The initial forest capture under concurrent GPU load is recorded
separately. No baseline or reference archive was changed.

No Blender export was run: the real files came from the owner, and the multipart
fixture was generated for the regression. Arbitrary decoder-dependent models,
material-slot-specific styling and native desktop execution remain unverified.
