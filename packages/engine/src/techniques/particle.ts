import * as THREE from 'three'
import { illuminationGLSL, illuminationUniforms } from '../illumination'

/** Glyphs a particle can carry. */
export const PARTICLE_GLYPHS = '.,:;oOQ0cuvn|/\\-=~*+#%^AX'

/**
 * Technique `particle` (Pomorog `glyphCloud.ts`): native world-space characters
 * for water, fire and spell particles, refilled every frame.
 */
export function createGlyphCloud(capacity: number) {
  const glyphs = PARTICLE_GLYPHS
  const atlas = document.createElement('canvas'); atlas.width = glyphs.length * 32; atlas.height = 40
  const ctx = atlas.getContext('2d')!
  ctx.fillStyle = '#fff'; ctx.font = '29px "Courier New", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  Array.from(glyphs).forEach((g, i) => ctx.fillText(g, i * 32 + 16, 21))
  const texture = new THREE.CanvasTexture(atlas); texture.generateMipmaps = false
  texture.minFilter = texture.magFilter = THREE.LinearFilter
  const positions = new Float32Array(capacity * 3), colors = new Float32Array(capacity * 3), shapes = new Float32Array(capacity * 3)
  const geometry = new THREE.BufferGeometry()
  const position = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
  const color = new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)
  const shape = new THREE.BufferAttribute(shapes, 3).setUsage(THREE.DynamicDrawUsage)
  geometry.setAttribute('position', position); geometry.setAttribute('inkColor', color); geometry.setAttribute('shape', shape)
  const material = new THREE.ShaderMaterial({
    transparent: true, depthTest: true, depthWrite: false,
    uniforms: { ...illuminationUniforms(), atlas: { value: texture }, pixelScale: { value: 60 }, brightness: { value: 1 },
      worldDepth: { value: null }, depthSize: { value: new THREE.Vector2(1, 1) }, useWorldDepth: { value: 0 } },
    vertexShader: `attribute vec3 inkColor, shape; uniform float pixelScale; varying vec3 vColor, vShape;
      varying vec3 worldPoint;
      void main() { worldPoint = (modelMatrix * vec4(position, 1.)).xyz; vColor = inkColor; vShape = shape; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_PointSize = clamp(shape.y * pixelScale * 1.45, 4., 48.); }`,
    fragmentShader: `uniform sampler2D atlas, worldDepth; uniform float brightness, useWorldDepth; uniform vec2 depthSize; varying vec3 vColor, vShape;
      varying vec3 worldPoint;
      ${illuminationGLSL}
      void main() {
        if (useWorldDepth > .5 && gl_FragCoord.z > texture2D(worldDepth, gl_FragCoord.xy / depthSize).r + .00035) discard;
        vec2 uv = vec2((gl_PointCoord.x - .5) * 1.25 + .5, 1. - gl_PointCoord.y); if (uv.x < 0. || uv.x > 1.) discard;
        float ink = texture2D(atlas, vec2((vShape.x + uv.x) / ${glyphs.length}.0, uv.y)).a;
        if (ink < .12) discard;
        vec3 lit = illuminateInk(vColor * brightness, worldPoint);
        lit = lit / (vec3(1.) + lit * .32);
        gl_FragColor = vec4(illuminationEnabled > .5 ? max(vec3(.035,.031,.055), lit) : lit, ink * vShape.z); }`,
  })
  const mesh = new THREE.Points(geometry, material); mesh.frustumCulled = false; mesh.userData.glyph = 'particle'
  let count = 0
  return {
    mesh, uniforms: material.uniforms,
    // Read scene depth explicitly: the postprocess framebuffer does not always
    // preserve the depth attachment on embedded Chromium/WebKit renderers.
    occludeWith(texture: THREE.DepthTexture, width: number, height: number) {
      material.depthTest = false
      material.uniforms.worldDepth.value = texture; material.uniforms.depthSize.value.set(width, height)
      material.uniforms.useWorldDepth.value = 1
    },
    clear() { count = 0 },
    push(x: number, y: number, z: number, size: number, glyph: string, ink: readonly number[], alpha = 1) {
      if (count >= capacity) return
      const i = count++ * 3
      positions[i] = x; positions[i + 1] = y; positions[i + 2] = z
      colors[i] = ink[0]; colors[i + 1] = ink[1]; colors[i + 2] = ink[2]
      shapes[i] = Math.max(0, glyphs.indexOf(glyph)); shapes[i + 1] = size; shapes[i + 2] = alpha
    },
    commit(height: number, camera: THREE.OrthographicCamera, brightness: number) {
      geometry.setDrawRange(0, count); position.needsUpdate = color.needsUpdate = shape.needsUpdate = true
      material.uniforms.pixelScale.value = height / (camera.top - camera.bottom)
      material.uniforms.brightness.value = brightness
    },
    dispose() { geometry.dispose(); material.dispose(); texture.dispose() },
  }
}

export type GlyphCloud = ReturnType<typeof createGlyphCloud>
