# ADR 0002 — English as the project language

**Status:** accepted by the owner on 2026-10-12.

## Context

The project is preparing its public README and feature videos. The owner
requested English throughout the product, including the editor interface
and technical documentation.

## Decision

Use English for the editor, accessibility labels, default asset labels,
errors, API/MCP descriptions, CLI messages, README, technical documentation
and presentation captions. Conversation with the owner follows their
preferred language.

Keep serialized prefab/preset IDs stable so existing scene documents remain
compatible. Display labels are translated independently. User-authored names
in saved scenes remain user content. The read-only Pomorog reference archive
and its historical source footage are preserved in their original language.

New recordings use the English editor. For this README, the owner explicitly
requested re-editing the existing recordings rather than recording again.
Cards and captions are English; the captured historical interface remains
Portuguese. State that distinction in the presentation documentation.

## Validation

Run the existing type, test and build checks, then exercise editor interactions,
asset selection, effects, atmosphere, cameras and scene persistence. Inspect
the rendered README and play each feature video. Document historical media
separately from the new English presentation.
