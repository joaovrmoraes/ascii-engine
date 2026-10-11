import * as THREE from 'three'
import { TransformControls, type TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'
import type { AsciiEngine } from '@ascii-engine/core'

/** Editor-only overlays: never enter the scene document or ASCII pipeline. */
export function createGizmos(engine: AsciiEngine, callbacks: { change(): void; commit(): void; allowed(): boolean }) {
  const canvas = engine.renderer.domElement, overlay = new THREE.Scene()
  const control = new TransformControls(engine.camera)
  let consumed = false
  const abort = new AbortController()
  canvas.addEventListener('pointerdown', e => { consumed = false; control.enabled = callbacks.allowed() && !e.altKey && !e.shiftKey && e.button === 0 }, { capture: true, signal: abort.signal })
  canvas.addEventListener('pointermove', e => { if (!control.dragging) control.enabled = callbacks.allowed() && !e.altKey && !e.shiftKey && e.buttons === 0 }, { capture: true, signal: abort.signal })
  control.connect(canvas); control.setSize(.85)
  overlay.add(control.getHelper())
  const ring = new THREE.Mesh(new THREE.RingGeometry(.42, .46, 48), new THREE.MeshBasicMaterial({ color: 0x79baff, transparent: true, opacity: .9, depthTest: false, side: THREE.DoubleSide }))
  ring.rotation.x = -Math.PI / 2; ring.visible = false; overlay.add(ring)
  control.addEventListener('mouseDown', () => { consumed = true })
  control.addEventListener('objectChange', () => {
    control.object?.scale.clampScalar(.01, 1000)
    callbacks.change()
  })
  control.addEventListener('mouseUp', () => {
    if (control.mode === 'scale' && control.object) engine.setInstanceStyle(control.object, {})
    callbacks.commit()
    // Selection's pointerup runs after TransformControls on the same canvas.
    setTimeout(() => { consumed = false }, 0)
  })
  return {
    get hovered() { return control.enabled && !!control.axis && !!control.object },
    get dragging() { return control.dragging },
    get consumed() { return consumed || control.dragging },
    attach(object?: THREE.Object3D) { if (object && object.visible) control.attach(object); else control.detach() },
    mode(mode: TransformControlsMode) { control.setMode(mode) },
    space(space: 'world' | 'local') { control.setSpace(space) },
    snap(on: boolean) { control.setTranslationSnap(on ? .5 : null); control.setRotationSnap(on ? Math.PI / 12 : null); control.setScaleSnap(on ? .1 : null) },
    cancel() { if (control.dragging) control.reset() },
    cursor(point?: THREE.Vector3, radius = .44) { ring.visible = !!point; if (point) { ring.position.copy(point).y += .04; ring.scale.setScalar(radius / .44) } },
    render() {
      if (control.object && !control.object.parent) control.detach()
      canvas.dataset.transformAxis = control.axis ?? ''
      canvas.dataset.transformMode = control.mode
      const allowed = callbacks.allowed()
      control.getHelper().visible = allowed && !!control.object
      if (!allowed) control.enabled = false
      engine.renderer.autoClear = false; engine.renderer.clearDepth(); engine.renderer.render(overlay, engine.camera); engine.renderer.autoClear = true
    },
    dispose() { abort.abort(); control.dispose(); ring.geometry.dispose(); ring.material.dispose() },
  }
}
export type Gizmos = ReturnType<typeof createGizmos>
