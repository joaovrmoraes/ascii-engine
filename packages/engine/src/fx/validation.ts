import type { EffectDef } from './effects'

/** Validate imported effect data before starting emitters or allocating lights. */
export function parseEffect(input: unknown): EffectDef {
  const fail = (path: string): never => { throw new Error(`Invalid effect: ${path}`) }
  const record = (v: unknown, path: string): Record<string, unknown> => { if (!v || typeof v !== 'object' || Array.isArray(v)) fail(path); return v as Record<string, unknown> }
  const num = (v: unknown, path: string, min = -10000, max = 10000) => { if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) fail(path) }
  const vec = (v: unknown, path: string) => { if (!Array.isArray(v) || v.length !== 3) fail(path); (v as unknown[]).forEach(n => num(n, path)) }
  const list = (v: unknown, path: string, max = 256): unknown[] => { if (!Array.isArray(v) || v.length > max) fail(path); return v as unknown[] }
  const bool = (v: unknown, path: string) => { if (v !== undefined && typeof v !== 'boolean') fail(path) }
  const range = (v: unknown, path: string, min = 0) => { if (Array.isArray(v)) { if (v.length !== 2) fail(path); v.forEach(n => num(n, path, min)); if (v[0] > v[1]) fail(path) } else num(v, path, min) }
  const curve = (v: unknown, path: string, color = false) => {
    let previous = -1
    for (const raw of list(v, path)) { const stop = record(raw, path); num(stop.t, path, 0, 1); if ((stop.t as number) < previous) fail(path); previous = stop.t as number; color ? vec(stop.color, path) : num(stop.v, path, 0) }
  }
  function json(v: unknown, depth = 0) {
    if (depth > 24) fail('data nested too deeply')
    if (typeof v === 'number') num(v, 'non-finite number', -Number.MAX_VALUE, Number.MAX_VALUE)
    if (v && typeof v === 'object') for (const [key, child] of Object.entries(v)) { if (['__proto__', 'constructor', 'prototype'].includes(key)) fail(key); json(child, depth + 1) }
  }
  json(input)
  const root = record(input, 'document')
  if (typeof root.name !== 'string' || !root.name.trim() || root.name.length > 120) fail('name')
  num(root.duration, 'duration', .01, 3600); bool(root.loop, 'loop')
  for (const [i, raw] of list(root.emitters, 'emitters', 32).entries()) {
    const e = record(raw, `emitter ${i + 1}`), path = `emitter ${i + 1}`
    if (e.name !== undefined && (typeof e.name !== 'string' || e.name.length > 120)) fail(`${path}: name`)
    if (e.render !== undefined && !['particle', 'ring', 'beam', 'ribbon', 'heat', 'decal', 'flipbook'].includes(String(e.render))) fail(`${path}: technique`)
    for (const key of ['rate','start','duration','gravity','drag','noise','glow','max']) if (e[key] !== undefined) num(e[key], `${path}.${key}`, 0)
    for (const key of ['attract','spin']) if (e[key] !== undefined) num(e[key], `${path}.${key}`)
    for (const key of ['velocity','offset']) if (e[key] !== undefined) vec(e[key], `${path}.${key}`)
    for (const key of ['life','speed']) if (e[key] !== undefined) range(e[key], `${path}.${key}`, key === 'life' ? .001 : 0)
    if (e.glyphs !== undefined && (typeof e.glyphs !== 'string' || e.glyphs.length > 256)) fail(`${path}: glyphs`)
    bool(e.ground, `${path}.ground`)
    if (e.size !== undefined) Array.isArray(e.size) && typeof e.size[0] === 'object' ? curve(e.size, `${path}.size`) : range(e.size, `${path}.size`, .001)
    if (e.alpha !== undefined) Array.isArray(e.alpha) ? curve(e.alpha, `${path}.alpha`) : num(e.alpha, `${path}.alpha`, 0, 1)
    if (e.color !== undefined) Array.isArray(e.color) && typeof e.color[0] === 'object' ? curve(e.color, `${path}.color`, true) : vec(e.color, `${path}.color`)
    if (e.bursts !== undefined) for (const b of list(e.bursts, `${path}.bursts`)) { const burst = record(b, path); num(burst.at, `${path}.burst.at`, 0, 3600); num(burst.count, `${path}.burst.count`, 0, 10000) }
    if (e.shape !== undefined) {
      const shape = record(e.shape, `${path}.shape`)
      if (!['point','sphere','cone','ring','box','line'].includes(String(shape.kind))) fail(`${path}: shape`)
      for (const key of ['radius','angle']) if (shape[key] !== undefined) num(shape[key], `${path}.shape.${key}`, 0)
      for (const key of ['size','to']) if (shape[key] !== undefined) vec(shape[key], `${path}.shape.${key}`)
      bool(shape.surface, `${path}.shape.surface`)
    }
    if (e.ring !== undefined) { const r = record(e.ring, path); num(r.from, 'initial radius', 0); num(r.to, 'final radius', 0); num(r.count, 'ring glyphs', 1, 10000); bool(r.tangent, 'tangent') }
    if (e.beam !== undefined) { const b = record(e.beam, path); num(b.segments, 'segments', 1, 10000); for (const k of ['jitter','amplitude']) if (b[k] !== undefined) num(b[k], k, 0) }
    if (e.ribbon !== undefined) { const r = record(e.ribbon, path); num(r.length, 'length', .001); num(r.spacing, 'spacing', .001) }
    if (e.heat !== undefined) {
      const h = record(e.heat, path)
      for (const [k,min,max] of [['cols',1,64],['rows',2,128],['letter',.001,100],['toward',-100,100],['sparks',0,10000]] as const) if (h[k] !== undefined) num(h[k],`heat.${k}`,min,max)
      if (h.cell !== undefined) { const cell=list(h.cell,'fire cell',2); if(cell.length!==2) fail('fire cell'); cell.forEach(v=>num(v,'fire cell',.001,100)) }
      if (h.ramp !== undefined) { const ramp=list(h.ramp,'fire ramp',64); if(!ramp.length) fail('empty ramp'); for(const entry of ramp) { const pair=list(entry,'glyph/color',2); if(pair.length!==2 || typeof pair[0]!=='string' || !pair[0]) fail('fire glyph'); vec(pair[1],'fire color') } }
      if (h.embers !== undefined) { const ember=record(h.embers,'embers'); num(ember.count,'embers',0); const letters=list(ember.letters,'ember glyphs',3); if(letters.length!==3 || letters.some(v=>typeof v!=='string')) fail('ember glyphs') }
      if (h.smoke !== undefined) { const smoke=record(h.smoke,'smoke'); num(smoke.count,'smoke',0); if(typeof smoke.letters!=='string') fail('smoke glyphs'); vec(smoke.color,'smoke color') }
      if (h.light !== undefined) { const light=record(h.light,'fire light'); for(const k of ['color','intensity','distance','decay','height']) num(light[k],`fire light.${k}`,0,0xffffff) }
    }
    if (e.flipbook !== undefined) {
      const f = record(e.flipbook, path); num(f.fps, 'frames/s', .01, 120); num(f.cell, 'cell', .001, 100)
      bool(f.loop, 'loop flipbook')
      if (f.facing !== undefined && !['camera','ground'].includes(String(f.facing))) fail('flipbook orientation')
      for (const frame of list(f.frames, 'frames', 600)) for (const row of list(frame, 'rows', 256)) if (typeof row !== 'string' || row.length > 256) fail('flipbook row')
      if (f.colors !== undefined) for (const frame of list(f.colors, 'colors', 600)) for (const row of list(frame, 'row colors')) for (const rgb of list(row, 'cell color')) vec(rgb, 'cell color')
    }
  }
  if (root.light !== undefined) {
    const l = record(root.light, 'light'); num(l.color, 'light color', 0, 0xffffff); num(l.intensity, 'intensity', 0, 1000)
    for (const k of ['distance','decay','flicker']) if (l[k] !== undefined) num(l[k], `light.${k}`, 0)
    if (l.offset !== undefined) vec(l.offset, 'light position')
    if (l.fade !== undefined) curve(l.fade, 'light curve')
  }
  return JSON.parse(JSON.stringify(input)) as EffectDef
}
