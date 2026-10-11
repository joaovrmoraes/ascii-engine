import * as THREE from 'three'
import { createGlyphCloud } from './glyphCloud'
import type { VisualSettings } from './types'
import { IMPACT_DELAY, FIRE_TRAVEL_TIME, smooth } from './motion'
import { swampWeather } from './swamp'

const fract = (v: number) => v - Math.floor(v)
const warm = [1, .63, .2], white = [1, .94, .64], blue = [.58, .78, 1], violet = [.57, .51, .94]
const danger = [.95, .3, .22], gold = [1, .82, .38], mote = [.82, .96, .72]
const wrap = (v: number, span: number) => ((v % span) + span) % span - span / 2

/** ASCII particles carry the shape; a restrained additive halo carries the light. */
export function createEffects(camp: THREE.Vector3) {
  const scene = new THREE.Scene(), cloud = createGlyphCloud(1600)
  scene.add(cloud.mesh); cloud.mesh.renderOrder = 2
  const glowCanvas = document.createElement('canvas'); glowCanvas.width = glowCanvas.height = 64
  const ctx = glowCanvas.getContext('2d')!, gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, '#ffffffa0'); gradient.addColorStop(.2, '#ffffff60'); gradient.addColorStop(.6, '#ffffff18'); gradient.addColorStop(1, '#ffffff00')
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64)
  const texture = new THREE.CanvasTexture(glowCanvas)
  const fireMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xffbb54, transparent: true, opacity: .6, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false })
  const fireGlow = new THREE.Sprite(fireMaterial); fireGlow.position.copy(camp); fireGlow.position.y = .6; fireGlow.scale.set(2.1, 2.5, 1); fireGlow.visible = false
  const impactMaterial = fireMaterial.clone(), impactGlow = new THREE.Sprite(impactMaterial); scene.add(impactGlow); impactGlow.visible = false
  const auraMaterial = fireMaterial.clone(); auraMaterial.color.setHex(0xffd36e); auraMaterial.depthTest = true
  const auraGlow = new THREE.Sprite(auraMaterial); auraGlow.visible = false; scene.add(auraGlow)
  const lanternMaterial = fireMaterial.clone()
  lanternMaterial.color.setHex(0xffd18b); lanternMaterial.opacity = .28; lanternMaterial.depthTest = true
  const lanternGlow = new THREE.Sprite(lanternMaterial); lanternGlow.scale.set(.95, 1.25, 1)
  const burst = new THREE.Vector3(), origin = new THREE.Vector3(), fireRight = new THREE.Vector3(), fireToward = new THREE.Vector3()
  const light = new THREE.PointLight(0xffaa55, 0, 7, 2)
  // The caster's aura lights the meadow around them, like the reference's golden pools.
  const aura = new THREE.PointLight(0xffc66b, 0, 4.5, 1.6)
  let feedbackId: string | undefined, began = -10, spell: 'fire' | 'lightning' | 'frost' | 'slash' = 'slash'
  let castAt = -10, struckAt = -10, deathAt = -1, lastDust = -1, lastStep = -1
  const dustTrail: { x: number; z: number; t: number }[] = []
  return {
    scene, light, aura, occludeWith: cloud.occludeWith,
    update(time: number, settings: VisualSettings, hero: THREE.Vector3, foe: THREE.Vector3 | undefined, camera: THREE.OrthographicCamera, height: number, spawnAge: number, lantern: THREE.Vector3, entry: 'charge' | 'rise' | 'swoop' = 'charge', anchor?: THREE.Vector3, heroSpeed = 0) {
      cloud.clear()
      const wet = settings.locationId === 'rain_marsh', weather = swampWeather(time)
      const heat = wet ? weather.fire : 1
      lanternGlow.position.copy(lantern); lanternGlow.position.y -= .5
      lanternMaterial.opacity = .26 + Math.sin(time * 3.7) * .025
      // Sparse drifting motes catch the lamp, without blurring the ASCII shapes.
      for (let i = 0; i < 24; i++) {
        const a = i * 2.399 + time * .06, radius = 1.1 + fract(i * .618) * 2.7
        const fade = Math.sin(time * .55 + i * 1.7) ** 6
        cloud.push(hero.x + Math.cos(a) * radius, .35 + fract(i * .37) * 1.8 + Math.sin(time * .45 + i) * .13,
          hero.z + Math.sin(a) * radius, .055, '.', [.85,.67,.35], fade * .3)
      }
      // ASCII bonfire. Tall tongues of letters: a dense white root (@#), an
      // orange body (%x*), thin red tips (+:.). An ember bed glows on the
      // ground, sparks spiral up and grey smoke letters drift away.
      const ramp: [string, number[]][] = [['@', [1.3, 1.15, .55]], ['#', [1.3, .98, .3]], ['%', [1.25, .78, .16]], ['x', [1.2, .6, .1]], ['*', [1.1, .45, .07]], ['+', [1, .32, .05]], [':', [.85, .2, .04]], ['.', [.65, .12, .03]]]
      // Classic terminal fire: a heat grid anchored at the logs and turned to
      // the camera. Every cell is one readable letter picked by temperature;
      // flames rise and flicker cell by cell, with no overlapping particles.
      const right = fireRight.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize()
      const toward = fireToward.setFromMatrixColumn(camera.matrixWorld, 2).setY(0).normalize().multiplyScalar(.45)
      const cols = 5, rows = 13, cw = .15, ch = .19
      for (let r = 0; r < rows; r++) for (let c = -cols; c <= cols; c++) {
        const h = r / (rows - 1)
        const width = (cols + .5) * (1 - h * .8) * (.85 + .15 * Math.sin(time * 2.3 + r * .7))
        const shape = 1 - Math.abs(c + Math.sin(time * 1.7 + r * .45) * h * 1.6) / Math.max(.6, width)
        if (shape <= 0) continue
        const n = Math.sin(c * 1.7 + r * .9 - time * 7.5) * Math.sin(c * .6 - r * 1.3 - time * 5.1 + 1.3)
        const flick = fract(Math.sin((c + 13) * 12.9 + (r - Math.floor(time * 9)) * 78.2) * 43758.5)
        const heatValue = (Math.pow(shape, 1.6) * (1 - h * .85) * 1.7 + n * .3 + flick * .2 - .12) * heat
        if (heatValue < .14 || (h > .55 && flick > .8)) continue
        const k = Math.min(7, Math.floor((1 - Math.min(1, heatValue)) * 8))
        const [glyph, colour] = ramp[k]
        cloud.push(camp.x + toward.x + right.x * c * cw + (wet ? h * .25 : 0), .2 + r * ch, camp.z + toward.z + right.z * c * cw, .21, glyph, colour, .9 + Math.min(.1, heatValue * .1))
      }
      for (let i = 0; i < 26; i++) {
        // Ember bed: a ring of glowing letters on the logs that breathes.
        const a = i / 26 * Math.PI * 2, r = .2 + fract(i * .618) * .32, glow = .55 + .45 * Math.sin(time * 2.7 + i * 1.9)
        cloud.push(camp.x + Math.cos(a) * r, .1, camp.z + Math.sin(a) * r, .15, glow > .75 ? '*' : glow > .45 ? '+' : ':', glow > .75 ? [1, .66, .25] : [.85, .3, .08], (.45 + glow * .5) * heat)
      }
      for (let i = 0; i < 34; i++) {
        const life = fract(time * (.32 + fract(i * .41) * .3) + i * .618)
        const spark = i < 22
        const swirl = life * 5 + i
        cloud.push(camp.x + Math.sin(swirl) * (.12 + life * .45), .55 + life * (spark ? 2.6 : 2.2) * heat, camp.z + Math.cos(swirl) * (.12 + life * .35),
          spark ? .13 : .2, spark ? (life < .2 ? '*' : '.') : ',;:~'[i % 4], spark ? [1, .75 - life * .3, .3] : [.38, .36, .35], (1 - life) * (spark ? 1 : .5) * heat)
      }
      if (wet) {
        // Pale steam replaces the tall flame when a shower quenches the logs.
        for (let i = 0; i < 58; i++) {
          const life = fract(time * .42 + i * .618), a = i * 2.399
          const radius = .12 + life * .48
          cloud.push(camp.x + Math.cos(a + life * 3) * radius + life * .4, .2 + life * 1.65,
            camp.z + Math.sin(a) * radius, .11 + life * .07, '.,:~'[i % 4], [.56,.63,.67], Math.sin(life * Math.PI) * weather.steam * .6)
        }
        for (let i = 0; i < 8; i++) {
          const life = fract(time * 2.1 + i * .618), a = i * 2.399
          cloud.push(camp.x + Math.cos(a) * (.16 + life * .38), .18 + Math.sin(life * Math.PI) * .28,
            camp.z + Math.sin(a) * (.16 + life * .38), .08, ',', [.58,.68,.73], (1 - life) * .55)
        }
      }
      fireMaterial.opacity = (.5 + Math.sin(time * 7) * .06) * heat
      fireGlow.scale.set(1.4 + heat * .7, .9 + heat * 1.6, 1)
      if (settings.feedback && settings.feedback.id !== feedbackId) {
        if (settings.feedback.target === 'enemy' && settings.feedback.spell) castAt = time
        if (settings.feedback.target === 'player' && Number(settings.feedback.text) < 0) struckAt = time
        feedbackId = settings.feedback.id
        if (Number(settings.feedback.text) < 0 && (settings.feedback.spell || spell === 'slash' || time - began > 1.25)) {
          began = time + IMPACT_DELAY; spell = settings.feedback.spell ?? 'slash'
          burst.copy(settings.feedback.target === 'player' ? hero : foe ?? hero); burst.y = .9
          origin.copy(settings.feedback.target === 'player' ? foe ?? hero : hero); origin.y = 1.25
        }
      }
      const age = time - began
      light.position.copy(burst)
      light.color.setHex(spell === 'fire' ? 0xff991f : 0x8caaff)
      light.intensity = spell === 'slash' || age < 0 ? 0 : Math.max(0, 1 - age / 1.25) * 12
      impactGlow.visible = false
      if (impactGlow.visible) {
        impactGlow.position.copy(burst); impactGlow.scale.setScalar(spell === 'fire' ? 2.5 : 1.7)
        impactMaterial.color.setHex(spell === 'fire' ? 0xffd678 : 0xb8cfff)
        impactMaterial.opacity = Math.max(0, 1 - age / .9) * .85
      }
      // Combat effects read from across the map: bolder letters than ambient motes.
      const fx = (x: number, y: number, z: number, size: number, glyph: string, ink: readonly number[], alpha = 1) => cloud.push(x, y, z, size * 1.4, glyph, ink, alpha)
      if (age >= 0 && age < 1.25) {
        const dx = burst.x - origin.x, dz = burst.z - origin.z, length = Math.hypot(dx, dz) || 1
        const ax = dx / length, az = dz / length, px = -az, pz = ax
        const star = (cx: number, cy: number, cz: number, radius: number, alpha: number, colour: readonly number[], size: number) => {
          // Radial spokes drawn with the letter that matches their direction.
          for (let spoke = 0; spoke < 8; spoke++) {
            const a = spoke / 8 * Math.PI * 2, glyph = '-\\|/-\\|/'[spoke]
            for (let k = 1; k <= 3; k++) fx(cx + px * Math.cos(a) * radius * k / 3, cy + Math.sin(a) * radius * k / 3, cz + pz * Math.cos(a) * radius * k / 3, size, glyph, colour, alpha * (1.1 - k * .25))
          }
        }
        if (spell === 'fire') {
          const travel = Math.min(1, age / FIRE_TRAVEL_TIME), explosion = Math.max(0, age - FIRE_TRAVEL_TIME)
          const hx = THREE.MathUtils.lerp(origin.x, burst.x, travel), hz = THREE.MathUtils.lerp(origin.z, burst.z, travel)
          const hy = THREE.MathUtils.lerp(origin.y, burst.y, travel) + Math.sin(travel * Math.PI) * .7
          if (travel < 1) {
            light.position.set(hx, hy, hz)
            fx(hx, hy, hz, .32, '@', white, 1)
            for (let i = 1; i < 16; i++) {
              const back = Math.max(0, travel - i * .045)
              fx(THREE.MathUtils.lerp(origin.x, burst.x, back) + Math.sin(i * 3 + time * 20) * .04, THREE.MathUtils.lerp(origin.y, burst.y, back) + Math.sin(back * Math.PI) * .7,
                THREE.MathUtils.lerp(origin.z, burst.z, back), .28 - i * .014, '#%x*+:..'[Math.min(7, Math.floor(i / 2))], i < 4 ? [1, .85, .45] : warm, 1 - i / 16)
            }
          } else {
            const e = explosion
            for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 28; i++) {
              const a = i / 28 * Math.PI * 2, radius = e * (2.2 - ring * .7)
              fx(burst.x + Math.cos(a) * radius, .1 + ring * .25, burst.z + Math.sin(a) * radius, .22, ring ? 'o' : 'O', ring ? warm : [1, .85, .5], Math.max(0, 1 - e / .8))
            }
            for (let c = 0; c < 9; c++) {
              const a = c * 2.399, r = .15 + fract(c * .618) * .45
              for (let k = 0; k < 6; k++) {
                const h = k / 5
                fx(burst.x + Math.cos(a) * r, .1 + h * (1.3 * Math.min(1, e * 4)), burst.z + Math.sin(a) * r, .22 - h * .08, '@#%x+.'[k], h < .3 ? white : warm, Math.max(0, 1 - e / .9) * (1 - h * .4))
              }
            }
            if (e < .3) star(burst.x, burst.y, burst.z, .4 + e * 3, 1 - e / .3, [1, .9, .55], .2)
          }
        } else if (spell === 'lightning') {
          const flicker = .6 + .4 * Math.cos(age * 60) ** 2, fade = Math.max(0, 1 - age * 2.4) * flicker
          let x = burst.x, z = burst.z
          for (let i = 0; i < 26; i++) {
            const y = burst.y + i * .22, step = Math.sin(Math.floor(age * 24) * 3.1 + i * 2.7) * .14
            const glyph = Math.abs(step) < .05 ? '|' : step > 0 ? '/' : '\\'
            fx(x, y, z, .24, glyph, [.92, .96, 1], fade)
            fx(x + px * .1, y, z + pz * .1, .2, glyph, blue, fade * .8)
            fx(x - px * .1, y, z - pz * .1, .2, glyph, violet, fade * .6)
            x += px * step; z += pz * step
            if (i % 7 === 3) for (let b2 = 1; b2 < 4; b2++) fx(x + px * b2 * .14 * (i % 2 ? 1 : -1), y - b2 * .12, z + pz * b2 * .14, .16, i % 2 ? '\\' : '/', blue, fade * .7)
          }
          for (let i = 0; i < 36; i++) {
            const a = i / 36 * Math.PI * 2, radius = .3 + age * 2.4 * (.6 + fract(i * .4) * .4)
            fx(burst.x + Math.cos(a) * radius, .06, burst.z + Math.sin(a) * radius, .18, '~-=+'[i % 4], i % 3 ? blue : violet, Math.max(0, 1 - age * 1.4))
          }
          if (age < .25) star(burst.x, burst.y, burst.z, .7, 1 - age / .25, [.85, .92, 1], .22)
        } else if (spell === 'frost') {
          for (let spike = 0; spike < 13; spike++) {
            const a = spike / 13 * Math.PI * 2, radius = .55 + age * .4, h = (.7 + fract(spike * .618) * 1.4) * smooth((age - spike * .012) * 6)
            for (let j = 0; j < 9; j++) {
              const p = j / 8
              fx(burst.x + Math.cos(a) * radius * (1 - p * .25), .08 + p * h, burst.z + Math.sin(a) * radius * (1 - p * .25), .24 - p * .08, j === 8 ? '^' : j > 5 ? 'A' : '#', j > 5 ? [.85, .95, 1] : blue, Math.min(1, (1.25 - age) * 3))
            }
          }
          for (let i = 0; i < 20; i++) {
            const life = fract(age * 1.5 + i * .618), a = i * 2.399
            fx(burst.x + Math.cos(a) * life * 1.2, .3 + life * 1.4, burst.z + Math.sin(a) * life * 1.2, .16, '*', [.85, .95, 1], (1 - life) * Math.min(1, (1.25 - age) * 3))
          }
        } else if (age < .6) {
          // Sword: a thick crescent sweeps across the target leaving a fading
          // trail, then a star of spokes and sparks that fall with gravity.
          const sweep = Math.min(1, age / .16)
          for (let row = 0; row < 3; row++) for (let i = 0; i < 18; i++) {
            const p = i / 17
            if (p > sweep) continue
            const behind = sweep - p, alpha = Math.max(0, 1 - behind * 2.2) * Math.max(0, 1 - Math.max(0, age - .16) / .3)
            if (alpha <= 0) continue
            const arc = -1.1 + p * 2.2, r = .75 + row * .12
            const glyph = behind < .12 ? (row === 1 ? '#' : '/') : behind < .35 ? (row === 1 ? '/' : '-') : row === 1 ? ':' : '.'
            fx(burst.x + px * Math.sin(arc) * r - ax * .25, burst.y + Math.cos(arc) * r * .6 - .15, burst.z + pz * Math.sin(arc) * r - az * .25,
              .2 + (row === 1 ? .04 : 0), glyph, behind < .12 ? white : [.75, .88, 1], alpha)
          }
          if (age > .12 && age < .4) star(burst.x, burst.y, burst.z, .25 + (age - .12) * 2.5, 1 - (age - .12) / .28, white, .2)
          for (let i = 0; i < 18; i++) {
            const t2 = Math.max(0, age - .12), a = i * 2.399, v = 1.4 + fract(i * .37) * 1.6
            if (t2 <= 0) continue
            fx(burst.x + px * Math.cos(a) * v * t2 - ax * t2 * .6, burst.y + Math.sin(a) * v * t2 * .7 + 1.2 * t2 - 4.5 * t2 * t2, burst.z + pz * Math.cos(a) * v * t2 - az * t2 * .6,
              .14, i % 3 ? '.' : '*', [1, .85, .5], Math.max(0, 1 - t2 / .45))
          }
        }
      }
      // Creature claws: three red rakes over the hero when a blow lands.
      const clawAge = time - struckAt - IMPACT_DELAY + .05
      if (clawAge >= 0 && clawAge < .5) {
        const draw = Math.min(1, clawAge / .12), fade = Math.max(0, 1 - Math.max(0, clawAge - .12) / .38)
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0), cx = right.x, cz = right.z
        for (let c = 0; c < 3; c++) for (let i = 0; i < 9; i++) {
          const p = i / 8; if (p > draw) continue
          const off = (c - 1) * .2
          fx(hero.x + cx * (off + (p - .5) * .5), 1.75 - p * 1.1, hero.z + cz * (off + (p - .5) * .5), .22, p > draw - .2 ? '#' : '\\', [1, .28 + p * .1, .22], fade)
        }
      }
      // A slain creature dissolves into letters that rise and scatter.
      if (foe && settings.creatureHp === 0) { if (deathAt < 0) deathAt = time } else deathAt = -1
      const dissolve = deathAt < 0 ? -1 : time - deathAt
      if (dissolve >= 0 && dissolve < 1.6) for (let i = 0; i < 60; i++) {
        const life = Math.min(1, dissolve / 1.6), a = i * 2.399, start = fract(i * .618)
        const rise = Math.max(0, dissolve - start * .4)
        if (rise <= 0) continue
        fx(foe!.x + Math.cos(a) * (.2 + rise * .6), .2 + start * 1.1 + rise * 1.3, foe!.z + Math.sin(a) * (.2 + rise * .5),
          .17, '@#%*+:.'[Math.min(6, Math.floor(rise * 5))], i % 4 ? [.9, .82, .66] : [1, .6, .25], Math.max(0, 1 - rise / 1.2) * (1 - life * .3))
      }
      // Fireflies and moon motes keep the open map alive between encounters.
      const outdoors = !settings.locationId || settings.locationId === 'dark_forest' || wet
      if (outdoors) for (let i = 0; i < 70; i++) {
        const x = hero.x + wrap(fract(i * .618) * 18 + Math.sin(time * .21 + i) * .6 - hero.x, 18)
        const z = hero.z + wrap(fract(i * .382 + .17) * 18 + Math.cos(time * .17 + i * 1.3) * .6 - hero.z, 18)
        const twinkle = Math.max(0, Math.sin(time * (1.1 + fract(i * .71) * 1.6) + i * 2.1)) ** 6
        cloud.push(x, .25 + fract(i * .37) * 1.5 + Math.sin(time * .6 + i) * .14, z, .15 + twinkle * .07, twinkle > .55 ? '*' : '+',
          i % 4 ? mote : white, (.22 + twinkle * .78) * (wet ? 1 - weather.rain * .6 : 1))
      }
      const fighting = foe && (settings.creatureHp ?? 1) > 0
      if (foe && fighting && spawnAge > .5) {
        // A dotted engagement ring on the ground marks who is in the fight.
        const reveal = smooth((spawnAge - .5) / .6), radius = .95
        for (let i = 0; i < 64; i++) {
          const a = i / 64 * Math.PI * 2 + time * .25
          cloud.push(foe.x + Math.cos(a) * radius, .05, foe.z + Math.sin(a) * radius * .92, i % 8 ? .15 : .19, i % 8 ? 'o' : '*', danger, .8 * reveal * (i % 2 ? .65 : 1))
        }
      }
      const strikeAge = time - struckAt
      if (strikeAge >= 0 && strikeAge < .6) {
        // The incoming blow tightens a red ring on the hero, then it flashes out.
        const closing = Math.min(1, strikeAge / .28), radius = strikeAge < .28 ? 1.2 - closing * .8 : .4 + (strikeAge - .28) * 2.2
        const alpha = strikeAge < .28 ? .35 + closing * .6 : Math.max(0, 1 - (strikeAge - .28) / .32)
        for (let i = 0; i < 40; i++) {
          const a = i / 40 * Math.PI * 2
          cloud.push(hero.x + Math.cos(a) * radius, .06, hero.z + Math.sin(a) * radius, strikeAge < .28 ? .15 : .2, strikeAge < .28 ? 'o' : '*', danger, alpha)
        }
      }
      const castAge = time - castAt
      aura.intensity = 0
      auraGlow.visible = false
      if (castAge >= 0 && castAge < 1.1) {
        // Golden aura: an orbit of glyphs, rising motes and a warm pool of light.
        const strength = Math.sin(Math.min(1, castAge / 1.1) * Math.PI)
        aura.intensity = strength * 9
        aura.position.set(hero.x, .9, hero.z)
        auraGlow.visible = false; auraGlow.position.set(hero.x, .95, hero.z)
        auraGlow.scale.setScalar(1.5 + strength * .5); auraMaterial.opacity = strength * .55
        for (let i = 0; i < 36; i++) {
          const a = i / 36 * Math.PI * 2 + castAge * 5, tilt = Math.sin(a * 2 + castAge * 3) * .12
          cloud.push(hero.x + Math.cos(a) * .62, .95 + tilt, hero.z + Math.sin(a) * .62, i % 3 ? .15 : .2, i % 3 ? 'o' : '*', gold, strength * .9)
        }
        for (let i = 0; i < 26; i++) {
          const life = fract(castAge * 1.4 + i * .618), a = i * 2.399
          cloud.push(hero.x + Math.cos(a) * (.25 + life * .3), .1 + life * 2.1, hero.z + Math.sin(a) * (.25 + life * .3), i % 2 ? .13 : .17, i % 2 ? '+' : '*', i % 3 ? gold : white, strength * (1 - life))
        }
      }
      if (foe && anchor && spawnAge < 2.2) {
        const dirt = [.5, .4, .27]
        if (entry === 'rise') {
          // The ground cracks open in radiating strokes, then soil erupts.
          const crack = Math.min(1, spawnAge / .3), fade = Math.max(0, 1 - Math.max(0, spawnAge - 1.2) / 1)
          for (let spoke = 0; spoke < 10; spoke++) {
            const a = spoke / 10 * Math.PI * 2 + .3, glyph = '-\\|/-\\|/-\\'[Math.round(spoke / 10 * 8) % 8]
            for (let k = 1; k <= 4; k++) {
              if (k / 4 > crack) continue
              const r = .25 + k * .22 * (1 + fract(spoke * .37) * .4)
              cloud.push(anchor.x + Math.cos(a) * r, .04, anchor.z + Math.sin(a) * r, .2, glyph, [.3, .24, .16], fade * .95)
            }
          }
          for (let i = 0; i < 46; i++) {
            const t = spawnAge - .2 - fract(i * .618) * .9
            if (t < 0 || t > .9) continue
            const a = i * 2.399, v = 1 + fract(i * .41) * 1.5
            cloud.push(anchor.x + Math.cos(a) * (.2 + v * t * .6), .1 + v * t * 1.6 - 3.2 * t * t, anchor.z + Math.sin(a) * (.2 + v * t * .6),
              .18, ',.`;:o*'[i % 7], i % 5 ? dirt : [.62, .56, .44], 1 - t / .9)
          }
        } else if (entry === 'charge') {
          // Dust kicked up along the charge, settling behind the creature.
          if (spawnAge < 1.4 && time - lastDust > .045) { dustTrail.push({ x: foe.x, z: foe.z, t: time }); lastDust = time }
        } else {
          // Wind streaks fall away as the flyer swoops in.
          for (let i = 0; i < 24; i++) {
            const t = spawnAge - fract(i * .618) * .8
            if (t < 0 || t > .7) continue
            cloud.push(foe.x + Math.sin(i * 3.1) * .6, foe.y + .4 + t * 1.6 + fract(i * .37) * .6, foe.z + Math.cos(i * 2.3) * .6, .18, i % 2 ? '~' : '-', [.7, .78, .82], (1 - t / .7) * .8)
          }
        }
      }
      // Jogging kicks up small puffs of dust letters behind the boots.
      if (heroSpeed > 1.85 && time - lastStep > .16) { dustTrail.push({ x: hero.x, z: hero.z, t: time }); lastStep = time }
      for (let i = dustTrail.length - 1; i >= 0; i--) {
        const d = dustTrail[i], age2 = time - d.t
        if (age2 > 1.1) { dustTrail.splice(i, 1); continue }
        for (let k = 0; k < 3; k++) {
          const a = k * 2.1 + d.t * 13
          cloud.push(d.x + Math.cos(a) * age2 * .5, .08 + age2 * .55 + k * .05, d.z + Math.sin(a) * age2 * .5, .17 + age2 * .08, k ? '.' : ',:'[Math.floor(d.t * 20) % 2], [.48, .44, .36], (1 - age2 / 1.1) * .75)
        }
      }
      cloud.commit(height, camera, settings.asciiBrightness)
    },
    dispose() { cloud.dispose(); fireMaterial.dispose(); impactMaterial.dispose(); lanternMaterial.dispose(); auraMaterial.dispose(); texture.dispose() },
  }
}
