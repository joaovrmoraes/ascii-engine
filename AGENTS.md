# Agent instructions — ASCII Engine

Applies to every model (Codex, Claude, GPT and others).

## Read before changing anything

1. [`START.md`](START.md): purpose, visual principle, techniques, architecture and phases.
2. [`reference/pomorog/README.md`](reference/pomorog/README.md): what the reference
   contains and how to read each document.
3. For visual work, read the `pomorog-ascii-visual` skill and
   `reference/pomorog/docs/visual-pipeline.md`, including the catalog in §19.
   Open the images in `reference/pomorog/images/`; reading text alone is insufficient.
4. `docs/log.md`, when present: completed work and the current stopping point.

## Rules

- **Letters attached to things.** Never solve a visual problem with a screen
  filter over the entire world, letters textured over smooth 3D, or a letter
  cloud that becomes a solid sphere. The owner rejected all three approaches.
- **Fidelity before invention.** During extraction, preserve Pomorog's numbers,
  alphabets, colors and drawing order. Improvements come later, with before/after
  evidence. Do not use design skills to reinterpret the scene's visual style.
- **The core stays independent.** `packages/engine` imports no React, Tauri,
  game rules or biome-specific content. Biome effects use hooks or presets.
- **Declare the technique** (`GlyphKind`). Never classify it by color.
- `reference/` is **read-only**. Its cited paths (`src/ui/visual/…`, `docs/…`)
  belong to the Pomorog repository. Corresponding files here live under
  `reference/pomorog/src-visual/` or `reference/pomorog/docs/`.
- **Validate visually.** Use `pnpm check`, screenshots with `cdpshot.mjs` and
  the **Orca Browser** at `http://localhost:1440`. State what could not be verified.
- **Git:** check `git status` before editing. Never infer authorization for
  reset, cleanup, push or publication. Small local commits after validated
  stages are permitted; push only when the owner requests it.
- **Notify before reverting** anything the owner has seen or approved.
- **English is the project language.** Write UI, README, technical documentation,
  API/tool descriptions, presentation captions, code and identifiers in English.
  Reply to the owner in their preferred conversation language. Preserve the
  original reference archive and stable IDs in existing scene documents.

## At the end of a stage

Update `docs/log.md` with changes, screenshots saved to `docs/captures/`,
validation and outstanding work. Update `START.md` when the architecture
or plan changes.
