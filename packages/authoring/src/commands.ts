import { detachTexture, textureUsers, createTerrain, createTerrainData, createWaterPaint, paintWater, waterEdge, parseScene, seededRandom, DEFAULT_ASCII_STYLE, atmosphereStyle, DEFAULT_WATER_LOOK, type SceneDoc, type SceneWater, type PlacedObject, type EffectDef } from '@ascii-engine/core'
import { assertSafeJson, batchSchema } from './schema'

/** Merge plain JSON only, protecting object prototypes before any assignment. */
export function mergeJson(base: unknown, patch: unknown): unknown {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return structuredClone(patch)
  const result: Record<string, unknown> = base && typeof base === 'object' && !Array.isArray(base) ? { ...base } : {}
  for (const [key, value] of Object.entries(patch)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('Reserved key: ' + key)
    result[key] = mergeJson(result[key], value)
  }
  return result
}

export function summarizeScene(doc: SceneDoc) {
  return { name: doc.name, objects: doc.objects, terrain: doc.terrain ? { size: doc.terrain.size, resolution: doc.terrain.resolution, layers: doc.terrain.layers, minHeight: doc.terrain.heights.reduce((a,b)=>Math.min(a,b), Infinity), maxHeight: doc.terrain.heights.reduce((a,b)=>Math.max(a,b), -Infinity) } : null,
    waters: doc.waters?.map((w,index)=>({ index, ...w, shape: { ...w.shape, mask: w.shape.mask ? { resolution: w.shape.mask.resolution, followsTerrain: !!w.shape.mask.heights } : undefined } })),
    assets: Object.entries(doc.assets ?? {}).map(([id, asset])=>({ id, name: asset.name })), effects: doc.effects, atmospheres: doc.atmospheres, textures: doc.textures, cameras: doc.cameras, activeCamera: doc.activeCamera, environment: doc.environment, style: doc.style }
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
  const object = (id: string) => { const value = doc.objects.find(o => o.id === id); if (!value) throw new Error('Object not found: ' + id); return value }
  const water = (index: number) => { const value = doc.waters?.[index]; if (!value) throw new Error('Water not found: ' + index); return value }
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
        if (cmd.patch.id && cmd.patch.id !== cmd.id) throw new Error('object.update preserves the id; create another object to change its identity.')
        doc.objects[doc.objects.indexOf(old)] = mergeJson(old, cmd.patch) as PlacedObject
        break
      }
      case 'object.remove': cmd.ids.forEach(object); doc.objects = doc.objects.filter(o => !cmd.ids.includes(o.id!)); break
      case 'object.scatter': {
        const { minX, maxX, minZ, maxZ } = cmd.bounds, range = cmd.scale ?? [1, 1], random = seededRandom(cmd.seed)
        if (minX > maxX || minZ > maxZ || range[0] > range[1]) throw new Error('Inverted scatter bounds.')
        if (doc.objects.length + cmd.count > 20000) throw new Error('20000 object limit.')
        const terrain = doc.terrain ? createTerrain(doc.terrain) : undefined
        try { for (let i = 0; i < cmd.count; i++) {
          const x = minX + random() * (maxX - minX), z = minZ + random() * (maxZ - minZ)
          doc.objects.push({ id: crypto.randomUUID(), prefab: cmd.prefab, seed: Math.floor(random() * 4294967296), position: [x, (terrain?.heightAt(x,z) ?? 0) + (cmd.offsetY ?? 0), z], rotation: random() * Math.PI * 2, scale: range[0] + random() * (range[1] - range[0]) })
        } } finally { terrain?.dispose() }
        break
      }
      case 'terrain.create': doc.terrain = createTerrainData(cmd.size, cmd.resolution); followTerrain(doc); break
      case 'terrain.stroke': {
        if (!doc.terrain) throw new Error('The scene has no terrain.')
        const terrain = createTerrain(doc.terrain)
        try { for (const stroke of cmd.strokes) {
          if (stroke.brush === 'paint' && (stroke.layer ?? 0) >= doc.terrain.layers.length) throw new Error('Terrain layer not found.')
          terrain.apply(stroke)
        }; doc.terrain = terrain.toJSON() } finally { terrain.dispose() }
        followTerrain(doc); break
      }
      case 'water.paint': {
        if (!doc.terrain) throw new Error('Create terrain before painting water.')
        let entry: SceneWater
        if (cmd.index !== undefined) entry = water(cmd.index)
        else {
          if (cmd.erase) throw new Error('Provide index to erase existing water.')
          entry = { shape: createWaterPaint(doc.terrain.size, doc.terrain.resolution), level: cmd.level ?? 0 }
          if (cmd.mode === 'terrain') entry.shape.mask!.heights = []
          ;(doc.waters ??= []).push(entry)
        }
        if (entry.shape.kind !== 'paint') throw new Error('This water has no paintable mask. Use water.update or create another.')
        if (cmd.look) entry.look = mergeJson(mergeJson(DEFAULT_WATER_LOOK, entry.look ?? {}), cmd.look) as SceneWater['look']
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
        doc.waters![cmd.index] = mergeJson({ ...entry, look: mergeJson(DEFAULT_WATER_LOOK, entry.look ?? {}) }, cmd.patch) as SceneWater
        followTerrain(doc); break
      }
      case 'water.remove': water(cmd.index); doc.waters!.splice(cmd.index, 1); break
      case 'effect.define': (doc.effects ??= {})[cmd.id] = structuredClone(cmd.effect) as unknown as EffectDef; break
      case 'asset.define': (doc.assets ??= {})[cmd.id] = { name: cmd.name, source: cmd.source }; break
      case 'resource.remove':
        if (!doc[cmd.kind]?.[cmd.id]) throw new Error('Resource not found: ' + cmd.id)
        if (['assets', 'effects'].includes(cmd.kind) && doc.objects.some(o => o.prefab === cmd.id)) throw new Error('Remove this asset\'s instances first: ' + cmd.id)
        if (cmd.kind === 'textures' && textureUsers(doc, cmd.id).length) throw new Error('Detach this texture from its users first: ' + cmd.id)
        delete doc[cmd.kind]![cmd.id]; break
      case 'atmosphere.define': (doc.atmospheres ??= {})[cmd.id] = { name: cmd.name, style: atmosphereStyle(mergeJson(mergeJson(DEFAULT_ASCII_STYLE, doc.style ?? {}), { ...cmd.style, bodySceneLighting: true, inkFog: true }) as NonNullable<SceneDoc['style']>) }; break
      case 'atmosphere.apply': {
        const asset = doc.atmospheres?.[cmd.id]
        if (!asset) throw new Error('Atmosphere not found: ' + cmd.id)
        doc.style = mergeJson(doc.style ?? {}, asset.style) as SceneDoc['style']; break
      }
      case 'texture.define': (doc.textures ??= {})[cmd.id] = { name: cmd.name, style: structuredClone(cmd.style), ...(cmd.previewLighting ? { previewLighting: structuredClone(cmd.previewLighting) } : {}) }; break
      case 'texture.apply': {
        const asset = doc.textures?.[cmd.id]
        if (!asset) throw new Error('Texture not found: ' + cmd.id)
        const item = object(cmd.objectId)
        item.options ??= {}
        const patch = cmd.link ? { texture: cmd.id } : asset.style
        if (cmd.part) { item.options.parts ??= {}; item.options.parts[cmd.part] = { ...item.options.parts[cmd.part], ...patch } }
        else Object.assign(item.options, patch)
        break
      }
      case 'texture.detach': { const item = object(cmd.objectId); item.options = detachTexture(item.options ?? {}, doc.textures ?? {}, cmd.part); break }
      case 'atmosphere.set': doc.style = mergeJson(mergeJson(DEFAULT_ASCII_STYLE, doc.style ?? {}), { ...cmd.style, bodySceneLighting: true, inkFog: true }) as SceneDoc['style']; break
      case 'camera.define': (doc.cameras ??= {})[cmd.id] = structuredClone(cmd.camera) as unknown as NonNullable<SceneDoc['cameras']>[string]; break
      case 'camera.update':
        if (!doc.cameras?.[cmd.id]) throw new Error('Camera not found: ' + cmd.id)
        doc.cameras[cmd.id] = mergeJson(doc.cameras[cmd.id], cmd.patch) as NonNullable<SceneDoc['cameras']>[string]; break
      case 'camera.remove':
        if (!doc.cameras?.[cmd.id]) throw new Error('Camera not found: ' + cmd.id)
        delete doc.cameras[cmd.id]; if (doc.activeCamera === cmd.id) delete doc.activeCamera; break
      case 'camera.activate': if (cmd.id === null) delete doc.activeCamera; else doc.activeCamera = cmd.id; break
      case 'environment.set': doc.environment = { weather: cmd.weather, intensity: cmd.intensity }; break
    }
    // Validate between commands as later operations may allocate geometry.
    doc = parseScene(doc)
  }
  return doc
}
