# Calm water, foam and shores — 2026-10-11

Request: inspect real water in Orca, improve readability and apparent mixing
with grass while orbiting. Owner-selected direction: **calm water, readable
reflection and gentle waves**.

## Comparisons

| Case | Before | After |
| --- | --- | --- |
| Owner's lake | [Before](lago-antes.png) | [Continuous waves](lago-depois.png) |
| Accumulated slope water | [Blocky foam](encosta-antes.png) | [Agitation-driven foam](encosta-depois.png) |
| Grazing shoreline camera | [Sampling stripes](margem-antes-amostragem.png) | [Continuous gradients](margem-depois-amostragem.png) |

Comparisons use a scene/depth/current copy captured after about 11 minutes
in Orca, reproduced in isolated Chromium. Shore comparison isolates sampling
changes within the new visual. The owner's tab document was not replaced.

[Orca before](orcas-antes.png) captures the full tab; [Orca now](orca-agora.png)
is its actual canvas, via CLI after rendering, with the owner's current
navigation at engine time 412.5 s. A timed-out full-page capture and a
compositor mosaic were discarded. No AI-generated images.

## Changes

- Slow world-space wave fronts, few color steps. Short-phase advection avoids
  multiplying variable speed by total time; glyphs stay attached to the surface.
- Foam is transported and decays, born from converging flow rather than the
  difference between current/initial depth. Less shore foam and no saturated O blocks.
- Mirror chooses nearby calm simulated surface height, following accumulation.
  Wave amplitude also controls jitter/highlights.
- textureGrad uses continuous-grid derivatives before fract/glyph selection.
  Atlas jumps no longer create false minification that blurs grazing rows.

## Validation

- pnpm check: **79 tests**, types and build passed; [log](check.log).
- pnpm compare: six views within existing limits, unchanged baseline; [log](compare.log).
- verify-water.mjs: side/opposite reflection, stationary deep lake, lighting,
  interaction, slopes, persistence and custom channels; [log](verify-water.log).
- Shore pixels compared with/without water at four rotations and two elevations
  (0.12/0.55 rad), projecting the complete 0–8 cm edge thickness: **zero pixels
  outside the tolerated shore** in all eight views. [Low camera](margem-teste.png).
- Two core tests cover foam dissipation without volume loss, a stationary
  deep pool and source-driven fall over 120 s.
- cdpshot sequence: [0](cdpshot-00.png), [1](cdpshot-01.png), [2](cdpshot-02.png),
  all at 60 fps without console errors; [log](cdpshot.log).

Simulation remains confined to surface paint, with planar calm-region mirrors.
Volumetric water, splashes, buoyancy and multiple reflecting levels within one
water body remain unsupported. Final aesthetic approval belongs to the owner.
Tauri was not executed. Screenshots document historical Portuguese UI.
