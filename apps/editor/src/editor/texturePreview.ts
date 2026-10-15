import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  atmosphereStyle,
  linkTexture,
  buildScene,
  createEffectPrefabs,
  loadSceneAssets,
  type AddOptions,
  type AsciiStyle,
  type AtmosphereStyle,
  type BuiltScene,
  type GlyphStyle,
  type SceneDoc,
} from '@ascii-engine/core'
import { createAsciiEngine } from '../engine'
import { createPrefabs } from '../scene/prefabs'
import type { TextureScope } from './textures'

/** Owns its engine and model resources; the map stays paused during editing. */
export function createTexturePreview(selectPart: (part: string) => void) {
  const root = document.createElement('section')
  root.id = 'texture-preview'
  root.hidden = true
  root.setAttribute('aria-label', 'Isolated texture preview')
  root.innerHTML = `<canvas aria-label="Texture on selected object"></canvas><div class="fx-preview-title"><strong>Texture preview</strong><span>Select an object</span></div>
    <p class="fx-preview-hint">Drag to orbit · right drag to pan · scroll to zoom · click a part to edit</p>
    <div class="fx-playback"><button data-texture-preview="frame">Frame object</button><button data-texture-preview="pause">Pause motion</button></div>`
  document.getElementById('app')!.append(root)
  let canvas = root.querySelector('canvas')!,
    engine: ReturnType<typeof createAsciiEngine> | undefined
  let scene: BuiltScene | undefined,
    assets: Awaited<ReturnType<typeof loadSceneAssets>> | undefined,
    controls: OrbitControls | undefined
  let baseline: AddOptions = {},
    span = 2,
    version = 0,
    paused = false,
    part = '',
    style: GlyphStyle = {}
  let lighting: AtmosphereStyle | undefined,
    baseLighting: AtmosphereStyle = {}
  let appliedSignature = ''
  let scope: TextureScope = 'object',
    sourceStyle: Partial<AsciiStyle> | undefined
  const title = root.querySelector('span')!,
    abort = new AbortController()
  function ensure() {
    if (engine) return
    engine = createAsciiEngine(canvas, { maxPixelRatio: 1.5 })
    controls = new OrbitControls(engine.camera, canvas)
    controls.enableDamping = false
    controls.minZoom = 0.15
    controls.maxZoom = 12
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    }
    let x = 0,
      y = 0
    canvas.addEventListener('pointerdown', e => {
      x = e.clientX
      y = e.clientY
    })
    canvas.addEventListener('pointerup', e => {
      if (e.button !== 0 || Math.hypot(e.clientX - x, e.clientY - y) > 5 || !engine) return
      const rect = canvas.getBoundingClientRect(),
        hit = engine.pick(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          1 - ((e.clientY - rect.top) / rect.height) * 2,
        )
      if (hit?.part) selectPart(hit.part)
    })
  }
  function fit() {
    if (!engine || !controls || !scene?.placed[0]) return
    const bounds = new THREE.Box3().setFromObject(scene.placed[0].object),
      center = bounds.getCenter(new THREE.Vector3())
    engine.resize()
    engine.frame(center, 1, Math.PI / 7)
    const aspect = engine.size.width / engine.size.height
    span = 0.6
    for (const x of [bounds.min.x, bounds.max.x])
      for (const y of [bounds.min.y, bounds.max.y])
        for (const z of [bounds.min.z, bounds.max.z]) {
          const view = new THREE.Vector3(x, y, z).applyMatrix4(engine.camera.matrixWorldInverse)
          span = Math.max(span, Math.abs(view.y) * 1.25, (Math.abs(view.x) / aspect) * 1.25)
        }
    engine.camera.zoom = 1
    controls.target.copy(center)
    engine.frame(center, span, Math.PI / 7)
    controls.update()
  }
  function apply(
    nextPart: string,
    nextStyle: GlyphStyle,
    nextScope: TextureScope = nextPart ? 'part' : 'object',
    textureId?: string,
  ) {
    part = nextPart
    style = structuredClone(nextStyle)
    scope = nextScope
    const object = scene?.placed[0]?.object
    if (!object || !engine) return
    const signature = JSON.stringify([
      part,
      scope,
      textureId,
      Object.entries(style).map(([key, value]) => [
        key,
        value === undefined ? { unset: true } : value,
      ]),
    ])
    if (signature === appliedSignature) return
    // Re-add from its saved options so resetting a field or changing parts
    // cannot leave an earlier preview edit on the model.
    engine.remove(object)
    if (sourceStyle)
      engine.setStyle(
        {
          ...engine.exportStyle(),
          glyphs: structuredClone(sourceStyle.glyphs ?? {}),
          types: structuredClone(sourceStyle.types ?? {}),
        },
        { replace: true },
      )
    if (scope === 'global') engine.setStyle({ glyphs: { ...engine.style.glyphs, ...style } })
    else if (scope === 'type') {
      const type = baseline.type ?? object.userData.prefab
      const fields = Object.keys(style) as (keyof GlyphStyle)[]
      engine.setTypeStyle(
        type,
        part
          ? { parts: { [part]: style }, authored: { parts: { [part]: fields } } }
          : { style, authored: { style: fields } },
      )
    }
    if (textureId)
      engine.setTextures({ ...engine.textures, [textureId]: { name: 'Preview', style } })
    const options = textureId
      ? linkTexture(baseline, engine.textures, textureId, scope === 'part' ? part : undefined)
          .options
      : structuredClone(baseline)
    engine.add(object, {
      ...options,
      ...(scope === 'type' ? { type: baseline.type ?? object.userData.prefab } : {}),
    })
    if (!textureId && scope === 'part' && part) engine.setPartStyle(object, part, style)
    else if (!textureId && scope === 'object') engine.setInstanceStyle(object, style)
    appliedSignature = signature
    canvas.dataset.part = part
    canvas.dataset.style = JSON.stringify(style)
    canvas.dataset.options = JSON.stringify(engine.instanceStyle(object))
  }
  root.querySelector<HTMLButtonElement>('[data-texture-preview="frame"]')!.onclick = fit
  root.querySelector<HTMLButtonElement>('[data-texture-preview="pause"]')!.onclick = event => {
    paused = !paused
    ;(event.target as HTMLElement).textContent = paused ? 'Resume motion' : 'Pause motion'
  }
  root.addEventListener('contextmenu', event => event.preventDefault(), { signal: abort.signal })
  function setLighting(next?: AtmosphereStyle) {
    lighting = next ? structuredClone(next) : undefined
    if (engine && scene) engine.setStyle({ ...baseLighting, ...lighting })
    canvas.dataset.lighting = JSON.stringify(lighting ?? baseLighting)
  }
  return {
    async show(doc: SceneDoc, id?: string) {
      const request = ++version
      root.hidden = false
      document.body.classList.add('texture-studio-active')
      ensure()
      scene?.dispose()
      scene = undefined
      assets?.dispose()
      assets = undefined
      appliedSignature = ''
      delete canvas.dataset.ready
      delete canvas.dataset.error
      const item = doc.objects.find(object => object.id === id)
      if (!item) {
        title.textContent = 'Select an object in the Texture studio'
        return
      }
      title.textContent = `Loading ${item.name ?? item.prefab}…`
      try {
        const source: SceneDoc = {
          version: 1,
          style: doc.style,
          objects: [{ ...item, visible: true, position: [0, 0, 0] }],
          assets: doc.assets?.[item.prefab]
            ? { [item.prefab]: doc.assets[item.prefab] }
            : undefined,
          effects: doc.effects,
          textures: doc.textures,
        }
        const loaded = await loadSceneAssets(source)
        if (request !== version || root.hidden) {
          loaded.dispose()
          return
        }
        assets = loaded
        scene = buildScene(engine!, source, {
          ...createPrefabs(engine!),
          ...loaded.library,
          ...createEffectPrefabs(engine!, source.effects),
        })
        baseline = structuredClone(engine!.instanceStyle(scene.placed[0].object) ?? {})
        sourceStyle = engine!.exportStyle()
        baseLighting = atmosphereStyle(engine!.exportStyle())
        setLighting(lighting)
        apply(part, style, scope)
        fit()
        title.textContent = item.name ?? item.prefab
        canvas.dataset.ready = id
      } catch (error) {
        if (request === version) {
          title.textContent = String(error)
          canvas.dataset.error = String(error)
        }
      }
    },
    apply,
    setLighting,
    commit() {
      const object = scene?.placed[0]?.object
      if (object && engine) {
        baseline = structuredClone(engine.instanceStyle(object) ?? {})
        sourceStyle = engine.exportStyle()
      }
    },
    frame(dt: number) {
      if (root.hidden || !engine) return false
      if (engine.size.width !== canvas.clientWidth || engine.size.height !== canvas.clientHeight) {
        engine.resize()
        const aspect = engine.size.width / engine.size.height
        Object.assign(engine.camera, {
          left: -span * aspect,
          right: span * aspect,
          top: span,
          bottom: -span,
        })
        engine.camera.updateProjectionMatrix()
      }
      const step = paused ? 0 : Math.min(0.04, Math.max(0, dt))
      scene?.update(engine.time + step)
      engine.render(step)
      return true
    },
    capture() {
      if (root.hidden || !engine) return
      engine.render(0)
      return canvas.toDataURL('image/png').split(',')[1]
    },
    hide() {
      ++version
      root.hidden = true
      document.body.classList.remove('texture-studio-active')
      controls?.dispose()
      controls = undefined
      scene?.dispose()
      scene = undefined
      assets?.dispose()
      assets = undefined
      engine?.dispose()
      engine?.renderer.forceContextLoss()
      engine = undefined
      const fresh = canvas.cloneNode(false) as HTMLCanvasElement
      canvas.replaceWith(fresh)
      canvas = fresh
    },
    dispose() {
      this.hide()
      abort.abort()
      root.remove()
    },
  }
}
