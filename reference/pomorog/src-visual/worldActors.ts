import * as THREE from 'three'
import type { VisualSettings } from './types'
import { feedbackImpactDelay } from './motion'

/** Only names, health and combat text live in the HUD; bodies are rendered in 3D. */
export function createWorldActors(host: HTMLElement) {
  const layer = document.createElement('div')
  layer.className = 'world-annotations'
  host.appendChild(layer)
  function actor(kind: string) {
    const root = document.createElement('div'); root.className = `world-actor ${kind}`
    const name = document.createElement('span'); name.className = 'actor-name'
    const health = document.createElement('span'); health.className = 'actor-health'
    const damage = document.createElement('span'); damage.className = 'actor-damage'
    const impact = document.createElement('span'); impact.className = 'actor-impact'
    impact.setAttribute('aria-hidden', 'true'); impact.textContent = '\\|/\n-*-\n/|\\'
    root.append(name, health, damage, impact); layer.append(root)
    return { root, name, health, damage, impact }
  }
  const player = actor('is-player'), enemy = actor('is-enemy')
  enemy.root.hidden = true
  const projected = new THREE.Vector3()
  let feedbackId: string | undefined, feedbackTime = -10, initialized = false
  let feedbackTarget: 'player' | 'enemy' = 'enemy'
  function text(element: HTMLElement, value: string) { if (element.textContent !== value) element.textContent = value }
  function project(point: THREE.Vector3, camera: THREE.Camera, width: number, height: number) {
    projected.copy(point).project(camera)
    return { x: (projected.x * .5 + .5) * width, y: (-projected.y * .5 + .5) * height }
  }
  return {
    update(settings: VisualSettings, camera: THREE.Camera, heroHead: THREE.Vector3, enemyHead: THREE.Vector3, heroFeet: THREE.Vector3, enemyFeet: THREE.Vector3, width: number, height: number, time: number) {
      text(player.name, settings.playerLabel ?? '@')
      enemy.root.hidden = !settings.creature
      if (settings.creature) {
        text(enemy.name, settings.creatureName ?? settings.creature)
        const hp = settings.creatureHp ?? 0, max = settings.creatureMaxHp ?? 1
        const filled = Math.round(8 * Math.max(0, Math.min(1, hp / max)))
        text(enemy.health, `[${'#'.repeat(filled)}${'-'.repeat(8 - filled)}] ${hp}/${max}`)
      }
      if (!initialized) { feedbackId = settings.feedback?.id; initialized = true }
      if (settings.feedback && settings.feedback.id !== feedbackId) {
        feedbackId = settings.feedback.id; feedbackTime = time + feedbackImpactDelay(settings.feedback.spell); feedbackTarget = settings.feedback.target
        player.damage.textContent = enemy.damage.textContent = ''
        ;(feedbackTarget === 'player' ? player : enemy).damage.textContent = settings.feedback.text
      }
      const age = time - feedbackTime
      for (const [kind, target, head, feet] of [['player', player, heroHead, heroFeet], ['enemy', enemy, enemyHead, enemyFeet]] as const) {
        const top = project(head, camera, width, height), bottom = project(feet, camera, width, height)
        target.root.style.left = `${top.x.toFixed(1)}px`
        target.root.style.top = `${top.y.toFixed(1)}px`
        target.health.style.top = `${(bottom.y - top.y + 6).toFixed(1)}px`
        target.damage.style.opacity = age >= 0 && age < 1.5 && kind === feedbackTarget ? String(Math.min(1, (1.5 - age) * 2)) : '0'
        target.impact.style.opacity = age >= 0 && age < .28 && kind === feedbackTarget && Math.abs(Number(settings.feedback?.text)) > 0 ? String(1 - age / .28) : '0'
        target.damage.style.transform = `translate(-50%, ${-28 - Math.min(age, 1.5) * 18}px)`
      }
    },
    dispose() { layer.remove() },
  }
}
