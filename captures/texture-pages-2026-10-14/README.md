# Texture Studio and AI/MCP presentation — 2026-10-14

The owner noticed that publishing Texture Studio's release had not added the
feature to the public Pages gallery, and asked to explain AI authoring through
MCP. The live gallery still had six chapters; the Pages root returned 404.

- Added chapter 07 with an actual recording of the current English editor,
  an animated README GIF, and object/part, letters/font, layout, visibility,
  color, light and save controls. The MP4 is hosted as a release asset;
  `.cache/showcase/07-textures.mp4` is local and ignored by Git.
- Added a prominent AI/MCP section with concrete supported workflows, setup
  links, an example prompt and a scene rendered through the real MCP server.
  All supported SceneDoc fields are accessible; this does not imply native
  packaging, gameplay or every transient interface gesture is an MCP tool.
- Generated Pages root and watch pages from the same README. Navigation and
  video sources come from chapter content, including externally hosted MP4s.

## Evidence

The recording contains 1,059 actual GPU Chromium screencast frames, normalized
to 1,090 frames at 30 fps, 1920×1080. Duration: 36.33 seconds, 5.4 MiB.
The 800 px GIF contains 32 distinct decoded frames, four seconds, infinite
loop, about 344 KiB. Full MP4/GIF decoding passed. [Recording metadata](recording.json)
and [recording log](recording.log) include timing and provenance.

Screenshots cover [part selection](01-object-and-part.png),
[letters/fonts](02-letters-and-fonts.png), [layout](03-layout.png),
[letters only](04-letters-only.png), [palette](05-color-palette.png),
[preview lights](06-preview-lights.png), [saved texture](07-saved-texture.png)
and [texture library](08-texture-library.png). The source scene was unchanged
until Apply, and the final part appearance and saved lighting recipe were
checked. The example is [portable](showcase.ascii.json).

Validation: [pnpm check](check.log) passed with 109 tests, types and build.
The [real MCP integration](mcp.log) passed 31 assertions with all 14 tools discovered,
Unicode/font/open/palette texture creation, named-part application, independent
preview lights, full document export/reopen, preview/history and scene captures.
New fixture labels were translated to English; the first test run detected
two camera assertions still expecting their old label. Those assertions were
updated and the complete suite rerun successfully.

The local gallery passed [real browser checks](local-gallery/result.json):
seven players, matching root/watch pages, actual playback of the public
release MP4, desktop screenshots and mobile layout without horizontal overflow.
[cdpshot](cdpshot-pages-00.png) shows the new chapter. Orca's
[runtime](orca-local-runtime.json) confirmed seven players, the MCP section,
and decoded 1920×1080 video with no media error. Orca playback initially
hit its background-media power policy, and its full-window screenshot timed
out because the page did not draw a compositor frame. GPU Chromium provided
the successful playback and screenshot evidence.

The owner's normal browser draft was preserved. Existing historical videos,
captures and release tag are unchanged. Native desktop execution and arbitrary
decoder-dependent models were not verified in this presentation stage.

Publication verified for main commit 957f64c: Pages build completed, the root
and watch pages contain both new sections, and the live release video played
at 1920×1080 without a media error. Public desktop/mobile evidence and result:
[deployed gallery](public-gallery/result.json), [Textures](public-gallery/textures-desktop.png)
and [AI/MCP](public-gallery/mcp-desktop.png).
