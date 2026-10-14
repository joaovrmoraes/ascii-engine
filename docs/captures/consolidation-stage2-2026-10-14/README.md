# Consolidation stage 2 — view-only Display

Display contains only session view controls. Scene exposure/cell size are in
Atmosphere; full style preset save/load remains available from File.
The debug screen mode changes the post-pass live and is never serialized.
It is not a conversion of glyph bodies back into their original smooth models.

Checks: pnpm check (114 tests), verify:authoring (72), verify:composition (27).
Orca runtime inspection used the editor page ID at localhost:1440/?area=sandbox
and confirmed no document change. display-00.png was captured with cdpshot and
inspected. The historical item-roundtrip world viewport (1048×340, offset
232,132) compared with stage 1 has RMSE 0. The default rendering is unchanged.
No historical baseline update or push was performed. Native desktop was not
tested. Stage 3 remains the next implementation step.
