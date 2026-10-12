# An engine for creating Pomorog

Owner request on 2026-10-11: complete the engine so they can create their
game, consulting `~/Documents/pomorog`. This plan makes the authoring scope
in `START.md` and the audit fixes concrete.

**Owner-confirmed scope:** visual content only at this stage: terrain,
maps, items and related content exportable to Pomorog even before an importer
exists. Game rules and UI stay outside. “Execution” below means visual
content preview, not game implementation.

## Checked sources

- `~/Documents/pomorog`: `main`, `f79d3c7`, older terminal version; the owner's
  local changes were preserved.
- `~/orca/workspaces/pomorog/pearleye`: `27af922`, current 3D ASCII version,
  same source as `reference/pomorog`; clean when inspected.
- Game runtime: encounter, attack, spell, damage, death, loot and rest events;
  timestamp-based time and deterministic RNG. Rules remain in the game.
- Visuals: five biomes, automatic traveler, campfire, articulated creatures,
  weather, lighting, water and effects. The camera does not control the character.

## Deliverables and acceptance

1. Reliable document: save every style layer, transforms, seeds and models;
   validate before replacement; dispose of resources.
2. Authoring: hierarchy, transform, duplicate, delete, focus selection,
   undo/redo per action/stroke; persistence and portable files.
3. Assets: GLB and GLTF with companions, independent instances, animation
   and per-part styles preserved through save/reopen/export.
4. Scenes and execution: choose environment, water and effects; save and
   run in the player; keep all five reference areas available.
5. Creation proof: build through the interface, edit parts, import an
   animated model, save, reopen and export; test opening failures and
   history; validate in Chromium and Orca Browser.

Compilation alone does not complete the engine. This scope requires the
creation/export evidence above. Real game integration and full five-area
visual equivalence are later work; they do not block the requested visual
export. Record limitations in the log.

## Implementation decisions

Keep TypeScript + Three.js in the core and DOM in the editor. Evolve
`SceneDoc` without invalidating version 1 files: optional new fields,
normalized identity and seeds on load. Portable assets belong to the
document, without absolute paths from this machine. History stores
documents, not Three objects. Controls operate on the same data used
for saving and the player.

Pomorog is a read-only source in this stage; none of its checkouts is changed.
Older global skills citing `specs/project`, React and Canvas 2D do not
represent this architecture. Follow `START.md`, local `AGENTS.md` and the
current owner request. No push or publication belongs to this historical plan.
