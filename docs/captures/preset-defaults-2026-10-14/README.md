# Preset defaults and package alias follow-up — 2026-10-14

Based on package-boundary commit `bd12e167d20acfc0aa8ce1f034446cbce1ee69db`.
This stage addresses the four small review follow-ups without changing the
established visual numbers or any saved document IDs.

- `/pomorog` is documented as the official alias for the optional content pack;
  `/presets` intentionally exposes the same API for compatibility.
- Generic water uses `DEFAULT_WATER_LOOK`. `FOREST_WATER` is available only in
  the optional pack and owns a deep copy. Its former default object and the new
  generic object are byte-identical after excluding the exported name.
- Restored the useful `AsciiStyle` field comments, including adjustment ranges.
- `POMOROG_FIRE` owns a deep copy of `DEFAULT_HEAT_GRID`. Two mutation tests
  cover nested preset arrays and light/reflection settings without changing
  generic defaults.

Validation:

- [pnpm check](check.log): boundary guard, type checks, 101 core + 12 authoring
  + 1 automation tests, and production editor build passed.
- [Water integration](water.log): 14 assertions plus eight bank/camera checks
  passed in real GPU WebGL. Reflections, light response, downhill flow, object
  interaction and persisted settings remain functional, with no page exceptions.
  [Water reflection capture](water-reflection.png) shows letter-based reflection.
- [Actual MCP integration](mcp.log): all 32 checks passed, including the new
  public water-reference contract and the existing Texture Studio workflow.
- [cdpshot reference](cdpshot-reference-00.png) and
  [Orca Browser reference](orca-reference.png) were captured and inspected.
  [Orca runtime](orca-runtime.json) confirms six explicit type declarations,
  generic water defaults and no biome-named water export on the generic root.
  Full-window Orca capture succeeded in this session.

The historical snow baseline remains unchanged. Regeneration is a separate
visual decision requiring the owner's approval. Native desktop was not tested.
Full transient integration captures remain in ignored `.cache/`; only the
representative images and logs are versioned here.
