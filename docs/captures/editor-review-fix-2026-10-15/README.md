# Editor consolidation review evidence

Reviewed commits 889c6b8..0c1589d and adopted the existing uncommitted core/
authoring changes for visible linking and texture registry lifetime. No owner
changes were discarded. Each review group has its own local commit; no push.

| Group | Evidence |
| --- | --- |
| 1 — visible links and appearance-preserving Detach | relinked-after-detach.png; textures.log; core/authoring regression tests |
| 2 — explicit shared Apply and cancel/confirm | shared-apply-00.png; textures.log; detach-local-orca.json verifies local edits after Detach |
| 3 — cohesive sandbox modules | modular-panels.png; authoring.log; controller 59,428 → 18,311 bytes |
| 4 — consumed CLI values and five retained exports | literal-title-export.png; export.log; parser and retention tests in check.log |
| 5 — registry release, keep-used and rollback | registry-orca.json; authoring.log |
| 6 — live debug versus historical scene recipes | live-debug-screen.png; legacy-screen-before.png / legacy-screen-after.png; display.log |
| 7 — rain glyph rings with physics off | rain-physics-off-inspector.png; rain-rings-without-simulation.png / rain-no-rings-without-simulation.png; rain-orca.json; water.log |

Final validation with pnpm dev running:

- pnpm check: 11 CLI parser + 148 workspace tests (127 core, 15 authoring,
  3 transport/export, 3 editor), package boundaries, types and production build.
- verify:textures 106; verify:authoring 84; actual stdio verify:api 39;
  verify:water 28 plus eight bank views; verify:export 11; verify:display 21.
- Actual Web/native Linux exports preserve literal --desktop/--scene titles;
  the static Web player runs under a nested URL with unchanged scene content.
  Native executable/archive contents and permissions were checked. Its window
  was not launched; Windows/macOS and native GUI execution remain unverified.
- Historical item/terrain documents open with exact world RMSE 0. The retained
  legacy Old Mine recipe has RMSE 0.0000627474 against an isolated source archive
  of commit 578dec6 at time 3 s (legacy-comparison.txt). No baseline updates.
- With physics disabled, scene rain emitted a ring on a nonempty wet mask.
  The rendered ring changes 116 pixels by more than 8/255; the authored document
  remains unchanged. No renderer fix was needed or made for group 7.

Orca used an isolated profile (4ae829dd-ca08-4c84-bb22-96d1e1318ad4), always
pinning editor page 909f8332-2fd8-47e3-a24c-5d7e839479ac at localhost:1440
sandbox. The owner's default profile/draft was never edited. DOM/runtime tests
covered linking, shared Apply cancellation, Detach then local Apply, registry
lifetime, debug mode and rain without physics. Embedded screenshot capture timed
out (orca-capture-result.json); inspected images come from GPU Chromium, including
cdpshot.mjs for old-document and historical comparison evidence.
