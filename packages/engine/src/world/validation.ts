import type { SceneDoc, PrefabLibrary } from './scene'
import { pomorog } from '../presets/pomorog'
import { SURFACE_ALPHA } from '../surface'
import { FOREST_WATER } from '../techniques/water'
import { parseEffect } from '../fx/validation'
import { ATMOSPHERE_KEYS } from './atmosphere'

const glyphs = ['screen', 'surface', 'body', 'water', 'particle', 'carpet']
function fail(path: string, detail: string): never { throw new Error(`Cenário inválido: ${path} ${detail}`) }
function record(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(path, 'deve ser um objeto')
  return value as Record<string, unknown>
}
function number(value: unknown, path: string, min = -1e8, max = 1e8): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) fail(path, `deve ser um número entre ${min} e ${max}`)
  return value
}
function vector(value: unknown, path: string, count: number, min = -1e8) {
  if (!Array.isArray(value) || value.length !== count) fail(path, `deve ter ${count} números`)
  value.forEach((n, i) => number(n, `${path}[${i}]`, min))
}
function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) fail(path, 'deve ser uma lista')
  return value
}
function style(value: unknown, path: string) {
  const s = record(value, path)
  if (s.glyph !== undefined && !glyphs.includes(String(s.glyph))) fail(path, 'contém uma técnica desconhecida')
  if (s.surface !== undefined && !Object.hasOwn(SURFACE_ALPHA, String(s.surface))) fail(path, 'contém uma família desconhecida')
  if (s.size !== undefined) number(s.size, `${path}.size`, .01, 10)
  if (s.type !== undefined && typeof s.type !== 'string') fail(`${path}.type`, 'deve ser texto')
  if (s.body !== undefined) {
    const body = record(s.body, `${path}.body`)
    if (body.occlude !== undefined && typeof body.occlude !== 'boolean') fail(`${path}.body.occlude`, 'deve ser booleano')
  }
  if (s.parts) for (const [k, v] of Object.entries(record(s.parts, `${path}.parts`))) style(v, `${path}.parts.${k}`)
}
function jsonData(value: unknown, path: string) {
  if (typeof value === 'number') number(value, path, -Number.MAX_VALUE, Number.MAX_VALUE)
  if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) fail(path, 'contém uma chave reservada')
    jsonData(child, `${path}.${key}`)
  }
}
function sameShape(value: unknown, template: unknown, path: string) {
  if (typeof template === 'number') { number(value, path); return }
  if (typeof template === 'boolean') { if (typeof value !== 'boolean') fail(path, 'deve ser booleano'); return }
  if (Array.isArray(template)) { vector(value, path, template.length); return }
  if (template && typeof template === 'object') {
    const r = record(value, path)
    for (const [k, v] of Object.entries(template)) sameShape(r[k], v, `${path}.${k}`)
  }
}

/** Validate before allocating GPU resources or replacing the open document. */
export function parseScene(input: unknown, library?: PrefabLibrary): SceneDoc {
  const root = record(input, 'documento')
  if (root.version !== 1) fail('version', 'não é suportada (esperado: 1)')
  if (root.name !== undefined && typeof root.name !== 'string') fail('name', 'deve ser texto')
  if (root.environment !== undefined) {
    const environment = record(root.environment, 'environment')
    if (!['none', 'rain', 'snow'].includes(String(environment.weather))) fail('environment.weather', 'desconhecido')
    if (environment.intensity !== undefined) number(environment.intensity, 'environment.intensity', 0, 1)
  }
  jsonData(root, 'documento')
  const objects = array(root.objects, 'objects')
  if (objects.length > 20000) fail('objects', 'excede 20000 objetos')
  if (root.assets !== undefined) for (const [id, raw] of Object.entries(record(root.assets, 'assets'))) {
    const asset = record(raw, `assets.${id}`)
    if (typeof asset.name !== 'string' || typeof asset.source !== 'string' || !asset.source.startsWith('data:')) fail(`assets.${id}`, 'precisa conter nome e fonte incorporada (data URI)')
  }
  const ids = new Set<string>()
  if (root.cameras !== undefined) {
    const cameras = record(root.cameras, 'cameras')
    if (Object.keys(cameras).length > 128) fail('cameras', 'excede 128 câmeras')
    for (const [id, raw] of Object.entries(cameras)) {
      const camera = record(raw, `cameras.${id}`), path = `cameras.${id}`
      if (!id || typeof camera.name !== 'string' || !camera.name.trim()) fail(path, 'precisa de identificador e nome')
      if (camera.projection !== 'orthographic') fail(path, 'projeção não suportada')
      vector(camera.position, `${path}.position`, 3); vector(camera.rotation, `${path}.rotation`, 3)
      number(camera.span, `${path}.span`, .01, 10000); number(camera.aspect, `${path}.aspect`, .1, 10)
      if (camera.near !== undefined) number(camera.near, `${path}.near`, .001, 10000)
      if (camera.far !== undefined) number(camera.far, `${path}.far`, .002, 100000)
      if (Number(camera.near ?? .1) >= Number(camera.far ?? 1000)) fail(path, 'plano distante precisa ser maior que o próximo')
    }
  }
  if (root.activeCamera !== undefined && (typeof root.activeCamera !== 'string' || !Object.hasOwn(root.cameras ?? {}, root.activeCamera))) fail('activeCamera', 'câmera inexistente')
  if (root.atmospheres !== undefined) {
    const atmospheres = record(root.atmospheres, 'atmospheres')
    if (Object.keys(atmospheres).length > 256) fail('atmospheres', 'excede 256 atmosferas')
    for (const [id, raw] of Object.entries(atmospheres)) {
      const asset = record(raw, `atmospheres.${id}`)
      if (!id || typeof asset.name !== 'string' || !asset.name.trim()) fail(`atmospheres.${id}`, 'precisa de identificador e nome')
      const lighting = record(asset.style, `atmospheres.${id}.style`)
      for (const key of Object.keys(lighting)) if (!(ATMOSPHERE_KEYS as readonly string[]).includes(key)) fail(`atmospheres.${id}.style.${key}`, 'não é um campo de iluminação')
      parseScene({ version: 1, objects: [], style: lighting })
    }
  }
  if (root.effects !== undefined) {
    const effects = record(root.effects, 'effects')
    if (Object.keys(effects).length > 256) fail('effects', 'excede 256 efeitos')
    for (const [key, def] of Object.entries(effects)) {
      if (!key.startsWith('fx:custom-')) fail(`effects.${key}`, 'precisa de identificador fx:custom-')
      parseEffect(def)
    }
  }
  objects.forEach((raw, i) => {
    const item = record(raw, `objects[${i}]`), path = `objects[${i}]`
    if (typeof item.prefab !== 'string' || !item.prefab) fail(`${path}.prefab`, 'é obrigatório')
    if (library && !Object.hasOwn(library, item.prefab) && !Object.hasOwn(root.effects ?? {}, item.prefab)) fail(`${path}.prefab`, `não existe: ${item.prefab}`)
    vector(item.position, `${path}.position`, 3)
    if (item.rotation !== undefined) number(item.rotation, `${path}.rotation`)
    if (item.scale !== undefined) number(item.scale, `${path}.scale`, .001, 1000)
    if (item.rotation3 !== undefined) vector(item.rotation3, `${path}.rotation3`, 3)
    if (item.scale3 !== undefined) vector(item.scale3, `${path}.scale3`, 3, .001)
    if (item.seed !== undefined) number(item.seed, `${path}.seed`, 0, 4294967295)
    if (item.options !== undefined) style(item.options, `${path}.options`)
    if (item.visible !== undefined && typeof item.visible !== 'boolean') fail(`${path}.visible`, 'deve ser booleano')
    if (item.animation !== undefined && item.animation !== null && typeof item.animation !== 'string') fail(`${path}.animation`, 'deve ser nome de clipe ou null')
    if (item.name !== undefined && typeof item.name !== 'string') fail(`${path}.name`, 'deve ser texto')
    const id = item.id ?? `object-${i + 1}`
    if (typeof id !== 'string' || !id || ids.has(id)) fail(`${path}.id`, 'deve ser único e não vazio')
    ids.add(id)
  })
  if (root.style !== undefined) {
    const s = record(root.style, 'style')
    for (const [k, v] of Object.entries(s)) {
      if (v === undefined) continue
      if (k === 'glyphs') style(v, 'style.glyphs')
      else if (k === 'types') for (const [name, raw] of Object.entries(record(v, 'style.types'))) {
        const t = record(raw, `style.types.${name}`)
        if (t.style) style(t.style, `style.types.${name}.style`)
        if (t.parts) style({ parts: t.parts }, `style.types.${name}`)
      }
      else if (k === 'fog' && v === null) continue
      else if (k === 'bodySceneLighting' || k === 'inkFog') { if (typeof v !== 'boolean') fail(`style.${k}`, 'deve ser booleano') }
      else if (k === 'inkTint') vector(v, 'style.inkTint', 3, 0)
      else if (k === 'atmosphere') { if (!['moon', 'dusk', 'ember'].includes(String(v))) fail('style.atmosphere', 'desconhecida') }
      else if (k in pomorog) sameShape(v, pomorog[k as keyof typeof pomorog], `style.${k}`)
    }
    if (s.cellSize !== undefined) number(s.cellSize, 'style.cellSize', 1, 100)
    if (s.brightness !== undefined) number(s.brightness, 'style.brightness', 0, 10)
  }
  if (root.terrain !== undefined) {
    const t = record(root.terrain, 'terrain')
    const r = number(t.resolution, 'terrain.resolution', 2, 513)
    if (!Number.isInteger(r)) fail('terrain.resolution', 'deve ser inteiro')
    number(t.size, 'terrain.size', 1, 4096)
    const heights = array(t.heights, 'terrain.heights'), paint = array(t.paint, 'terrain.paint'), layers = array(t.layers, 'terrain.layers')
    if (heights.length !== r * r || paint.length !== r * r * 4) fail('terrain', 'tem dimensões incompatíveis')
    heights.forEach((h) => number(h, 'terrain.heights', -4096, 4096))
    paint.forEach((p) => number(p, 'terrain.paint', 0, 255))
    if (!layers.length || layers.length > 4) fail('terrain.layers', 'precisa de 1 a 4 camadas')
    layers.forEach((raw) => { const l = record(raw, 'terrain.layers'); number(l.color, 'layer.color', 0, 0xffffff); number(l.grass, 'layer.grass', 0, 1); if (typeof l.name !== 'string') fail('layer.name', 'deve ser texto') })
  }
  if (root.carpet !== undefined) {
    const c = record(root.carpet, 'carpet'); number(c.count, 'carpet.count', 0, 300000)
    if (c.seed !== undefined) number(c.seed, 'carpet.seed', 0, 4294967295)
  }
  if (root.waters !== undefined) array(root.waters, 'waters').forEach((raw, i) => {
    const w = record(raw, `waters[${i}]`), s = record(w.shape, `waters[${i}].shape`)
    if (!['pond', 'stream', 'paint'].includes(String(s.kind))) fail(`waters[${i}].shape.kind`, 'desconhecido')
    for (const k of ['x', 'z', 'angle']) number(s[k], `waters[${i}].${k}`)
    number(s.size, `waters[${i}].size`, .01, 4096)
    if (s.kind === 'paint') {
      const mask = record(s.mask, `waters[${i}].shape.mask`)
      number(mask.resolution, `waters[${i}].shape.mask.resolution`, 2, 513)
      if (!Number.isInteger(mask.resolution)) fail(`waters[${i}].shape.mask.resolution`, 'deve ser inteiro')
      const values = array(mask.values, `waters[${i}].shape.mask.values`)
      if (values.length !== Number(mask.resolution) ** 2) fail(`waters[${i}].shape.mask.values`, 'tamanho incompatível')
      if (mask.heights !== undefined) { const heights = array(mask.heights, `waters[${i}].shape.mask.heights`); if (heights.length !== values.length) fail(`waters[${i}].shape.mask.heights`, 'tamanho incompatível'); heights.forEach(value => number(value, `waters[${i}].shape.mask.heights`, -1e4, 1e4)) }
      values.forEach((value, j) => number(value, `waters[${i}].shape.mask.values[${j}]`, -1e6, 1e6))
    }
    if (w.level !== undefined) number(w.level, `waters[${i}].level`)
    if (w.physics !== undefined) {
      const physics = record(w.physics, `waters[${i}].physics`)
      if (physics.enabled !== undefined && typeof physics.enabled !== 'boolean') fail('physics.enabled', 'deve ser booleano')
      for (const [key,min,max] of [['depth',.005,5],['gravity',.1,30],['damping',0,20],['source',0,5],['waves',0,.3]] as const) if (physics[key] !== undefined) number(physics[key], `waters[${i}].physics.${key}`, min, max)
    }
    if (w.look !== undefined) {
      const look = record(w.look, `waters[${i}].look`)
      for (const [k, value] of Object.entries(look)) {
        if (k in FOREST_WATER) sameShape(value, FOREST_WATER[k as keyof typeof FOREST_WATER], `waters[${i}].look.${k}`)
      }
      if (look.cell) vector(look.cell, `waters[${i}].look.cell`, 2, .001)
      if (look.reflection) number(record(look.reflection, 'reflection').rows, 'reflection.rows', 1, 10000)
    }
  })
  // Independent snapshot. Legacy documents receive deterministic identities/seeds.
  const doc = JSON.parse(JSON.stringify(root)) as SceneDoc
  doc.objects.forEach((item, i) => { item.id ??= `object-${i + 1}`; item.seed ??= (Math.imul(i + 1, 2654435761) + 48017) >>> 0 })
  return doc
}
