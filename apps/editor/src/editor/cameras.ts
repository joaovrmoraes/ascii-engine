import * as THREE from 'three'
import { applySceneCamera, type AsciiEngine, type SceneCamera, type SceneDoc } from '@ascii-engine/core'

/** Camera handles belong to the editor overlay; only their poses enter SceneDoc. */
export function createSceneCameras(engine: AsciiEngine, callbacks: { viewChanged(): void; changed(): void; select(object?: THREE.Object3D): void; focus(): THREE.Vector3 }) {
  let definitions: Record<string, SceneCamera> = {}, active: string | undefined, selected: string | undefined, viewed: string | undefined
  const overlay = new THREE.Scene(), handles = new Map<string, { object: THREE.Group; camera: THREE.OrthographicCamera; helper: THREE.CameraHelper }>()
  const bar = document.createElement('div'); bar.id = 'camera-view-bar'; bar.hidden = true
  const label = document.createElement('span'), exit = document.createElement('button'); exit.textContent = 'Back to navigation'; exit.onclick = () => view(null); bar.append(label, exit)
  document.getElementById('app')!.append(bar)
  const preview = document.createElement('section'); preview.id = 'camera-preview'; preview.hidden = true; preview.setAttribute('aria-label', 'Selected camera preview')
  const previewTitle = document.createElement('strong'), previewCanvas = document.createElement('canvas'), previewOpen = document.createElement('button')
  previewOpen.textContent = 'Expand'; previewOpen.onclick = () => { if (selected) { view(selected); callbacks.select(handles.get(selected)!.object) } }
  const header = document.createElement('header'); header.append(previewTitle, previewOpen); preview.append(header, previewCanvas); document.getElementById('app')!.append(preview)
  const previewContext = previewCanvas.getContext('2d')!, savedCamera = new THREE.OrthographicCamera()
  let lastPreview = -Infinity
  const ray = new THREE.Raycaster()
  function release() {
    for (const { object, helper } of handles.values()) {
      object.traverse(node => { if (node instanceof THREE.Mesh || node instanceof THREE.LineSegments) { node.geometry.dispose(); const materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach(m => m.dispose()) } })
      helper.dispose()
    }
    handles.clear(); overlay.clear()
  }
  function refreshPose(id: string) {
    const handle = handles.get(id)!, def = definitions[id]
    handle.object.position.set(...def.position); handle.object.rotation.set(...def.rotation, 'XYZ'); handle.object.scale.setScalar(1); handle.object.name = def.name
    applySceneCamera(handle.camera, def); handle.camera.far = Math.min(def.far ?? 1000, 6); handle.camera.updateProjectionMatrix(); handle.helper.update()
  }
  function load(doc: SceneDoc) {
    release(); definitions = structuredClone(doc.cameras ?? {}); active = doc.activeCamera; selected = undefined
    if (viewed && !definitions[viewed]) viewed = undefined
    for (const [id, def] of Object.entries(definitions)) {
      const object = new THREE.Group(); object.userData.cameraId = id
      const body = new THREE.BoxGeometry(.8, .5, .4), material = new THREE.MeshBasicMaterial({ color: 0x9fcaff, transparent: true, opacity: .18, depthTest: false })
      const mesh = new THREE.Mesh(body, material); object.add(mesh)
      object.add(new THREE.LineSegments(new THREE.EdgesGeometry(body), new THREE.LineBasicMaterial({ color: 0x9fcaff, depthTest: false })))
      const lens = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(.2,.2,.4,4)), new THREE.LineBasicMaterial({ color: 0x9fcaff, depthTest: false })); lens.rotation.x = Math.PI / 2; lens.position.z = -.35; object.add(lens)
      const camera = new THREE.OrthographicCamera(), helper = new THREE.CameraHelper(camera); helper.visible = false
      helper.setColors(new THREE.Color(0x79a8cf), new THREE.Color(0x678aa4), new THREE.Color(0x91c4ef), new THREE.Color(0x678aa4), new THREE.Color(0x47627a))
      const helperMaterial = helper.material as THREE.LineBasicMaterial; helperMaterial.transparent = true; helperMaterial.opacity = .5
      // Show a short section of the view volume while editing, not a kilometre-long box.
      handles.set(id, { object, camera, helper }); overlay.add(object, helper); refreshPose(id)
      camera.far = Math.min(def.far ?? 1000, 6); camera.updateProjectionMatrix(); helper.update()
    }
    updateBar()
  }
  function updateBar() { bar.hidden = !viewed || document.body.classList.contains('effect-studio-active'); label.textContent = viewed ? `Camera · ${definitions[viewed]?.name}` : '' }
  function view(id: string | null) { if (id && !definitions[id]) throw new Error('Camera not found: ' + id); viewed = id ?? undefined; updateBar(); callbacks.viewChanged() }
  function capture(name: string): SceneCamera {
    const c = engine.camera
    return { name, projection: 'orthographic', position: c.position.toArray(), rotation: [c.rotation.x,c.rotation.y,c.rotation.z], span: (c.top - c.bottom) / (2 * c.zoom), aspect: (c.right - c.left) / (c.top - c.bottom), near: c.near, far: c.far }
  }
  function rebuildAndSelect(id: string) {
    load({ version: 1, objects: [], cameras: definitions, activeCamera: active }); selected = id; callbacks.select(handles.get(id)!.object); callbacks.changed()
  }
  function add() {
    const id = `camera-${crypto.randomUUID()}`; definitions[id] = capture(`Camera ${Object.keys(definitions).length + 1}`); active ??= id; rebuildAndSelect(id)
  }
  function syncSelected() {
    if (!selected) return
    const handle = handles.get(selected)!, def = definitions[selected], object = handle.object
    def.position = object.position.toArray(); def.rotation = [object.rotation.x,object.rotation.y,object.rotation.z]; object.scale.setScalar(1)
    applySceneCamera(handle.camera, def); handle.camera.far = Math.min(def.far ?? 1000, 6); handle.camera.updateProjectionMatrix(); handle.helper.update()
  }
  function inspector(root: HTMLElement) {
    if (!selected) return
    const id = selected, def = definitions[id]
    function input(title: string, value: string | number, change: (value: string) => void, type = 'number') {
      const row = document.createElement('label'); row.textContent = title
      const field = document.createElement('input'); field.type = type; field.value = typeof value === 'number' ? String(Number(value.toFixed(3))) : value; field.step = '.1'; field.dataset.cameraField = title; field.setAttribute('aria-label', title)
      field.onchange = () => { if (type === 'number' && !Number.isFinite(field.valueAsNumber)) return; change(field.value); refreshPose(id); callbacks.changed() }; row.append(field); root.append(row)
    }
    const hint = document.createElement('p'); hint.className = 'empty-note'; hint.textContent = 'Orthographic camera · W move, E rotate. Framing is saved with the scene.'; root.append(hint)
    input('Camera name', def.name, value => { if (value.trim()) def.name = value.trim() }, 'text')
    for (const [property, title] of [['position','Position'],['rotation','Rotation']] as const) {
      const row = document.createElement('div'); row.className = 'vector-row'; const legend = document.createElement('span'); legend.textContent = title; row.append(legend)
      for (const [i, axis] of ['x','y','z'].entries()) {
        const cell = document.createElement('label'); cell.textContent = axis.toUpperCase(); cell.className = `axis-${axis}`
        const field = document.createElement('input'); field.type = 'number'; field.step = property === 'rotation' ? '5' : '.1'; field.dataset.field = `${title} ${axis}`; field.setAttribute('aria-label', `${title} ${axis}`)
        field.value = String(Number((def[property][i] * (property === 'rotation' ? 180/Math.PI : 1)).toFixed(3)))
        field.onchange = () => { if (!Number.isFinite(field.valueAsNumber)) return; def[property][i] = field.valueAsNumber * (property === 'rotation' ? Math.PI/180 : 1); refreshPose(id); callbacks.changed() }
        cell.append(field); row.append(cell)
      }
      root.append(row)
    }
    input('Frame height (m)', def.span * 2, value => { const n = Number(value); if (n >= .02 && n <= 20000) def.span = n / 2 })
    const aspect = document.createElement('label'); aspect.textContent = 'Aspect ratio'; const select = document.createElement('select'); select.dataset.cameraField = 'Aspect ratio'; select.setAttribute('aria-label', 'Camera aspect ratio')
    select.replaceChildren(new Option(`Current (${def.aspect.toFixed(2)}:1)`, String(def.aspect)), new Option('Landscape 16:9', String(16/9)), new Option('Landscape 4:3', String(4/3)), new Option('Square 1:1', '1'), new Option('Portrait 9:16', String(9/16)))
    select.onchange = () => { def.aspect = Number(select.value); refreshPose(id); callbacks.changed() }; aspect.append(select); root.append(aspect)
    const actions = document.createElement('div'); actions.className = 'camera-actions'; root.append(actions)
    function button(title: string, key: string, action: () => void) { const b = document.createElement('button'); b.textContent = title; b.dataset.cameraAction = key; b.onclick = action; actions.append(b) }
    button(viewed === id ? 'Back to navigation' : 'View through camera', 'view', () => { view(viewed === id ? null : id); callbacks.select(handles.get(id)!.object) })
    button('Capture current framing', 'capture', () => { definitions[id] = capture(def.name); rebuildAndSelect(id) })
    button('Aim at view center', 'aim', () => { const object = handles.get(id)!.object; object.lookAt(callbacks.focus()); object.rotateY(Math.PI); syncSelected(); callbacks.changed() })
    button(active === id ? '✓ Initial camera' : 'Use as initial camera', 'activate', () => { active = id; callbacks.changed() })
    button('Duplicate camera', 'duplicate', duplicate)
    const note = document.createElement('p'); note.className = 'empty-note'; note.textContent = 'Camera view preserves the aspect ratio. Return to navigation to move objects and use the gizmo.'; root.append(note)
  }
  function duplicate() { if (!selected) return; const id = `camera-${crypto.randomUUID()}`; definitions[id] = { ...structuredClone(definitions[selected]), name: definitions[selected].name + ' copy' }; rebuildAndSelect(id) }
  function remove() { if (!selected) return; const id = selected; delete definitions[id]; if (active === id) active = undefined; if (viewed === id) viewed = undefined; load({version:1,objects:[],cameras:definitions,activeCamera:active}); callbacks.select(); callbacks.changed() }
  return {
    add, load, inspector, duplicate, remove, syncSelected, view,
    get viewed() { return viewed },
    get selected() { return selected },
    activeCamera() { return active ? definitions[active] : undefined },
    isCamera(object?: THREE.Object3D) { return !!object && handles.get(object.userData.cameraId)?.object === object },
    select(object?: THREE.Object3D) { selected = object && handles.get(object.userData.cameraId)?.object === object ? object.userData.cameraId : undefined },
    entries() { return [...handles].map(([id, handle]) => ({ id, object: handle.object, active: id === active })) },
    document(): Pick<SceneDoc, 'cameras' | 'activeCamera'> { return { cameras: Object.keys(definitions).length ? structuredClone(definitions) : undefined, activeCamera: active } },
    current() { return viewed ? definitions[viewed] : undefined },
    renderPreview(playing: boolean) {
      preview.hidden = !selected || !!viewed || playing || document.body.classList.contains('studio-mode')
      if (preview.hidden) return
      const def = definitions[selected!], now = performance.now()
      previewTitle.textContent = def.name
      // One shared renderer, at most 12 previews/sec. No second world or context.
      if (now - lastPreview < 1000 / 12) return
      lastPreview = now
      const canvas = engine.renderer.domElement, aspect = engine.size.width / engine.size.height
      savedCamera.copy(engine.camera)
      const hidden: THREE.Object3D[] = []
      for (const scene of [engine.scene, engine.particleScene]) scene.traverseVisible(node => { if (node.userData.editorOnly || node.userData.editorPreview) { hidden.push(node); node.visible = false } })
      try {
        applySceneCamera(engine.camera, def)
        // Render a larger frame with the viewport's aspect, then crop to the
        // saved frame. This preserves point glyph proportions without resizing
        // GPU buffers twice every preview or changing the editor navigation.
        const span = def.span * Math.max(1, def.aspect / aspect)
        engine.camera.top = span; engine.camera.bottom = -span; engine.camera.left = -span * aspect; engine.camera.right = span * aspect; engine.camera.updateProjectionMatrix()
        engine.render(0, { redraw: true })
        const w = Math.min(canvas.width, canvas.height * def.aspect), h = w / def.aspect
        const outputWidth = Math.min(480, 280 * def.aspect), outputHeight = outputWidth / def.aspect
        if (previewCanvas.width !== Math.round(outputWidth) || previewCanvas.height !== Math.round(outputHeight)) { previewCanvas.width = Math.round(outputWidth); previewCanvas.height = Math.round(outputHeight) }
        previewCanvas.style.aspectRatio = String(def.aspect)
        previewContext.drawImage(canvas, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h, 0, 0, previewCanvas.width, previewCanvas.height)
        previewCanvas.dataset.previewCamera = selected; previewCanvas.dataset.pose = JSON.stringify(def); previewCanvas.dataset.frame = String(now)
      } finally { engine.camera.copy(savedCamera); engine.camera.updateMatrixWorld(); for (const node of hidden) node.visible = true }
    },
    pick(event: {clientX:number;clientY:number}) {
      if (viewed) return
      const r = engine.renderer.domElement.getBoundingClientRect(); ray.setFromCamera(new THREE.Vector2((event.clientX-r.x)/r.width*2-1, -(event.clientY-r.y)/r.height*2+1), engine.camera)
      overlay.updateMatrixWorld(true)
      const hits = ray.intersectObjects([...handles.values()].map(h=>h.object), true).filter(hit=>hit.object instanceof THREE.Mesh)
      return hits[0]?.object.parent
    },
    render() {
      updateBar(); if (viewed || document.body.classList.contains('studio-mode')) return
      for (const [id, handle] of handles) handle.helper.visible = id === selected
      engine.renderer.autoClear = false; engine.renderer.clearDepth(); engine.renderer.render(overlay, engine.camera); engine.renderer.autoClear = true
    },
    dispose() { release(); bar.remove(); preview.remove() },
  }
}
