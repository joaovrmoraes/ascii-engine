import * as THREE from 'three'
import { tagSurface, type AsciiSurface } from './surface'
import { createGlyphCloud } from './glyphCloud'
import { createSnowTracks, snowAccumulation, snowCover, snowCoverGLSL, snowflake, SNOW_EXTENT, SNOW_TRACK_LIFE, type SnowBoot } from './snow'

/** Snow is geometry/material in the existing ASCII pass, including its boot marks. */
export function createSnowEnvironment(scene: THREE.Scene) {
  let seed = 93207
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  const rock = new THREE.IcosahedronGeometry(1, 1), cube = new THREE.BoxGeometry(1, 1, 1)
  const materials = new Map<string, THREE.MeshStandardMaterial>()
  function material(color: number, surface: AsciiSurface) {
    const key = `${color}:${surface}`
    if (!materials.has(key)) materials.set(key, tagSurface(new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: .95 }), surface))
    return materials.get(key)!
  }
  function mesh(geometry: THREE.BufferGeometry, color: number, surface: AsciiSurface, parent: THREE.Object3D, x: number, y: number, z: number, sx: number, sy = sx, sz = sx) {
    const m = new THREE.Mesh(geometry, material(color, surface))
    m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = m.receiveShadow = true; parent.add(m)
    return m
  }
  const size = 512, pixels = new Uint8Array(size * size)
  const footprintMap = new THREE.DataTexture(pixels, size, size, THREE.RedFormat)
  footprintMap.minFilter = footprintMap.magFilter = THREE.LinearFilter; footprintMap.generateMipmaps = false
  const tracks = createSnowTracks(), clock = { value: 0 }
  const groundMaterial = tagSurface(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .94 }), 'snow')
  const baseCompile = groundMaterial.onBeforeCompile
  groundMaterial.onBeforeCompile = (shader, renderer) => {
    baseCompile(shader, renderer)
    shader.uniforms.snowTime = clock; shader.uniforms.footprintMap = { value: footprintMap }
    shader.vertexShader = `varying vec3 snowWorld;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\nsnowWorld=(modelMatrix*vec4(position,1.)).xyz;')
    shader.fragmentShader = `varying vec3 snowWorld; uniform float snowTime; uniform sampler2D footprintMap;\n${snowCoverGLSL}\n${shader.fragmentShader}`
      .replace('#include <color_fragment>', `#include <color_fragment>
        float cover = snowCoverAt(snowWorld.xz, snowTime);
        float drift = sin(snowWorld.x * .8 + sin(snowWorld.z * .55)) * sin(snowWorld.z * 1.3) * .045;
        float track = texture2D(footprintMap, snowWorld.xz / ${SNOW_EXTENT}. + .5).r;
        vec3 powder = vec3(.52,.65,.72) + drift;
        powder *= 1. - track * .68;
        vec3 thaw = vec3(.060,.046,.029) + vec3(.022,.024,.021) * (.5+.5*sin(snowWorld.x*11.+snowWorld.z*7.));
        diffuseColor.rgb *= mix(thaw, powder, cover);`)
  }
  groundMaterial.customProgramCacheKey = () => 'ascii-snow-ground-v1'
  groundMaterial.userData.glyphGround = true
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(32, 32), groundMaterial)
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.025; ground.receiveShadow = true; scene.add(ground)

  const caps: { mesh: THREE.Mesh; base: number; width: number; depth: number }[] = []
  const trees: THREE.Group[] = []
  const crowns: { x: number; z: number; y: number; radius: number }[] = []
  const snowCap = (parent: THREE.Object3D, x: number, y: number, z: number, width: number, depth: number) => {
    const m = mesh(rock, 0xd6e5e8, 'snow', parent, x, y, z, width, .08, depth)
    caps.push({ mesh: m, base: y, width, depth }); return m
  }
  for (const [x,z,h] of [[-4.8,-2.8,3.8],[3.6,-3.3,4.2],[-5.4,5.4,4.0],[5,3.8,3.9],[1.1,-6.5,4.4],[-2.6,-7.5,3.4],[5.8,-.4,3.7],[-6.3,.3,3.4]]) {
    const tree = new THREE.Group(); tree.position.set(x, 0, z); scene.add(tree); trees.push(tree)
    mesh(new THREE.CylinderGeometry(.10,.22,h*.87,7),0x675a47,'bark',tree,0,h*.43,0,1)
    // Overlapping needle boughs form a ragged conifer, with distinct upper snow shelves.
    for (let tier = 0; tier < 4; tier++) {
      const y = h * (.34 + tier * .16), reach = 1.10 - tier * .23
      for (let b = 0; b < 5; b++) {
        const a = b * Math.PI * 2 / 5 + tier * .63 + random() * .3
        const bx = Math.sin(a) * reach * .52, bz = Math.cos(a) * reach * .52
        const branch = mesh(new THREE.CylinderGeometry(.025,.06,reach*1.25,5),0x6d6251,'wood',tree,bx*.6,y-.08,bz*.6,1)
        branch.rotation.z = Math.sin(a) * 1.05; branch.rotation.x = Math.cos(a) * 1.05
        const width = reach * (.72 + random() * .12), depth = reach * (.65 + random() * .16)
        const leaves = mesh(rock,[0x456d59,0x59866d,0x6b8c76][b%3],'foliage',tree,bx,y,bz,width,.22+reach*.12,depth)
        leaves.rotation.y = a
        const cap = snowCap(tree,bx,y+.21,bz,width*.92,depth*.91); cap.rotation.y = a
      }
    }
    mesh(new THREE.ConeGeometry(.32,.9,7),0x4a695b,'foliage',tree,0,h-.1,0,1)
    snowCap(tree,0,h+.1,0,.23,.25)
    crowns.push({ x, z, y: h + .25, radius: 1.2 })
    for (let i = 0; i < 3; i++) snowCap(scene,x+(random()-.5)*.9,.015,z+(random()-.5)*.9,.55,.5)
  }
  // Boulders and a broken fence give the clearing landmarks below the tree line.
  for (const [x,z,s] of [[-2.8,-4.9,.65],[2.5,4.6,.6],[4.1,-.7,.7],[-5,1.5,.48],[-.7,-7,.65]]) {
    mesh(rock,0x657b85,'stone',scene,x,s*.35,z,s,s*.6,s*.8)
    snowCap(scene,x,s*.72,z,s*.85,s*.68)
  }
  for (let i = 0; i < 6; i++) {
    const x = -4.8 + i * .8, z = -4.4
    const post = mesh(cube,0x706758,'wood',scene,x,.44,z,.11,.88,.12); post.rotation.z = (random()-.5)*.13
    snowCap(scene,x,.89,z,.12,.13)
    if (i < 4) {
      mesh(cube,0x807465,'wood',scene,x+.4,.65,z,.85,.10,.10)
      snowCap(scene,x+.4,.71,z,.42,.10)
    }
  }
  for (let i = 0; i < 45; i++) {
    const x = (random()-.5)*15, z = (random()-.5)*20
    if (snowCover(x,z,0) < .8 || Math.abs(x) < 2.4) continue
    const stem = mesh(cube,0x8e947c,'wood',scene,x,.12,z,.025,.24,.025)
    stem.rotation.z = (random()-.5)*.55
  }

  const weather = new THREE.Scene(), flakes = createGlyphCloud(1000)
  weather.add(flakes.mesh)
  let lastStamp = -1, lastCount = -1
  function paintTracks(time: number) {
    pixels.fill(0)
    const cell = SNOW_EXTENT / size
    for (const print of tracks.prints) {
      const strength = (1 - (time - print.at) / SNOW_TRACK_LIFE) ** .7
      const cx = Math.floor((print.x / SNOW_EXTENT + .5) * size), cz = Math.floor((print.z / SNOW_EXTENT + .5) * size)
      const sin = Math.sin(print.heading), cos = Math.cos(print.heading)
      for (let iz = cz-5; iz <= cz+5; iz++) for (let ix = cx-5; ix <= cx+5; ix++) {
        if (ix < 0 || iz < 0 || ix >= size || iz >= size) continue
        const dx = (ix+.5)*cell-SNOW_EXTENT/2-print.x, dz = (iz+.5)*cell-SNOW_EXTENT/2-print.z
        const across = dx*cos-dz*sin, forward = dx*sin+dz*cos
        const toe = Math.hypot(across/.115,(forward-.045)/.16), heel = Math.hypot(across/.083,(forward+.12)/.075)
        const ink = Math.max(0,Math.min(1,(1-Math.min(toe,heel))/.32))*strength
        const index = iz*size+ix; pixels[index] = Math.max(pixels[index],Math.round(ink*255))
      }
    }
    footprintMap.needsUpdate = true; lastStamp = time; lastCount = tracks.prints.length
  }
  return {
    weather, occludeWith: flakes.occludeWith,
    get footprintCount() { return tracks.prints.length },
    animate(time: number) {
      clock.value = time
      const depth = snowAccumulation(time)
      caps.forEach(cap => {
        cap.mesh.scale.set(cap.width*(.85+depth*.15),.065+depth*.19,cap.depth*(.85+depth*.15))
        cap.mesh.position.y = cap.base+depth*.065
      })
      trees.forEach((tree,i) => { tree.rotation.z = Math.sin(time*.55+i*1.7)*.008 })
    },
    update(time: number, feet: readonly SnowBoot[], heading: number, active: boolean, travelled: number, hero: THREE.Vector3, camera: THREE.OrthographicCamera, height: number, brightness: number) {
      tracks.update(time,feet,heading,active,travelled)
      if (lastStamp < 0 || tracks.prints.length !== lastCount || time-lastStamp > .15) paintTracks(time)
      flakes.clear()
      for (let i = 0; i < 950; i++) {
        const f = snowflake(i,time)
        if (Math.hypot(f.x-hero.x,f.z-hero.z)>10) continue
        if (crowns.some(c=>Math.hypot(f.x-c.x,f.z-c.z)<c.radius && f.y<c.y)) continue
        const cover = snowCover(f.x,f.z,time)
        const melt = cover < .5 ? Math.min(1,Math.max(0,(f.y-.5)/1.4)) : 1
        if (melt <= 0) continue
        flakes.push(f.x,f.y,f.z,f.size,i%5 === 0 ? '*' : i%3 === 0 ? '+' : '.', [.88,.94,1],Math.min(1,.68+f.size*1.6)*melt)
      }
      flakes.commit(height,camera,brightness)
    },
    dispose() { footprintMap.dispose(); flakes.dispose() },
  }
}
