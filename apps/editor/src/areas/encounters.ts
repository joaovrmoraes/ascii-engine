import * as THREE from 'three'
import { createCombatEffects, IMPACT_DELAY, FIRE_TRAVEL_TIME, type Entry, type Spell } from '../pomorog/combatEffects'
import { type AsciiEngine, type Carpet } from '@ascii-engine/core'
import { createCreature, type ActorModel } from '../pomorog/models'
import { smooth, turn } from '../pomorog/motion'

/**
 * Demo encounters (Pomorog `scene.ts` + `demo.ts`), presentation only: a
 * creature enters (charge from off-screen, rise from the soil, swoop from the
 * sky), blows are exchanged with spells, the creature dissolves into letters
 * and leaves a pouch. No game rules: the blow list is a fixed script.
 */
export const DEMO_MONSTERS: { id: string; family: string; name: string }[] = [
  { id: 'forest_wolf', family: 'beast', name: 'Forest Wolf' },
  { id: 'crimson_grub', family: 'insect', name: 'Crimson Grub' },
  { id: 'giant_spider', family: 'insect', name: 'Giant Spider' },
  { id: 'forest_wasp', family: 'insect', name: 'Forest Wasp' },
  { id: 'goblin_scout', family: 'humanoid', name: 'Goblin Scout' },
]
/** Blows after the approach, every .85 s (the last one kills, 1.4 s). */
const SCRIPT: { target: 'hero' | 'foe'; damage: boolean; spell?: boolean }[] = [
  { target: 'foe', damage: true }, { target: 'hero', damage: true }, { target: 'foe', damage: true, spell: true },
  { target: 'hero', damage: false }, { target: 'foe', damage: true }, { target: 'hero', damage: true }, { target: 'foe', damage: true, spell: true },
]
const APPROACH = 1.6, BLOW = .85, DEFEAT = 1.4, LOOT = 3.2

const deathDelay = (spell?: Spell) => IMPACT_DELAY + (spell === 'fire' ? FIRE_TRAVEL_TIME : 0)

export function createEncounters(engine: AsciiEngine, hero: ActorModel & { root: THREE.Group }, carpet?: Carpet) {
  const letters = engine.createParticles(1600)
  engine.add(letters.mesh, { glyph: 'particle' })
  const fx = createCombatEffects(letters)
  engine.scene.add(fx.light, fx.aura)
  if (carpet) { carpet.setGlow(0, fx.light); carpet.setGlow(1, fx.aura) }

  // The loot pouch stays in the screen pass, like the hero.
  const loot = new THREE.Group()
  const lootMaterial = new THREE.MeshStandardMaterial({ color: 0xd5ba7a, roughness: 1 })
  const pouch = new THREE.Mesh(new THREE.IcosahedronGeometry(.2, 1), lootMaterial); pouch.scale.set(.85, 1, .7); loot.add(pouch)
  const tie = new THREE.Mesh(new THREE.TorusGeometry(.08, .025, 4, 6), lootMaterial); tie.position.y = .19; tie.rotation.x = Math.PI / 2; loot.add(tie)
  engine.add(loot, { type: 'hero' }); loot.visible = false

  let enemy: ActorModel | null = null, monster = DEMO_MONSTERS[0], count = 0
  let start = -1, spawnTime = 0, deathTime = -1, entry: Entry = 'charge', blowIndex = 0, spell: Spell = 'lightning'
  let enemyAttack = -10, enemyHurt = -10, heroAttack = -10, heroHurt = -10, casting = false
  const anchor = new THREE.Vector3(), direction = new THREE.Vector3(), previous = new THREE.Vector3()

  function clear() {
    if (enemy) engine.remove(enemy.root, { dispose: true })
    enemy = null; loot.visible = false
    engine.setActors({ foe: null })
  }

  return {
    get active() { return start >= 0 },
    get foe() { return enemy?.root.position },
    get name() { return enemy ? monster.name : '' },
    get state() { return start < 0 ? 'walk' : deathTime >= 0 ? 'defeat' : 'fight' },
    /** Starts an encounter: the creature arrives along `toward` (unit, on the ground). */
    begin(time: number, toward: THREE.Vector3, camera: THREE.Camera) {
      clear()
      monster = DEMO_MONSTERS[count++ % DEMO_MONSTERS.length]
      spell = (['lightning', 'fire', 'frost'] as const)[count % 3]
      enemy = createCreature(monster.family, monster.id)
      engine.add(enemy.root, { type: 'creature' })
      start = spawnTime = time; deathTime = -1; blowIndex = 0
      // Offset sideways on screen so the creature is never hidden behind the hero.
      const side = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize()
      direction.copy(toward).addScaledVector(side, Math.sign(side.dot(toward) || 1) * .9).normalize()
      anchor.copy(hero.root.position).addScaledVector(direction, 2.35); anchor.y = 0
      entry = monster.family === 'undead' || /grub|snail|crawler|slime/.test(monster.id) ? 'rise'
        : /wasp|gazer|watcher|seraph|orb|grimoire|imp|wraith|shade/.test(monster.id) ? 'swoop' : 'charge'
      enemy.root.position.copy(anchor).addScaledVector(direction, entry === 'charge' ? 11 : entry === 'swoop' ? 9 : 0)
      if (entry === 'rise') enemy.root.position.y -= enemy.height + .2
      enemy.root.rotation.y = Math.atan2(-direction.x, -direction.z) + .25
    },
    /** Advances the fight; returns true while the hero must stand still. */
    update(time: number, dt: number) {
      if (start < 0 || !enemy) { letters.clear(); fx.update(time, engine.camera, { hero: hero.root.position }); return false }
      const age = time - start
      // Scripted blows after the approach.
      while (blowIndex < SCRIPT.length && age >= APPROACH + blowIndex * BLOW) {
        const blow = SCRIPT[blowIndex++]
        const last = blowIndex === SCRIPT.length
        const blowSpell = blow.spell || last ? spell : undefined
        fx.hit(time, { target: blow.target, damage: blow.damage, spell: blow.target === 'foe' ? blowSpell : undefined, hero: hero.root.position, foe: enemy.root.position })
        if (blow.target === 'foe') { heroAttack = time; casting = !!blowSpell; if (blow.damage) enemyHurt = time + deathDelay(blowSpell) }
        else { enemyAttack = time; if (blow.damage) heroHurt = time + IMPACT_DELAY }
        if (last) deathTime = time + deathDelay(blowSpell)
      }
      const spawnAge = time - spawnTime
      previous.copy(enemy.root.position)
      if (entry === 'charge') {
        const t = Math.min(1, spawnAge / 1.6), remain = t < .75 ? 1 - t * 1.08 : .19 * (1 - smooth((t - .75) / .25))
        enemy.root.position.copy(anchor).addScaledVector(direction, Math.max(0, remain) * 11)
      } else if (entry === 'swoop') {
        const t = 1 - (1 - Math.min(1, spawnAge / 1.5)) ** 2
        enemy.root.position.copy(anchor).addScaledVector(direction, (1 - t) * 9)
        enemy.root.position.y = anchor.y + (1 - t) * 4
      } else {
        const t = smooth((spawnAge - .25) / 1.25)
        enemy.root.position.copy(anchor)
        enemy.root.position.y = anchor.y - (1 - t) * (enemy.height + .2)
        enemy.root.position.x += Math.sin(spawnAge * 40) * .025 * (1 - t)
      }
      const moved = previous.distanceTo(enemy.root.position)
      const facing = Math.atan2(hero.root.position.x - enemy.root.position.x, hero.root.position.z - enemy.root.position.z)
      enemy.root.rotation.y = turn(enemy.root.rotation.y, facing + .25, 7, dt)
      hero.root.rotation.y = turn(hero.root.rotation.y, facing + Math.PI - .2, 6, dt)
      const dead = deathTime >= 0 && time >= deathTime
      const collapse = dead ? smooth((time - deathTime) / .85) : 0
      enemy.root.visible = collapse < 1
      const stride = Math.min(moved, dt * 3.2)
      enemy.animate({ time, dt, speed: dt > 0 ? stride / dt : 0, distance: stride, attackAge: time - enemyAttack, hurtAge: time - enemyHurt, death: collapse })
      hero.animate({ time, dt, speed: 0, distance: 0, attackAge: time - heroAttack, hurtAge: time - heroHurt, casting })
      engine.setActors({ foe: enemy.root.visible ? enemy.root.position : null, foeHeight: enemy.height })
      // Pouch: bounces out of the dissolving creature.
      const lootAge = dead ? Math.max(0, time - deathTime - .55) : 0
      loot.visible = dead && time - deathTime > .55
      loot.position.set(enemy.root.position.x, .24 + Math.abs(Math.sin(Math.min(1, lootAge / .7) * Math.PI * 2)) * .14 * Math.exp(-lootAge * 3), enemy.root.position.z)
      loot.rotation.y = Math.min(lootAge, .7) * 2
      letters.clear()
      fx.update(time, engine.camera, { hero: hero.root.position, foe: enemy.root.position, foeDead: dead, spawnAge, entry, anchor })
      if (dead && time - deathTime > DEFEAT + LOOT) { clear(); start = -1 }
      return true
    },
  }
}
