import * as THREE from 'three'
import type { AsciiEngine } from '../engine'
import type { PrefabLibrary } from '../world/scene'
import type { EffectDef, EffectInstance } from './effects'

/** Portable effect recipes, independent of the editor or any biome library. */
export function createEffectPrefabs(engine: AsciiEngine, definitions: Record<string, EffectDef> = {}): PrefabLibrary {
  return Object.fromEntries(Object.entries(definitions).map(([key, definition]) => {
    const playing = new WeakMap<THREE.Object3D, EffectInstance>()
    return [key, {
      title: `efeito: ${definition.name}`,
      create() { return new THREE.Group() },
      update(object: THREE.Object3D) {
        if (!object.visible) { playing.get(object)?.cancel(); playing.delete(object); return }
        if (!playing.has(object)) playing.set(object, engine.fx.play(definition, object))
      },
      dispose(object: THREE.Object3D) { playing.get(object)?.cancel(); playing.delete(object) },
    }]
  }))
}
