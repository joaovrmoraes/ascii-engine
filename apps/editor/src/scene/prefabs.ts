import * as THREE from 'three'
import { createCampfire, type AsciiEngine, type PrefabLibrary } from '@ascii-engine/core'
import { cap, createCamp, createKit, createTree, log, rock } from './pomorogKit'

/**
 * Prefab library of the editor, built from the Pomorog pieces. Each copy is
 * an object of type = prefab name, so restyling the type changes every copy.
 */
export function createPrefabs(engine: AsciiEngine): PrefabLibrary {
  const kit = createKit()
  const fireLetters = engine.createParticles(4000)
  engine.add(fireLetters.mesh, { glyph: 'particle' })
  const fires = new Map<THREE.Object3D, ReturnType<typeof createCampfire>>()
  let lastClear = -1
  const library: PrefabLibrary = {
    arvore: {
      title: 'árvore', style: { style: { glyph: 'surface', surface: 'bark' }, parts: { crown: { glyph: 'body', surface: 'foliage', size: .19 }, trunk: { glyph: 'surface', surface: 'bark' } } },
      create() {
        const tree = createTree(0, 0, 3.8 + Math.random() * 1.2, Math.floor(Math.random() * 1e6))
        tree.root.userData.animate = tree.animate
        return tree.root
      },
      update(object, time) { (object.userData.animate as ((t: number) => void) | undefined)?.(time) },
    },
    pedregulho: {
      title: 'pedregulho',
      create() {
        const group = new THREE.Group()
        for (let k = 0; k < 3; k++) {
          const s = .3 + Math.random() * .45
          kit.add(rock, [0x6a706c, 0x787d78, 0x5c625f][k], (Math.random() - .5) * 1.1, s * .4, (Math.random() - .5) * 1.1, s, s * .8, s * .9, group, 'stone').rotation.set(Math.random(), Math.random() * 6, Math.random())
        }
        return group
      },
    },
    caixa: { title: 'caixa', create() { const g = new THREE.Group(); kit.box(0x646356, 0, .35, 0, .63, .65, .58, g, 'wood'); return g } },
    ponte: {
      title: 'ponte',
      create() {
        const bridge = new THREE.Group(), span = 4
        for (let i = 0; i < Math.ceil(span / .17); i++) kit.box(i % 3 ? 0x63594c : 0x81715c, 0, .16, -span / 2 + i * .17, 1.25, .13, .15, bridge, 'wood')
        for (const x of [-.66, .66]) {
          kit.box(0x6f6454, x, .5, 0, .1, .1, span, bridge, 'wood')
          for (const z of [-span / 2, 0, span / 2]) kit.box(0x8a7a60, x, .5, z, .09, 1, .09, bridge, 'wood')
        }
        return bridge
      },
    },
    ruina: {
      title: 'ruína',
      create() {
        const ruin = new THREE.Group(), colors = [0x656774, 0x717582, 0x555b69, 0x7b7f88]
        for (let row = 0; row < 9; row++) for (let col = -3; col <= 3; col++) {
          const x = col * .49 + (row % 2) * .23
          if (row > 3 && Math.abs(x) < .4) continue
          if (row > 5 + Math.sin(col * 1.7) * 2) continue
          kit.box(colors[(row * 7 + col + 9) % 4], x, .17 + row * .32, 0, .45, .29, .55, ruin, 'stone')
        }
        for (const x of [-1.8, 1.8]) kit.box(0x6a6e7a, x, 1.2, .2, .45, 2.4, .9, ruin, 'stone')
        return ruin
      },
    },
    'pedras-em-pe': {
      title: 'pedras em pé',
      create() {
        const ring = new THREE.Group()
        for (let i = 0; i < 5; i++) {
          const a = i / 5 * Math.PI * 2, h = .9 + (i % 3) * .3
          kit.box(0x7a7f86, Math.cos(a) * 1.3, h / 2, Math.sin(a) * 1.3, .35, h, .28, ring, 'stone').rotation.y = a
        }
        return ring
      },
    },
    'tronco-caido': {
      title: 'tronco caído',
      create() {
        const g = new THREE.Group()
        kit.add(log, 0x6d5a42, 0, .22, 0, .22, 3.4, .22, g, 'bark').rotation.set(Math.PI / 2, 0, 0)
        for (let i = 0; i < 5; i++) kit.add(cap, 0xc9a96b, (Math.random() - .5) * .3, .35, (Math.random() - .5) * 2.6, .12, .06, .12, g, 'wood')
        return g
      },
    },
    fogueira: {
      title: 'fogueira (com fogo e luz)',
      create() {
        const camp = createCamp(kit, false)
        const fire = createCampfire(fireLetters, new THREE.Vector3())
        camp.add(fire.light); fire.light.position.set(0, 1.05, 0)
        fires.set(camp, fire)
        return camp
      },
      update(object, time) {
        const fire = fires.get(object)
        if (!fire || !object.parent) return
        if (time !== lastClear) { fireLetters.clear(); lastClear = time }
        object.getWorldPosition(fire.position)
        fire.update(time, engine.camera)
        fire.light.position.set(0, 1.05, 0)
      },
    },
  }
  return library
}
