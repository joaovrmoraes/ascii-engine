import * as THREE from 'three'
import { seededRandom, type AsciiEngine, type Prefab, type PrefabLibrary } from '@ascii-engine/core'

/** A real prefab preview, outside the scene document and its undo history. */
export function createPlacementPreview(engine: AsciiEngine, library: () => PrefabLibrary) {
  let locked = false
  let current: { key: string; seed: number; object: THREE.Object3D; prefab: Prefab } | undefined
  function clear() {
    if (!current) return
    current.prefab.dispose?.(current.object)
    engine.remove(current.object, { dispose: true }); current = undefined; locked = false
  }
  return {
    show(key: string, point?: THREE.Vector3) {
      if (!point) { clear(); return }
      if (current?.key !== key) {
        clear()
        const prefab = library()[key]; if (!prefab) return
        const seed = Math.floor(Math.random() * 4294967296), item = { prefab: key, seed, position: point.toArray() as [number, number, number] }
        const object = prefab.create({ seed, random: seededRandom(seed), item })
        object.position.copy(point); object.name = `Prévia: ${prefab.title}`; object.userData.editorPreview = true
        try { engine.add(object, { type: prefab.style ? key : undefined }) }
        catch (error) { prefab.dispose?.(object); engine.remove(object, { dispose: true }); throw error }
        current = { key, seed, object, prefab }
      }
      if (!locked) current.object.position.copy(point)
      current.prefab.update?.(current.object, engine.time)
    },
    get object() { return current?.object },
    get locked() { return locked },
    lock() { locked = true },
    seed(key: string) { return current?.key === key ? current.seed : undefined },
    update(time: number) { if (current) current.prefab.update?.(current.object, time) },
    clear,
  }
}
