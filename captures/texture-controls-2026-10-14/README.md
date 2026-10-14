# Expanded texture controls — 2026-10-14

The owner asked whether the creator could edit every aspect: chosen letters
and character sets, letters without a solid background, lighting and light
colors. The initial module supported ASCII ink/layout and inherited scene
lights, with a fixed font. This stage expands the actual rendering controls.

| Evidence | Content |
| --- | --- |
| [Letters only on surfaces](06-letters-only-block.png) | Unicode arrows, alternate bold font and discarded surface gaps. |
| [Letters only on a body](06-letters-only-import.png) | Imported crown without an occluder; trunk remains independently styled. |
| [Studio lights](07-preview-lighting-import.png) | Editable colored main light, ambient/fill colors, direction, shadows and fog. |
| [Orca window](orca-window.png) | Actual Orca Browser screenshot of the expanded creator. |
| [Orca canvas](orca-preview.png) | Direct capture from the same Orca renderer. |
| [Orca runtime](orca-runtime.json) | Unicode/font/open/light draft; the source object's options remained unchanged. |
| [cdpshot](cdpshot-controls.png) | Required GPU Chromium capture reopening the saved preset and light rig. |
| [Extended texture file](symbols.texture.json) | Downloaded and re-imported font/symbol/visibility/light recipe. |
| [Complete scene](test-scene.ascii.json) | Applied imported-part appearance and its independent saved studio lighting. |

Added: up to 128 single Unicode characters, six character-set starters,
installed font families and regular/bold weight, letter rotation, explicit
letters-only/dark-occluder modes, front/both body faces, 2–8 palette stops,
scene/uniform material shading, and emissive color/intensity. Palette colors
replace the base ink color and react to scene lights. Surface letters-only
mode discards gaps instead of merely making them black; open body mode hides
the solid mesh.

Custom studio lighting includes exposure, background, main color/intensity/
direction/shadow strength, ambient sky/ground colors/intensity, fill color/
intensity and fog. It lives in optional TextureAsset.previewLighting and does
not alter the source scene when editing or applying a texture. Explicit
buttons apply the rig to the scene or save it as a separate atmosphere.
Lighting-only edits reuse the sampled geometry and glyph materials.

Validation: pnpm check passed, with 109 unit tests, type checks and production
build. The texture WebGL suite passed 71 assertions, including rendered pixel
changes on surfaces and imported bodies; Unicode/font/weight/rotation/palette/
emission; genuine letters-only gaps; front/back visibility; light color and
intensity; uniform shading; source isolation; and asset/project/file roundtrips.
Applying preview lights and undoing that application passed. No runtime or
shader errors. Existing authoring and API suites also passed.

The first API attempt found the local bridge unavailable after development
hot reloads; it was restarted with pnpm api and the suite rerun. An authoring
attempt was interrupted by a live reload while source was still changing;
the stable-source rerun passed. These are recorded as development validation
recoveries, not a claim that arbitrary external models have been validated.
Orca's full-window screenshot succeeded in this stage. Save/apply tests used
isolated browser profiles; the owner's normal draft was preserved.

Logs: [checks](check.log), [texture checks](regression.log),
[authoring](authoring.log), [API](api.log), [cdpshot](cdpshot.log),
[result](result.json). Run pnpm verify:textures with the editor on port 1440.

Limits: surface/body mesh appearances and named parts are supported. Water,
terrain/carpet and effects retain their own modules. The editor does not
segment arbitrary faces or material slots. Fonts use device-installed families
and fallbacks; font files are not embedded. Compound/combining glyph sequences
are rejected. Self light brightens letters without illuminating neighbors;
global exposure/tint still affects uniform local shading. The scene background
is separate from solid-body visibility; transparent PNG export is not added.
No new font files or real external models were imported in this stage. Native
desktop execution and arbitrary decoder-dependent models remain unverified.
