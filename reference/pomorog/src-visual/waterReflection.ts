import * as THREE from 'three'

const reflectionBias = new THREE.Matrix4().set(.5,0,0,.5, 0,.5,0,.5, 0,0,.5,.5, 0,0,0,1)
const waterNormal = new THREE.Vector3(0, 1, 0)
const eye = new THREE.Vector3(), look = new THREE.Vector3(), up = new THREE.Vector3()

/** Reflect the view across the current water level, including orbit, pan and zoom. */
export function updateReflectionCamera(camera: THREE.OrthographicCamera, mirror: THREE.OrthographicCamera, level: number, matrix: THREE.Matrix4) {
  camera.updateMatrixWorld()
  camera.getWorldPosition(eye)
  camera.getWorldDirection(look).add(eye)
  up.set(0, 1, 0).applyQuaternion(camera.getWorldQuaternion(mirror.quaternion)).reflect(waterNormal)
  mirror.copy(camera)
  mirror.position.copy(eye); mirror.position.y = level * 2 - eye.y
  look.y = level * 2 - look.y
  mirror.up.copy(up); mirror.lookAt(look); mirror.updateMatrixWorld()
  matrix.copy(reflectionBias).multiply(mirror.projectionMatrix).multiply(mirror.matrixWorldInverse)
}

export function waterReflectionUniforms() {
  return { reflection: { value: null as THREE.Texture | null }, reflectionMatrix: { value: new THREE.Matrix4() } }
}

/** Shared by flooded ground and calm channels; the final image still goes through ASCII. */
export const waterReflectionGLSL = `
  uniform sampler2D reflection;
  varying vec4 mirrorUv;
  vec4 reflectedWater(vec3 p, float time, vec3 disturbance, float vegetation) {
    vec2 uv = mirrorUv.xy / mirrorUv.w;
    // Gentle horizontal shear retains the silhouette; boot/rain waves bend it locally.
    uv += vec2(sin(p.z * 10. + time * 1.3) * .0014 + disturbance.g * .035,
      sin(p.x * 6. - time * .65) * .0007 + disturbance.b * .018);
    float border = min(min(uv.x, uv.y), min(1. - uv.x, 1. - uv.y));
    float valid = smoothstep(0., .015, border);
    vec4 reflected = texture2D(reflection, clamp(uv, vec2(.001), vec2(.999)));
    // The opaque background has alpha 1; tagged geometry carries its material ID.
    float object = 1. - step(.96, reflected.a);
    float bands = .68 + .32 * smoothstep(-.55, .65, sin(p.z * 17. + p.x * .6 - time * 1.1));
    float weight = .56 * valid * object * bands * (1. - clamp(vegetation, 0., 1.) * .42);
    return vec4(reflected.rgb * vec3(.82, .92, .98), weight);
  }
`

/** A real mirrored world, sampled by the water before the ASCII conversion. */
export function createWaterReflection(scene: THREE.Scene, surface: THREE.Mesh, material: THREE.ShaderMaterial) {
  const target = new THREE.WebGLRenderTarget(640, 640, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter })
  const mirror = new THREE.OrthographicCamera()
  const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  material.uniforms.reflection.value = target.texture
  return {
    render(renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera) {
      const level = surface.position.y
      updateReflectionCamera(camera, mirror, level, material.uniforms.reflectionMatrix.value)
      const previous = renderer.getRenderTarget(), clipping = renderer.clippingPlanes, shadow = renderer.shadowMap.autoUpdate
      const visible = surface.visible
      clip.constant = -level; surface.visible = false
      renderer.clippingPlanes = [clip]; renderer.shadowMap.autoUpdate = false
      try { renderer.setRenderTarget(target); renderer.render(scene, mirror) }
      finally {
        renderer.setRenderTarget(previous); renderer.clippingPlanes = clipping
        renderer.shadowMap.autoUpdate = shadow; surface.visible = visible
      }
    },
    dispose() { target.dispose() },
  }
}
