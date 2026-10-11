import * as THREE from 'three'
import { createAdventurer, type ActorModel } from './models'
import { markActorInk } from './actorInk'
import { damp, smooth, turn } from './motion'
import type { Presence } from '../../online/types'

/** Remote actors interpolate actual presence snapshots; they never drive local combat. */
export function createPeers(scene: THREE.Scene, host: HTMLElement, disposeObject: (root: THREE.Object3D) => void, ink: (root: THREE.Object3D) => void = markActorInk) {
  const layer = document.createElement('div'); layer.className = 'world-peer-layer'; host.appendChild(layer)
  type Remote = { model: ActorModel; label: HTMLElement; arrival: number; leaving: number; sitting: number; peer: Presence }
  const actors = new Map<string, Remote>(), previous = new THREE.Vector3(), projected = new THREE.Vector3()
  return {
    update(peers: Presence[], time: number, dt: number, camera: THREE.Camera, width: number, height: number) {
      const ids = new Set(peers.map((peer) => peer.user.id))
      for (const peer of peers) {
        let actor = actors.get(peer.user.id)
        if (!actor) {
          const model = createAdventurer(); ink(model.root)
          const hue = parseInt(peer.user.id.slice(0, 4), 16) % 3
          const materials = new Set<THREE.MeshStandardMaterial>()
          model.root.traverse((obj) => { if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) materials.add(obj.material) })
          materials.forEach((material) => { if (material.color.getHex() === 0xb65342) material.color.setHex([0x749fa5, 0xbf9a54, 0x9383b5][hue]) })
          model.root.position.set(peer.pose.x, 0, peer.pose.z); model.root.rotation.y = peer.pose.yaw; scene.add(model.root)
          const label = document.createElement('div'); label.className = 'world-peer'; label.dataset.peer = peer.user.id; layer.appendChild(label)
          actor = { model, label, arrival: time, leaving: -1, sitting: peer.pose.sitting, peer }; actors.set(peer.user.id, actor)
        }
        actor.peer = peer; actor.leaving = -1
      }
      for (const [id, actor] of actors) {
        if (!ids.has(id) && actor.leaving < 0) actor.leaving = time
        const arrival = dt > 0 ? smooth((time - actor.arrival) / .7) : 1, departure = actor.leaving < 0 ? 1 : dt > 0 ? 1 - smooth((time - actor.leaving) / .35) : 0
        if (departure <= 0) { scene.remove(actor.model.root); disposeObject(actor.model.root); actor.label.remove(); actors.delete(id); continue }
        const { pose } = actor.peer, model = actor.model
        previous.copy(model.root.position)
        // A stable side lane keeps identical autorun paths legible.
        const lane = (parseInt(id.slice(0, 2), 16) % 7 - 3) * .28
        model.root.position.x = damp(model.root.position.x, pose.x + lane + .65, 3.5, dt)
        model.root.position.z = damp(model.root.position.z, pose.z + .25, 3.5, dt)
        model.root.rotation.y = turn(model.root.rotation.y, pose.yaw, 7, dt)
        model.root.scale.setScalar(Math.max(.001, arrival * departure))
        actor.sitting = damp(actor.sitting, pose.sitting, 5, dt)
        const distance = previous.distanceTo(model.root.position)
        model.animate({ time, dt, speed: dt > 0 ? Math.min(2, distance / dt) : 0, distance, attackAge: -1, hurtAge: -1, sitting: actor.sitting })
        projected.copy(model.root.position); projected.y += model.height - actor.sitting * .53; projected.project(camera)
        actor.label.style.left = `${(projected.x * .5 + .5) * width}px`; actor.label.style.top = `${(-projected.y * .5 + .5) * height}px`
        actor.label.style.opacity = String(arrival * departure)
        const text = `@ ${actor.peer.user.username}${actor.peer.phase === 'bonfire' ? ' / descanso' : ''}`
        if (actor.label.textContent !== text) actor.label.textContent = text
      }
    },
    dispose() { layer.remove(); actors.clear() },
  }
}
