# Formatter adoption — 2026-10-15

The isolated formatting/tooling commit is `393b309`; its full revision is in
`.git-blame-ignore-revs`. No renderer, document format or editor behavior changes
were intended or found. Prettier uses a 100-column wrapping target. Literal
strings, shaders, comments and Markdown tables can exceed that target.

- [Before](before-00.png) and [after](after-00.png): the historical
  `docs/examples/item-roundtrip.json` document, opened by the page-only
  `cdpshot.mjs` helper in a separate Chromium profile with paused time, focus
  `[0, .6, 0]`, zoom 1.3 and angle 0.
- [Before world](before-world.png) and [after world](after-world.png): identical
  `1048x340+232+132` crops; [RMSE](compare.log) is `0 (0)`.
- [Mechanical audit](mechanical-audit.log): 176 modified files match exactly
  the formatter applied to their pre-change contents. The remaining existing
  file edits configure/document the formatter in START, package and lockfile.
- [Bundle audit](bundle-audit.log): all four generated JS/CSS files are byte
  identical to the pre-format build.
- [pnpm check](check.log): formatting, package boundaries, type checks,
  159 tests and production build passed.
- [Authoring](verify-authoring.log): 84 checks passed with pnpm dev running.
- [Textures](verify-textures.log): 106 checks passed with pnpm dev running.
- [Orca document check](orca-check.json): the same historical document opened
  in the isolated review profile, with the editor page explicitly selected.

These images contain only the editor page. No desktop screenshots or personal
windows are included. Owner draft and both untracked plans were preserved.
Orca screenshot troubleshooting and native desktop testing remain separate
follow-up work, deferred at the owner's request. No baselines were regenerated.
