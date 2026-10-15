import { describe, expect, it } from 'vitest'
import {
  createTerrainData,
  parseScene,
  waterEdge,
  resolveGlyphStyle,
  textureUsers,
  textureStyle,
} from '@ascii-engine/core'
import { applyCommands } from './commands'

const initial = () =>
  parseScene({
    version: 1,
    name: 'Original',
    terrain: createTerrainData(16, 33),
    objects: [{ id: 'rock', prefab: 'pedregulho', position: [0, 0, 0] }],
  })
describe('atomic authoring', () => {
  it('authors component looks atomically without rewriting stable layer IDs', () => {
    const source = initial(),
      before = JSON.stringify(source)
    const doc = applyCommands(source, [
      {
        op: 'terrain.layer',
        index: 0,
        patch: {
          look: { alphabet: 'XZ', size: 0.25 },
          cover: { alphabet: 'v*', height: 0.4, color: 0x55aa88 },
        },
      },
      { op: 'water.paint', points: [{ x: 0, z: 0 }], radius: 2 },
      {
        op: 'water.update',
        index: 0,
        patch: {
          look: {
            alphabet: '~=',
            shallow: [0.1, 0.2, 0.3],
            deep: [0.02, 0.04, 0.1],
            rings: { enabled: true, alphabet: '|_-', size: 1.5, lifetime: 1 },
            reflection: { strength: 0.6 },
          },
        },
      },
    ])
    expect(JSON.stringify(source)).toBe(before)
    expect(doc.terrain!.layers[0].name).toBe('musgo')
    expect(doc.terrain!.layers[0].cover?.alphabet).toBe('v*')
    expect(doc.waters![0].look?.rings?.enabled).toBe(true)
    expect(parseScene(JSON.parse(JSON.stringify(doc)))).toEqual(doc)
    expect(() =>
      applyCommands(source, [{ op: 'terrain.layer', index: 0, patch: { cover: { height: -1 } } }]),
    ).toThrow()
  })
  it('links assets, prevents dangling references and detaches without changing resolved appearance', () => {
    const source = parseScene({
      version: 1,
      objects: [
        {
          id: 'tree',
          prefab: 'tree',
          position: [0, 0, 0],
          options: { size: 0.5, parts: { crown: { color: 777 } } },
        },
      ],
      textures: {
        whole: { name: 'Whole', style: { alphabet: 'AB', color: 123 } },
        leaves: { name: 'Leaves', style: { alphabet: 'XY', size: 0.3, color: 456 } },
      },
    })
    const linked = applyCommands(source, [
      { op: 'texture.apply', id: 'whole', objectId: 'tree', link: true },
      { op: 'texture.apply', id: 'leaves', objectId: 'tree', part: 'crown', link: true },
    ])
    expect(linked.objects[0].options?.alphabet).toBeUndefined()
    expect(textureUsers(linked, 'whole')).toHaveLength(1)
    expect(() =>
      applyCommands(linked, [{ op: 'resource.remove', kind: 'textures', id: 'leaves' }]),
    ).toThrow('Detach')
    expect(() => parseScene({ ...linked, textures: {} })).toThrow('texture not found')
    const before = resolveGlyphStyle({
      texture: linked.textures!.whole.style,
      texturePart: linked.textures!.leaves.style,
      instance: textureStyle(linked.objects[0].options ?? {}),
      instanceParts: linked.objects[0].options?.parts,
      part: 'crown',
    })
    for (const part of ['crown', undefined]) {
      const detached = applyCommands(linked, [{ op: 'texture.detach', objectId: 'tree', part }]),
        options = detached.objects[0].options
      expect(
        resolveGlyphStyle({
          texture: options?.texture ? detached.textures![options.texture].style : undefined,
          instance: textureStyle(options ?? {}),
          instanceParts: options?.parts,
          part: 'crown',
        }),
      ).toEqual(before)
      expect(options?.parts?.crown.texture).toBeUndefined()
    }
    expect(source.objects[0].options?.texture).toBeUndefined()
  })
  it('makes a new link visible over copied or detached local fields', () => {
    const resolved = (doc: ReturnType<typeof parseScene>, part?: string) => {
      const options = doc.objects[0].options ?? {},
        recipe = (id?: string) => (id ? doc.textures![id].style : undefined)
      return resolveGlyphStyle({
        texture: recipe(options.texture),
        texturePart: recipe(part ? options.parts?.[part]?.texture : undefined),
        instance: textureStyle(options),
        instanceParts: options.parts,
        part,
      })
    }
    const source = parseScene({
      version: 1,
      objects: [
        {
          id: 'tree',
          prefab: 'tree',
          position: [0, 0, 0],
          options: {
            size: 0.5,
            density: 0.4,
            parts: { crown: { color: 777 }, trunk: { alphabet: 'TT' } },
          },
        },
      ],
      textures: {
        old: { name: 'Old', style: { alphabet: 'OO', color: 1 } },
        next: { name: 'Next', style: { alphabet: 'NN', color: 2, size: 0.2 } },
      },
    })
    const detached = applyCommands(source, [
      { op: 'texture.apply', id: 'old', objectId: 'tree', link: true },
      { op: 'texture.detach', objectId: 'tree' },
    ])
    const relinked = applyCommands(detached, [
      { op: 'texture.apply', id: 'next', objectId: 'tree', link: true },
    ])
    for (const part of [undefined, 'crown', 'trunk'])
      expect(resolved(relinked, part)).toMatchObject({
        alphabet: 'NN',
        color: 2,
        size: 0.2,
        density: 0.4,
      })
    const partOnly = applyCommands(detached, [
      { op: 'texture.apply', id: 'next', objectId: 'tree', part: 'crown', link: true },
    ])
    expect(resolved(partOnly, 'crown')).toMatchObject({ alphabet: 'NN', color: 2, size: 0.2 })
    expect(resolved(partOnly, 'trunk')).toEqual(resolved(detached, 'trunk'))
    for (const part of [undefined, 'crown', 'trunk'])
      expect(
        resolved(applyCommands(partOnly, [{ op: 'texture.detach', objectId: 'tree' }]), part),
      ).toEqual(resolved(partOnly, part))
  })
  it('keeps studio lighting separate when defining/applying an extended texture', () => {
    const source = initial(),
      before = JSON.stringify(source)
    const doc = applyCommands(source, [
      {
        op: 'texture.define',
        id: 'symbols',
        name: 'Symbols',
        style: {
          alphabet: ' ↑→░▓█',
          font: 'monospace',
          fontWeight: 700,
          open: true,
          palette: [0x224466, 0xff8844],
        },
        previewLighting: { brightness: 2, background: 0x080a12 },
      },
      { op: 'texture.apply', id: 'symbols', objectId: 'rock' },
    ])
    expect(JSON.stringify(source)).toBe(before)
    expect(doc.style).toEqual(source.style)
    expect(doc.textures?.symbols.previewLighting).toEqual({ brightness: 2, background: 0x080a12 })
    expect(doc.objects[0].options?.open).toBe(true)
    expect(doc.objects[0].options?.palette).toEqual([0x224466, 0xff8844])
  })
  it('defines and applies a texture to a part without changing other parts or the source', () => {
    const source = parseScene({
      version: 1,
      objects: [
        {
          id: 'tree',
          prefab: 'arvore',
          position: [0, 0, 0],
          options: { parts: { crown: { glyph: 'body' }, trunk: { glyph: 'surface', size: 0.17 } } },
        },
      ],
    })
    const before = JSON.stringify(source),
      style = { alphabet: ' .:#@', color: 0x39bb74, spacing: 1.4 }
    const doc = applyCommands(source, [
      { op: 'texture.define', id: 'leaves', name: 'Leaves', style },
      { op: 'texture.apply', id: 'leaves', objectId: 'tree', part: 'crown' },
    ])
    expect(JSON.stringify(source)).toBe(before)
    expect(doc.objects[0].options?.parts?.crown).toEqual({ glyph: 'body', ...style })
    expect(doc.objects[0].options?.parts?.trunk).toEqual({ glyph: 'surface', size: 0.17 })
    expect(
      applyCommands(doc, [{ op: 'resource.remove', kind: 'textures', id: 'leaves' }]).textures,
    ).toEqual({})
    expect(() =>
      applyCommands(source, [
        { op: 'texture.define', id: 'bad', name: 'Bad', style: { alphabet: '\n#' } },
      ]),
    ).toThrow()
    expect(() =>
      applyCommands(source, [{ op: 'texture.apply', id: 'missing', objectId: 'tree' }]),
    ).toThrow('Texture not found')
  })
  it('creates, positions, activates and removes composition cameras', () => {
    const source = initial(),
      before = JSON.stringify(source)
    const camera = {
      name: 'Geral',
      projection: 'orthographic',
      position: [0, 8, 10],
      rotation: [-0.4, 0, 0],
      span: 5,
      aspect: 16 / 9,
    }
    const doc = applyCommands(source, [
      { op: 'camera.define', id: 'wide', camera },
      { op: 'camera.update', id: 'wide', patch: { position: [2, 8, 10] } },
      { op: 'camera.activate', id: 'wide' },
    ])
    expect(JSON.stringify(source)).toBe(before)
    expect(doc.cameras!.wide.position).toEqual([2, 8, 10])
    expect(doc.activeCamera).toBe('wide')
    expect(doc.terrain).toEqual(source.terrain)
    const removed = applyCommands(doc, [{ op: 'camera.remove', id: 'wide' }])
    expect(removed.activeCamera).toBeUndefined()
    expect(removed.cameras).toEqual({})
    expect(() => applyCommands(source, [{ op: 'camera.activate', id: 'missing' }])).toThrow(
      'not found',
    )
  })
  it('preserves the entire source when a later operation fails', () => {
    const doc = initial(),
      before = JSON.stringify(doc)
    expect(() =>
      applyCommands(doc, [
        { op: 'object.update', id: 'rock', patch: { position: [1, 2, 3] } },
        { op: 'object.remove', ids: ['missing'] },
      ]),
    ).toThrow('not found')
    expect(JSON.stringify(doc)).toBe(before)
  })
  it('paints slopes without flattening and updates water while sculpting', () => {
    let doc = applyCommands(initial(), [
      { op: 'terrain.stroke', strokes: [{ brush: 'raise', x: 0, z: 0, radius: 3, strength: 4 }] },
      {
        op: 'water.paint',
        points: [
          { x: -3, z: 0 },
          { x: 3, z: 0 },
        ],
        radius: 0.8,
      },
    ])
    const middle = 16 * 33 + 16,
      height = doc.terrain!.heights[middle]
    expect(height).toBe(4)
    expect(waterEdge(doc.waters![0].shape, 0, 0)).toBeGreaterThan(0)
    expect(doc.waters![0].shape.mask!.heights![middle]).toBeCloseTo(height + 0.045)
    doc = applyCommands(doc, [
      { op: 'terrain.stroke', strokes: [{ brush: 'lower', x: 0, z: 0, radius: 2, strength: 1 }] },
    ])
    expect(doc.waters![0].shape.mask!.heights![middle]).toBeCloseTo(3.045)
  })
  it('keeps lakes flat, digs the bed and erases only water', () => {
    const doc = applyCommands(initial(), [
      { op: 'water.paint', points: [{ x: 0, z: 0 }], radius: 2, mode: 'level', level: -0.2 },
    ])
    expect(doc.terrain!.heights[16 * 33 + 16]).toBeCloseTo(-0.38)
    const erased = applyCommands(doc, [
      { op: 'water.paint', index: 0, points: [{ x: 0, z: 0 }], radius: 1, erase: true },
    ])
    expect(waterEdge(erased.waters![0].shape, 0, 0)).toBeLessThan(0)
    expect(erased.terrain).toEqual(doc.terrain)
  })
  it('merges partial reflection controls with the water preset', () => {
    const doc = applyCommands(initial(), [
      {
        op: 'water.paint',
        points: [{ x: 0, z: 0 }],
        radius: 2,
        look: { reflection: { enabled: false } },
      },
    ])
    expect(doc.waters![0].look?.reflection?.enabled).toBe(false)
    const updated = applyCommands(doc, [
      { op: 'water.update', index: 0, patch: { look: { reflection: { enabled: true } } } },
    ])
    expect(updated.waters![0].look?.reflection?.enabled).toBe(true)
    expect(updated.waters![0].look?.reflection?.rows).toBeGreaterThan(0)
  })
  it('scatters reproducibly on the ground and preserves per-part styles', () => {
    const command = {
      op: 'object.scatter',
      prefab: 'arvore',
      count: 10,
      seed: 42,
      bounds: { minX: -3, maxX: 3, minZ: -2, maxZ: 2 },
      scale: [0.8, 1.2],
    }
    const a = applyCommands(initial(), [command]),
      b = applyCommands(initial(), [command])
    expect(a.objects.map(o => [o.position, o.seed, o.scale])).toEqual(
      b.objects.map(o => [o.position, o.seed, o.scale]),
    )
    const styled = applyCommands(a, [
      {
        op: 'object.update',
        id: 'rock',
        patch: { options: { parts: { stone: { glyph: 'body', size: 0.12 } } } },
      },
    ])
    expect(styled.objects[0].options?.parts?.stone.glyph).toBe('body')
  })
  it('defines recipes and prevents removal of resources in use', () => {
    const doc = applyCommands(initial(), [
      {
        op: 'effect.define',
        id: 'fx:custom-blue',
        effect: {
          name: 'Azul',
          duration: 2,
          loop: true,
          emitters: [{ rate: 10, glyphs: '*' }],
          light: { color: 255, intensity: 4 },
        },
      },
      { op: 'object.add', object: { id: 'fire', prefab: 'fx:custom-blue', position: [0, 0, 0] } },
    ])
    expect(() =>
      applyCommands(doc, [{ op: 'resource.remove', kind: 'effects', id: 'fx:custom-blue' }]),
    ).toThrow('instances')
    expect(
      applyCommands(doc, [
        { op: 'object.remove', ids: ['fire'] },
        { op: 'resource.remove', kind: 'effects', id: 'fx:custom-blue' },
      ]).effects,
    ).toEqual({})
  })
  it('merges partial atmosphere settings and allows every document field', () => {
    const doc = applyCommands(initial(), [
      { op: 'atmosphere.set', style: { moon: { intensity: 3 }, inkTint: [1, 0.7, 0.5] } },
      { op: 'scene.patch', patch: { carpet: { count: 5000, seed: 2 } }, unset: ['waters'] },
    ])
    expect(doc.style?.moon?.intensity).toBe(3)
    expect(doc.style?.moon?.position).toHaveLength(3)
    expect(doc.style?.bodySceneLighting).toBe(true)
    expect(doc.carpet?.count).toBe(5000)
  })
  it('saves, applies and removes atmospheres without editor coupling or geometry changes', () => {
    const source = initial(),
      before = JSON.stringify(source)
    const saved = applyCommands(source, [
      {
        op: 'atmosphere.define',
        id: 'night',
        name: 'Noite azul',
        style: { moon: { intensity: 3 }, background: 0x000011, inkTint: [0.5, 0.7, 1] },
      },
    ])
    expect(JSON.stringify(source)).toBe(before)
    expect(saved.style).toBeUndefined()
    expect(saved.atmospheres!.night.style.moon!.position).toHaveLength(3)
    const applied = applyCommands(saved, [{ op: 'atmosphere.apply', id: 'night' }])
    expect(applied.style?.moon?.intensity).toBe(3)
    expect(applied.style?.bodySceneLighting).toBe(true)
    expect(applied.objects).toEqual(source.objects)
    expect(applied.terrain).toEqual(source.terrain)
    expect(parseScene(JSON.parse(JSON.stringify(applied)))).toEqual(applied)
    const removed = applyCommands(applied, [
      { op: 'resource.remove', kind: 'atmospheres', id: 'night' },
    ])
    expect(removed.atmospheres).toEqual({})
    expect(removed.style).toEqual(applied.style)
    expect(() => applyCommands(removed, [{ op: 'atmosphere.apply', id: 'night' }])).toThrow(
      'not found',
    )
  })
  it('rejects reserved keys and invalid dimensions before allocation', () => {
    expect(() =>
      applyCommands(
        initial(),
        JSON.parse('[{"op":"scene.patch","patch":{"__proto__":{"polluted":true}}}]'),
      ),
    ).toThrow('Reserved')
    expect(() => applyCommands(initial(), [{ op: 'terrain.create', resolution: 100000 }])).toThrow()
    expect(() =>
      applyCommands(initial(), [
        { op: 'scene.patch', patch: { terrain: { resolution: 99999 } } },
        { op: 'terrain.stroke', strokes: [] },
      ]),
    ).toThrow()
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
})
