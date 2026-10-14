# Consolidation stage 4 evidence

`linked-users.png` shows a linked texture in the Studio and its two users.
`legacy-00.png` opens item-roundtrip in the historical stage-1 view: the
1048×340 world crop at (232,132) has RMSE 0. Old copied appearances remain
independent. Baselines were not regenerated.

pnpm check: 120 tests, boundaries/types/build. Textures: 98 assertions,
including actual rendered updates on all users, local precedence, reload,
independent detach and library DataTransfer drop to hierarchy. Authoring:
73 assertions, including linked item insertion with resource ID remapping
and linked-over-type precedence. Actual stdio MCP/API: 34 assertions, link,
detach, referenced deletion refusal, export/reopen and rollback included.

Pinned Orca editor tab: card click left the map unchanged; double click opened
an asset-only draft with the user count. Restored the owner's document and
selection afterward. Runtime was tested; Orca image capture remains unavailable.
Images were inspected with GPU Chromium. Native desktop unverified.
