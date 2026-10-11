import * as THREE from 'three'
import { SURFACE_ALPHA } from './surface'
import { createWaterReflection, waterReflectionGLSL, waterReflectionUniforms } from './waterReflection'
import { WORLD_GLYPH_ALPHA, worldWaterGLSL, worldWaterUniforms } from './worldGlyph'

/** The river and cathedral aisles share planar reflections without flooding dry ground. */
export function createChannelWater(scene: THREE.Scene, forest: boolean, glyphs = false) {
  const material = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, ...waterReflectionUniforms(), ...(glyphs ? worldWaterUniforms() : {}) },
    vertexShader: `varying vec3 p; varying vec4 mirrorUv; uniform mat4 reflectionMatrix;
      void main(){vec4 w=modelMatrix*vec4(position,1.);p=w.xyz;mirrorUv=reflectionMatrix*w;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `varying vec3 p; uniform float time;
      ${waterReflectionGLSL}
      ${glyphs ? worldWaterGLSL() : ''}
      void main(){
        float shore=${forest ? '1.17-abs(p.x-3.95-sin(p.z*.45)*.5)' : '1.48-abs(abs(p.x)-5.2)'};
        if(shore<0.||p.z< -10.||p.z>12.)discard;
        float wave=sin(p.z*7.-time*.9+sin(p.x*2.)*.4);
        vec3 ink=vec3(.004,.016,.022)+vec3(.003,.007,.009)*max(0.,wave);
        vec4 reflected=reflectedWater(p,time,vec3(0.),0.);
        ink=mix(ink,reflected.rgb,reflected.a*smoothstep(0.,.12,shore));
        float signal=dot(reflected.rgb,vec3(.2126,.7152,.0722))*reflected.a;
        ${glyphs ? `
        float edge=1.-smoothstep(0.,.18,shore);
        gl_FragColor=vec4(waterLetters(p,time,edge*.7+max(0.,wave-.85),vec2(0.,${forest ? '.22' : '.06'}),0.,vec3(0.)),${WORLD_GLYPH_ALPHA.toFixed(2)});` : `
        gl_FragColor=vec4(ink,signal>.009?${SURFACE_ALPHA.reflection.toFixed(1)}:${SURFACE_ALPHA.water.toFixed(1)});`}
      }`,
  })
  const surface = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), material)
  surface.rotation.x = -Math.PI / 2; surface.position.y = .018; scene.add(surface)
  const reflection = createWaterReflection(scene, surface, material)
  return { reflection, animate(time: number) { material.uniforms.time.value = time }, dispose() { reflection.dispose() } }
}
