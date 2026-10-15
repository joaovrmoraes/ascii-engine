import * as THREE from 'three'
import { forestFloorMaterial, forestMeadowCover } from '@ascii-engine/core/pomorog'
import {
  gifToFlipbook,
  spriteSheetToFlipbook,
  videoToFlipbook,
  type AsciiEngine,
  type EffectDef,
  type EffectInstance,
  type FlipbookData,
} from '@ascii-engine/core'
import type { Area, AreaOptions } from './types'
import { effectName } from '../editor/names'

/**
 * Effect editor (phase 6): live preview in a loop, JSON editing of the
 * selected effect, budget (letters/effects/emitters alive), ASCII flipbooks
 * from a sprite sheet, a GIF or a video, and saving effects as JSON. A
 * marker walking in a circle shows effects attached to a moving object.
 */
export function createEffectsArea(engine: AsciiEngine, _options: AreaOptions = {}): Area {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), forestFloorMaterial())
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.07
  floor.receiveShadow = true
  engine.add(floor, { type: 'ground' })
  const carpet = engine.createCarpet(forestMeadowCover({ count: 30000, extent: 18 }))
  engine.add(carpet.mesh, { glyph: 'carpet' })
  const marker = new THREE.Group()
  marker.name = 'target'
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.2, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x8a7a60, roughness: 1, flatShading: true }),
  )
  post.position.y = 0.6
  marker.add(post)
  engine.add(marker, { glyph: 'surface', surface: 'wood' })
  const fx = engine.fx
  let current: EffectInstance | undefined,
    selected = 'fogueira',
    note = '',
    follow = false

  const box = document.createElement('div')
  box.id = 'tools'
  document.body.appendChild(box)
  const list = () =>
    [...fx.library.keys()]
      .map(
        k => `<option value="${k}"${k === selected ? ' selected' : ''}>${effectName(k)}</option>`,
      )
      .join('')
  box.innerHTML = `
    <div class="title">effects</div>
    <label>effect <select data-k="name">${list()}</select></label>
    <label>attached to target <input data-k="follow" type="checkbox"></label>
    <button data-k="play">[ play in loop ]</button>
    <button data-k="once">[ play once ]</button>
    <button data-k="stop">[ stop ]</button>
    <textarea data-k="json" rows="14" spellcheck="false"></textarea>
    <button data-k="apply">[ apply JSON ]</button>
    <button data-k="save">[ save effect .json ]</button>
    <label class="file">[ flipbook: image/GIF/video ]<input data-k="flip" type="file" accept="image/*,video/*" hidden></label>
    <div data-k="stats"></div>`
  const el = <T extends HTMLElement>(k: string) => box.querySelector<T>(`[data-k="${k}"]`)!
  const json = el<HTMLTextAreaElement>('json')
  const show = () => {
    json.value = JSON.stringify(fx.library.get(selected), null, 1)
  }
  const play = (loop: boolean) => {
    current?.stop()
    current = fx.play(selected, follow ? marker : new THREE.Vector3(0, 0, 0), { loop })
  }
  el<HTMLSelectElement>('name').onchange = e => {
    selected = (e.target as HTMLSelectElement).value
    show()
    play(true)
  }
  el<HTMLInputElement>('follow').onchange = e => {
    follow = (e.target as HTMLInputElement).checked
    play(true)
  }
  el<HTMLButtonElement>('play').onclick = () => play(true)
  el<HTMLButtonElement>('once').onclick = () => play(false)
  el<HTMLButtonElement>('stop').onclick = () => fx.stopAll()
  el<HTMLButtonElement>('apply').onclick = () => {
    try {
      const def = JSON.parse(json.value) as EffectDef
      fx.register(def)
      selected = def.name
      el<HTMLSelectElement>('name').innerHTML = list()
      play(true)
      note = ''
    } catch (error) {
      note = `Invalid JSON: ${error}`
    }
  }
  el<HTMLButtonElement>('save').onclick = () => {
    const blob = new Blob([json.value], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${selected}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  const picker = el<HTMLInputElement>('flip')
  picker.onchange = async () => {
    const file = picker.files?.[0]
    picker.value = ''
    if (!file) return
    note = `converting ${file.name}…`
    try {
      const conversion = { cols: 28, rows: 18, gain: 1.15 }
      let book: FlipbookData
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video')
        video.muted = true
        video.src = URL.createObjectURL(file)
        book = await videoToFlipbook(video, { ...conversion, fps: 12, maxFrames: 60 })
      } else if (
        file.type === 'image/gif' ||
        file.type === 'image/webp' ||
        file.type === 'image/apng'
      ) {
        book = await gifToFlipbook(await file.arrayBuffer(), file.type, {
          ...conversion,
          maxFrames: 60,
        })
      } else {
        // A still image or a sprite sheet: frames across = width / height (square frames).
        const image = await createImageBitmap(file)
        const across = Math.max(1, Math.round(image.width / image.height))
        book = spriteSheetToFlipbook(image, across, 1, { ...conversion, fps: 10 })
      }
      const name = `flipbook-${file.name.replace(/\.[^.]+$/, '')}`
      fx.register({
        name,
        duration: book.frames.length / book.fps,
        loop: true,
        emitters: [
          { render: 'flipbook', flipbook: { ...book, cell: 0.14 }, size: 0.2, color: [1, 1, 1] },
        ],
      })
      selected = name
      el<HTMLSelectElement>('name').innerHTML = list()
      show()
      play(true)
      note = `${name}: ${book.frames.length} frames`
    } catch (error) {
      note = `flipbook error: ${error}`
    }
  }
  show()
  play(true)

  return {
    id: 'effects',
    title: 'Effects (sistema §3.3)',
    hero: new THREE.Vector3(100, 0, 100),
    get state() {
      const s = fx.stats
      return `${effectName(selected)} · glyphs ${s.letters}/${s.budget} · effects ${s.effects} · emitters ${s.emitters}${note ? ` · ${note}` : ''}`
    },
    focus: (_angle, target) => target.set(0, 1, 0),
    update(time) {
      // The target walks a circle so attached effects (rastro) show their path.
      marker.position.set(Math.cos(time * 0.8) * 2.5, 0, Math.sin(time * 0.8) * 2.5)
      el<HTMLDivElement>('stats').textContent = this.state
    },
    dispose() {
      box.remove()
    },
  }
}
