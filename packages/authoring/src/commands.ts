import { createTerrain, createTerrainData, createWaterPaint, paintWater, waterEdge, parseScene, seededRandom, pomorog, atmosphereStyle, FOREST_WATER, type SceneDoc, type SceneWater, type PlacedObject, type EffectDef } from '@ascii-engine/core'
import { assertSafeJson, batchSchema } from './schema'

/** Merge plain JSON only, protecting object prototypes before any assignment. */
export function mergeJson(base: unknown, patch: unknown): unknown {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return structuredClone(patch)
  const result: Record<string, unknown> = base && typeof base === 'object' && !Array.isArray(base) ? { ...base } : {}
  for (const [key, value] of Object.entries(patch)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('Chave reservada: ' + key)
    result[key] = mergeJson(result[key], value)
  }
  return result
}

export function summarizeScene(doc: SceneDoc) {
  return { name: doc.name, objects: doc.objects, terrain: doc.terrain ? { size: doc.terrain.size, resolution: doc.terrain.resolution, layers: doc.terrain.layers, minHeight: doc.terrain.heights.reduce((a,b)=>Math.min(a,b), Infinity), maxHeight: doc.terrain.heights.reduce((a,b)=>Math.max(a,b), -Infinity) } : null,
    waters: doc.waters?.map((w,index)=>({ index, ...w, shape: { ...w.shape, mask: w.shape.mask ? { resolution: w.shape.mask.resolution, followsTerrain: !!w.shape.mask.heights } : undefined } })),
    assets: Object.entries(doc.assets ?? {}).map(([id, asset])=>({ id, name: asset.name })), effects: doc.effects, atmospheres: doc.atmospheres, environment: doc.environment, style: doc.style }
}

/** Re-sample only water explicitly authored to follow terrain. */
export function followTerrain(doc: SceneDoc) {
  if (!doc.terrain || !doc.waters?.some(w => w.shape.mask?.heights)) return
  const terrain = createTerrain(doc.terrain)
  try { for (const water of doc.waters) {
    const { shape, level = 0 } = water, mask = shape.mask
    if (!mask?.heights) continue
    const n = mask.resolution, c = Math.cos(shape.angle), s = Math.sin(shape.angle)
    mask.heights = mask.values.map((_, i) => {
      const x = (i % n / (n - 1) - .5) * shape.size * 2, z = (Math.floor(i / n) / (n - 1) - .5) * shape.size * 2
      return terrain.heightAt(shape.x + c * x - s * z, shape.z + s * x + c * z) + .045 - level
    })
  } } finally { terrain.dispose() }
}

/** Atomic document commands. Never mutates the source or allocates a renderer. */
export function applyCommands(source: SceneDoc, input: unknown): SceneDoc {
  assertSafeJson(input)
  let doc = parseScene(source)
  const commands = batchSchema.parse(input)
  const object = (id: string) => { const value = doc.objects.find(o => o.id === id); if (!value) throw new Error('Objeto inexistente: ' + id); return value }
  const water = (index: number) => { const value = doc.waters?.[index]; if (!value) throw new Error('Água inexistente: ' + index); return value }
  for (const cmd of commands) {
    switch (cmd.op) {
      case 'scene.replace': doc = parseScene(cmd.document); break
      case 'scene.patch':
        doc = mergeJson(doc, cmd.patch) as SceneDoc
        for (const key of cmd.unset ?? []) delete doc[key]
        break
      case 'object.add': doc.objects.push({ ...cmd.object, id: cmd.object.id ?? crypto.randomUUID() } as PlacedObject); break
      case 'object.update': {
        const old = object(cmd.id)
        if (cmd.patch.id && cmd.patch.id !== cmd.id) throw new Error('object.update preserva o id; crie outro objeto para mudar a identidade.')
        doc.objects[doc.objects.indexOf(old)] = mergeJson(old, cmd.patch) as PlacedObject
        break
      }
      case 'object.remove': cmd.ids.forEach(object); doc.objects = doc.objects.filter(o => !cmd.ids.includes(o.id!)); break
      case 'object.scatter': {
        const { minX, maxX, minZ, maxZ } = cmd.bounds, range = cmd.scale ?? [1, 1], random = seededRandom(cmd.seed)
        if (minX > maxX || minZ > maxZ || range[0] > range[1]) throw new Error('Limites invertidos na dispersão.')
        if (doc.objects.length + cmd.count > 20000) throw new Error('Limite de 20000 objetos.')
        const terrain = doc.terrain ? createTerrain(doc.terrain) : undefined
        try { for (let i = 0; i < cmd.count; i++) {
          const x = minX + random() * (maxX - minX), z = minZ + random() * (maxZ - minZ)
          doc.objects.push({ id: crypto.randomUUID(), prefab: cmd.prefab, seed: Math.floor(random() * 4294967296), position: [x, (terrain?.heightAt(x,z) ?? 0) + (cmd.offsetY ?? 0), z], rotation: random() * Math.PI * 2, scale: range[0] + random() * (range[1] - range[0]) })
        } } finally { terrain?.dispose() }
        break
      }
      case 'terrain.create': doc.terrain = createTerrainData(cmd.size, cmd.resolution); followTerrain(doc); break
      case 'terrain.stroke': {
        if (!doc.terrain) throw new Error('A cena não tem terreno.')
        const terrain = createTerrain(doc.terrain)
        try { for (const stroke of cmd.strokes) {
          if (stroke.brush === 'paint' && (stroke.layer ?? 0) >= doc.terrain.layers.length) throw new Error('Camada de terreno inexistente.')
          terrain.apply(stroke)
        }; doc.terrain = terrain.toJSON() } finally { terrain.dispose() }
        followTerrain(doc); break
      }
      case 'water.paint': {
        if (!doc.terrain) throw new Error('Crie terreno antes de pintar água.')
        let entry: SceneWater
        if (cmd.index !== undefined) entry = water(cmd.index)
        else {
          if (cmd.erase) throw new Error('Informe index para apagar água existente.')
          entry = { shape: createWaterPaint(doc.terrain.size, doc.terrain.resolution), level: cmd.level ?? 0 }
          if (cmd.mode === 'terrain') entry.shape.mask!.heights = []
          ;(doc.waters ??= []).push(entry)
        }
        if (entry.shape.kind !== 'paint') throw new Error('Esta água não tem máscara pintável. Use water.update ou crie uma nova.')
        if (cmd.look) entry.look = mergeJson(mergeJson(FOREST_WATER, entry.look ?? {}), cmd.look) as SceneWater['look']
        if (cmd.level !== undefined) entry.level = cmd.level
        cmd.points.forEach((p, i) => paintWater(entry.shape, cmd.points[Math.max(0, i - 1)], p, cmd.radius, cmd.erase))
        if (!entry.shape.mask?.heights && !cmd.erase) {
          const t = doc.terrain, n = t.resolution
          t.heights = t.heights.map((h,i) => waterEdge(entry.shape, (i % n / (n-1) - .5) * t.size, (Math.floor(i/n) / (n-1) - .5) * t.size) > 0 ? Math.min(h, (entry.level ?? 0) - .18) : h)
        }
        followTerrain(doc); break
      }
      case 'water.update': {
        const entry = water(cmd.index)
        doc.waters![cmd.index] = mergeJson({ ...entry, look: mergeJson(FOREST_WATER, entry.look ?? {}) }, cmd.patch) as SceneWater
        followTerrain(doc); break
      }
      case 'water.remove': water(cmd.index); doc.waters!.splice(cmd.index, 1); break
      case 'effect.define': (doc.effects ??= {})[cmd.id] = structuredClone(cmd.effect) as unknown as EffectDef; break
      case 'asset.define': (doc.assets ??= {})[cmd.id] = { name: cmd.name, source: cmd.source }; break
      case 'resource.remove':
        if (!doc[cmd.kind]?.[cmd.id]) throw new Error('Recurso inexistente: ' + cmd.id)
        if (cmd.kind !== 'atmospheres' && doc.objects.some(o => o.prefab === cmd.id)) throw new Error('Remova primeiro as instâncias deste recurso: ' + cmd.id)
        delete doc[cmd.kind]![cmd.id]; break
      case 'atmosphere.define': (doc.atmospheres ??= {})[cmd.id] = { name: cmd.name, style: atmosphereStyle(mergeJson(mergeJson(pomorog, doc.style ?? {}), { ...cmd.style, bodySceneLighting: true, inkFog: true }) as NonNullable<SceneDoc['style']>) }; break
      case 'atmosphere.apply': {
        const asset = doc.atmospheres?.[cmd.id]
        if (!asset) throw new Error('Atmosfera inexistente: ' + cmd.id)
        doc.style = mergeJson(doc.style ?? {}, asset.style) as SceneDoc['style']; break
      }
      case 'atmosphere.set': doc.style = mergeJson(mergeJson(pomorog, doc.style ?? {}), { ...cmd.style, bodySceneLighting: true, inkFog: true }) as SceneDoc['style']; break
      case 'environment.set': doc.environment = { weather: cmd.weather, intensity: cmd.intensity }; break
    }
    // Validate between commands as later operations may allocate geometry.
    doc = parseScene(doc)
  }
  return doc
}
