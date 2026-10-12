# Studio, water and placement — 2026-10-11

Captures from pnpm verify:visual in isolated GPU Chromium.

- previa-com-gizmo.png: actual boulder before placement, with gizmo;
  native scale drag and Enter preserve the preview pose.
- agua-na-encosta.png: continuous brush over a mountain; no heightmap value
  flattened, inclined mesh normals. Surface movement follows downhill;
  at this stage it was not hydraulic simulation.
- studio-atmosfera.png: dedicated color/light/fog controls.
- studio-efeitos-luz.png: dedicated page with recipe lighting enabled.
- reflexo-on.png / reflexo-off.png: identical scene/time, only reflection
  toggled; 444 pixels changed in the final check. Coplanar water shares
  the updated mirror.
- fogueira-luz-on.png / fogueira-luz-off.png: fixed time/camera, only PointLight
  changed; 3841 pixels responded, grass/body uniforms checked too.
- studio-cdpshot.png: extra capture using cdpshot.mjs, opening the MCP-exported
  map and Atmosphere page.

Reflection remains glyph-based. The auxiliary pass uses lit materials before
conversion to avoid losing reflections through double glyph sampling.
Slopes used an approximate local planar mirror; separate-pass particles are
not mirrored. Legacy water stays flat until explicit Fit to terrain.

Six comparisons passed without baseline updates: reference 0.0000, forest
0.0014, marsh 0.1219 (limit 0.2), snow 0.0053, mine 0.0120, cathedral 0.0096
(other limits 0.04). Historical images show Portuguese UI.
