import * as THREE from 'three'
import { buildScene, createTerrainData, emptyScene, type AsciiEngine, type BuiltScene, type Brush, type SceneDoc } from '@ascii-engine/core'
import { createPrefabs } from '../scene/prefabs'
import type { Area, AreaOptions } from './types'

/**
 * Scene editor (phase 5 + §3.4): sculpt and paint a terrain with brushes, dig
 * lakes, place prefabs, regrow the grass, save/load the scene as JSON. The
 * document is kept in the browser between visits (best effort).
 */
const STORAGE = 'ascii-engine:sandbox'
type Tool = 'select' | Brush | 'lake' | 'place' | 'erase'

function defaultScene(): SceneDoc {
  const doc = emptyScene('sandbox')
  doc.terrain = createTerrainData(32, 129)
  doc.carpet = { count: 60000 }
  doc.objects.push({ prefab: 'fogueira', position: [0, 0, 0] }, { prefab: 'arvore', position: [-4, 0, -3] }, { prefab: 'pedregulho', position: [3, 0, -2] })
  return doc
}
function loadStored(): SceneDoc | undefined {
  try { const raw = localStorage.getItem(STORAGE); return raw ? JSON.parse(raw) as SceneDoc : undefined } catch { return undefined }
}

export function createSandbox(engine: AsciiEngine, _options: AreaOptions = {}): Area {
  const library = createPrefabs(engine)
  let scene: BuiltScene = buildScene(engine, loadStored() ?? defaultScene(), library)
  const tool = { kind: 'select' as Tool, radius: 2, strength: .08, layer: 1, prefab: 'arvore' }
  const focus = new THREE.Vector3(0, .8, 0)
  let note = ''
  const save = () => { try { localStorage.setItem(STORAGE, JSON.stringify(scene.toJSON())) } catch { /* private mode */ } }

  // Tool panel.
  const box = document.createElement('div'); box.id = 'tools'; document.body.appendChild(box)
  const brushes: [Tool, string][] = [['select', 'selecionar parte'], ['raise', 'esculpir +'], ['lower', 'esculpir −'], ['smooth', 'suavizar'], ['flatten', 'aplainar'], ['paint', 'pintar chão'], ['lake', 'cavar lago'], ['place', 'pôr objeto'], ['erase', 'apagar objeto']]
  box.innerHTML = `
    <div class="title">cenário</div>
    <label>ferramenta <select data-k="tool">${brushes.map(([k, t]) => `<option value="${k}">${t}</option>`).join('')}</select></label>
    <label>raio <input data-k="radius" type="range" min=".5" max="6" step=".25"></label>
    <label>força <input data-k="strength" type="range" min=".01" max=".4" step=".01"></label>
    <label>chão <select data-k="layer">${scene.terrain!.data.layers.map((l, i) => `<option value="${i}">${l.name}</option>`).join('')}</select></label>
    <label>objeto <select data-k="prefab">${Object.entries(library).map(([k, p]) => `<option value="${k}">${p.title}</option>`).join('')}</select></label>
    <button data-k="grow">[ regerar grama ]</button>
    <button data-k="save">[ salvar cenário .json ]</button>
    <label class="file">[ abrir cenário .json ]<input data-k="open" type="file" accept=".json" hidden></label>
    <button data-k="new">[ novo cenário ]</button>`
  const el = <T extends HTMLElement>(k: string) => box.querySelector<T>(`[data-k="${k}"]`)!
  const bind = (k: 'radius' | 'strength') => { const i = el<HTMLInputElement>(k); i.value = String(tool[k]); i.oninput = () => { tool[k] = Number(i.value) } }
  bind('radius'); bind('strength')
  el<HTMLSelectElement>('tool').onchange = (e) => { tool.kind = (e.target as HTMLSelectElement).value as Tool; document.getElementById('selection')!.hidden = true }
  el<HTMLSelectElement>('layer').onchange = (e) => { tool.layer = Number((e.target as HTMLSelectElement).value) }
  el<HTMLSelectElement>('prefab').onchange = (e) => { tool.prefab = (e.target as HTMLSelectElement).value }
  el<HTMLButtonElement>('grow').onclick = () => { scene.regrow(); save() }
  el<HTMLButtonElement>('save').onclick = () => {
    const blob = new Blob([JSON.stringify(scene.toJSON())], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cenario.json'; a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  const reload = (doc: SceneDoc) => { scene.dispose(); scene = buildScene(engine, doc, library); save() }
  const opener = el<HTMLInputElement>('open')
  opener.onchange = async () => {
    const file = opener.files?.[0]; opener.value = ''
    if (file) try { reload(JSON.parse(await file.text())) } catch (error) { note = `cenário inválido: ${error}` }
  }
  el<HTMLButtonElement>('new').onclick = () => reload(defaultScene())

  // Brushes act while the button is held; the camera only turns with "selecionar".
  const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2()
  const canvas = engine.renderer.domElement
  let painting = false
  function groundPoint(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    ndc.set((e.clientX - rect.left) / rect.width * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(ndc, engine.camera)
    return raycaster.intersectObject(scene.terrain!.mesh, false)[0]?.point
  }
  function act(e: PointerEvent, first: boolean) {
    const p = groundPoint(e)
    if (!p || !scene.terrain) return
    const kind = tool.kind
    if (kind === 'place' && first) scene.place({ prefab: tool.prefab, position: [p.x, scene.terrain.heightAt(p.x, p.z), p.z], rotation: Math.random() * Math.PI * 2 })
    else if (kind === 'erase' && first) {
      const hit = engine.pick(ndc.x, ndc.y)
      let node: THREE.Object3D | null | undefined = hit?.object
      while (node && !node.userData.prefab) node = node.parent
      if (node) scene.remove(node)
    } else if (kind === 'lake' && first) {
      const level = scene.terrain.heightAt(p.x, p.z) - .05
      scene.terrain.apply({ brush: 'dig', x: p.x, z: p.z, radius: tool.radius * 1.3, strength: .6 })
      scene.terrain.apply({ brush: 'paint', x: p.x, z: p.z, radius: tool.radius * 1.5, strength: 1, layer: 1 })
      scene.addWater({ shape: { kind: 'pond', x: p.x, z: p.z, angle: Math.random() * 6, size: tool.radius }, level })
    } else if (kind !== 'place' && kind !== 'erase' && kind !== 'lake' && kind !== 'select') {
      scene.terrain.apply({ brush: kind, x: p.x, z: p.z, radius: tool.radius, strength: kind === 'paint' ? tool.strength * 4 : tool.strength, layer: tool.layer })
    }
    // Objects follow the ground they stand on.
    if (kind !== 'paint') for (const placed of scene.placed) {
      const o = placed.object
      o.position.y = scene.terrain.heightAt(o.position.x, o.position.z); placed.doc.position = [o.position.x, o.position.y, o.position.z]
    }
  }
  addEventListener('pointerdown', (e) => {
    if (tool.kind === 'select' || e.target !== canvas || e.button !== 0) return
    e.stopPropagation(); painting = true; act(e, true)
  }, true)
  addEventListener('pointermove', (e) => { if (painting) { e.stopPropagation(); act(e, false) } }, true)
  addEventListener('pointerup', (e) => { if (painting) { e.stopPropagation(); painting = false; save() } }, true)

  return {
    id: 'sandbox', title: 'Cenário (terreno e prefabs)',
    hero: new THREE.Vector3(100, 0, 100),
    get state() { return `${scene.placed.length} objetos · ${scene.waters.length} águas · ${tool.kind}${note ? ` · ${note}` : ''}` },
    focus: (_angle, target) => target.copy(focus),
    update(time) { scene.update(time) },
    dispose() { scene.dispose(); box.remove() },
  }
}
