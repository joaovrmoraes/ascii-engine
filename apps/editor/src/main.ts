import * as THREE from 'three'
import { ENGINE_VERSION } from '@ascii-engine/core'

// Cena mínima de verificação do ambiente. A fase 1 troca isto pelo
// renderizador da engine com a cena de referência portada do Pomorog.
const host = document.getElementById('app')!
const renderer = new THREE.WebGLRenderer({ antialias: false })
renderer.setPixelRatio(1)
host.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x09080e)
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
camera.position.set(4, 3.2, 5)
camera.lookAt(0, 0.5, 0)
scene.add(new THREE.HemisphereLight(0xd6d5e7, 0x44323b, 2))
const sun = new THREE.DirectionalLight(0xffe0af, 3)
sun.position.set(-4, 7, 6)
scene.add(sun)
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xa17c51, flatShading: true }))
box.position.y = 0.5
scene.add(box)

function resize() {
  const { clientWidth: w, clientHeight: h } = host
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
addEventListener('resize', resize)
resize()

document.getElementById('status')!.textContent = `ascii-engine ${ENGINE_VERSION} · sem passe ASCII (fase 0)`
renderer.setAnimationLoop((t) => {
  box.rotation.y = t / 1600
  renderer.render(scene, camera)
})
