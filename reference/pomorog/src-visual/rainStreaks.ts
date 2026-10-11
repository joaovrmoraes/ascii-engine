import * as THREE from 'three'

/** Fine '/' strokes following the actual fall vector; width stays one pixel. */
export function createRainStreaks(capacity: number) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(capacity * 4 * 3), alphas = new Float32Array(capacity * 4)
  const position = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
  const opacity = new THREE.BufferAttribute(alphas, 1).setUsage(THREE.DynamicDrawUsage)
  geometry.setAttribute('position', position); geometry.setAttribute('opacity', opacity)
  const material = new THREE.ShaderMaterial({
    transparent: true, depthTest: true, depthWrite: false,
    uniforms: { brightness: { value: 1 }, worldDepth: { value: null },
      depthSize: { value: new THREE.Vector2(1, 1) }, useWorldDepth: { value: 0 } },
    vertexShader: `attribute float opacity; varying float alpha;
      void main() { alpha=opacity; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform sampler2D worldDepth; uniform vec2 depthSize;
      uniform float brightness,useWorldDepth; varying float alpha;
      void main() {
        if(useWorldDepth>.5 && gl_FragCoord.z>texture2D(worldDepth,gl_FragCoord.xy/depthSize).r+.00035)discard;
        vec3 ink=vec3(.68,.78,.84)*brightness;
        gl_FragColor=vec4(ink/(vec3(1.)+ink*.32),alpha);
      }`,
  })
  const mesh = new THREE.LineSegments(geometry, material); mesh.frustumCulled = false
  let vertices = 0
  function point(x: number, y: number, z: number, opacity: number) {
    const offset = vertices * 3
    positions[offset] = x; positions[offset + 1] = y; positions[offset + 2] = z
    alphas[vertices++] = opacity
  }
  return {
    mesh,
    occludeWith(texture: THREE.DepthTexture, width: number, height: number) {
      material.depthTest = false
      material.uniforms.worldDepth.value = texture; material.uniforms.depthSize.value.set(width, height)
      material.uniforms.useWorldDepth.value = 1
    },
    clear() { vertices = 0 },
    push(x: number, y: number, z: number, length: number, alpha: number) {
      if (vertices + 4 > alphas.length) return
      // Tail points against velocity (.75, -6.5, .25), leaving a tiny gap
      // between two strokes rather than an enlarged, square text particle.
      const dx = -.75 / 6.5 * length, dz = -.25 / 6.5 * length
      point(x, y, z, alpha)
      point(x + dx * .54, y + length * .54, z + dz * .54, alpha * .70)
      point(x + dx * .63, y + length * .63, z + dz * .63, alpha * .60)
      point(x + dx, y + length, z + dz, alpha * .10)
    },
    commit(brightness: number) {
      geometry.setDrawRange(0, vertices); position.needsUpdate = opacity.needsUpdate = true
      material.uniforms.brightness.value = brightness
    },
    dispose() { geometry.dispose(); material.dispose() },
  }
}
