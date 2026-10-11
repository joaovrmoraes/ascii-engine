import * as THREE from 'three'

/** The offscreen alpha channel marks actors; the final pass remains opaque. */
export function markActorInk(root: THREE.Object3D) {
  const materials = new Set<THREE.Material>()
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material)
    }
  })
  for (const material of materials) {
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        '#include <dithering_fragment>\ngl_FragColor.a = 0.5;',
      )
    }
    material.customProgramCacheKey = () => 'ascii-actor-ink'
  }
}
