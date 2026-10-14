# ADR 0003 — Generic renderer entries and explicit content libraries

Date: 2026-10-14. The owner requested package-boundary corrections after the
Texture Studio and MCP presentation update.

## Decision

The core renderer owns techniques, visual data and scene materialization.
It receives appearance/type declarations and effect recipes from its consumer.
Its generic entries import no application or optional Pomorog preset.

- `@ascii-engine/core`: engine factory, settings and generic compatibility exports.
- `@ascii-engine/core/techniques`: glyph styles, materials, ink and water techniques.
- `@ascii-engine/core/world`: terrain, scenes, documents, import, weather and cameras.
- `@ascii-engine/core/fx`: effect runtime, validation, flipbooks and heat-grid data.
- `@ascii-engine/core/presets` and `/pomorog`: optional appearance and visual recipes.

`AsciiStyle` lives in `config.ts`. The default settings retain established
renderer numbers but contain no object type library. An engine owns copies of
its nested settings. `setStyle(..., {replace: true})` returns to its consumer's
initial settings before applying the replacement. Effect recipes supplied
through `AsciiEngineOptions.effects` are registered when the effect system
is first used; a bare engine has no implicit named game effects.

The editor's engine factory explicitly supplies Pomorog's style and effect
library, including its isolated Texture/Effects previews. Combat timing and
feedback, legacy marsh contacts and snow-track policy live in editor
`src/pomorog/`. Their numerical recipes, alphabets and draw order are preserved.
Deterministic snow particle sampling and reusable heat-grid data remain generic.

## Package contracts

Automation imports `rpcSchema`, `requestSchema`, `batchSchema` and
`assertSafeJson` through `@ascii-engine/authoring/schema`. The authoring root
also retains these exports. The schema entry has no runtime renderer import.
Vite uses `@ascii-engine/automation/bridge` as a development dependency;
runtime editor code depends on core/authoring, and automation depends on
authoring. Relative imports cannot cross package boundaries.

`scripts/check-package-boundaries.mjs`, included in `pnpm check`, enforces
these directions and walks the generic core entries to reject application,
adapter or optional-preset dependencies.

## Consumer migration

Generic root imports continue to work. Optional preset imports move to their
explicit entry:

```ts
import { createAsciiEngine } from '@ascii-engine/core'
import { pomorog, POMOROG_EFFECTS } from '@ascii-engine/core/pomorog'

const engine = createAsciiEngine(canvas, {
  style: pomorog,
  effects: POMOROG_EFFECTS,
})
```

`createCombatEffects`, `Spell`, `CombatFrame`, `FootPose`, `SnowBoot` and the
demo marsh/snow adapters are editor implementation details, removed from the
core exports. Scene versions, legacy resource IDs and saved data are unchanged.
This is a source-level API migration on main; the published v0.1.0 tag keeps
its original API. Packages still ship workspace TypeScript sources; compiled
consumer distributions remain a separate phase-7 task.

## Follow-up scope

Splitting the large sandbox/technique files, formatter adoption, editor logic
unit tests, historical media storage, live documentation filenames and shared
skill storage remain separate follow-ups. No Git history was rewritten.
