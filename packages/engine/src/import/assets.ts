import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { loadGlyphModel, prepareGlyphModel, type GlyphModel } from './gltf'
import type { SceneDoc, PrefabLibrary } from '../world/scene'

/** Resolve portable sources before the current scene is touched. */
export async function loadSceneAssets(
  doc: SceneDoc,
): Promise<{ library: PrefabLibrary; dispose(): void }> {
  const sources: GlyphModel[] = [],
    instances = new WeakMap<THREE.Object3D, { model: GlyphModel; last: number }>()
  const library: PrefabLibrary = {}
  const release = (model: GlyphModel) => {
    model.mixer.stopAllAction()
    model.mixer.uncacheRoot(model.scene)
    const geometries = new Set<THREE.BufferGeometry>(),
      materials = new Set<THREE.Material>(),
      textures = new Set<THREE.Texture>()
    model.scene.traverse(node => {
      if (node instanceof THREE.Mesh) {
        geometries.add(node.geometry)
        for (const material of [node.material].flat()) {
          materials.add(material)
          for (const value of Object.values(material))
            if (value instanceof THREE.Texture) textures.add(value)
        }
      }
    })
    geometries.forEach(g => g.dispose())
    materials.forEach(m => m.dispose())
    textures.forEach(t => t.dispose())
  }
  try {
    for (const [id, asset] of Object.entries(doc.assets ?? {})) {
      const source = await loadGlyphModel(asset.source)
      source.mixer.stopAllAction()
      sources.push(source)
      library[id] = {
        title: asset.name,
        // Register an editable type for all copies while retaining per-node import defaults.
        style: {},
        create({ item }) {
          const root = clone(source.scene) as THREE.Group
          root.traverse(node => {
            // An asset's Blender declarations are its initial appearance. The
            // editor's type, global and instance layers may override them.
            if (node.userData.glyph || node.userData.glyphStyle) node.userData.glyphDefault = true
            if (node instanceof THREE.Mesh) {
              node.geometry = node.geometry.clone()
              node.material = Array.isArray(node.material)
                ? node.material.map(m => m.clone())
                : node.material.clone()
            }
          })
          const model = prepareGlyphModel(root, source.animations)
          model.mixer.stopAllAction()
          const clip =
            item.animation === null
              ? undefined
              : (source.animations.find(c => c.name === item.animation) ?? source.animations[0])
          if (clip) model.mixer.clipAction(clip).play()
          instances.set(root, { model, last: -1 })
          root.userData.animationClips = source.animations.map(c => c.name)
          return root
        },
        update(object, time) {
          const entry = instances.get(object)
          if (!entry) return
          entry.model.update(entry.last < 0 ? 0 : Math.max(0, Math.min(0.08, time - entry.last)))
          entry.last = time
        },
        dispose(object) {
          const entry = instances.get(object)
          if (entry) {
            entry.model.mixer.stopAllAction()
            entry.model.mixer.uncacheRoot(entry.model.scene)
            instances.delete(object)
          }
        },
      }
    }
  } catch (error) {
    sources.forEach(release)
    throw error
  }
  return {
    library,
    dispose() {
      sources.forEach(release)
      sources.length = 0
    },
  }
}
