import { POMOROG_EFFECTS, parseEffect, createHistory, type EffectDef, type EmitterDef } from '@ascii-engine/core'
import { createEffectPreview } from './effectPreview'
import { effectName } from './names'

const newEmitter = (): EmitterDef => ({ name: 'Particles', render: 'particle', shape: { kind: 'sphere', radius: .3 }, rate: 24, life: [1, 2], velocity: [0, 1, 0], size: .18, glyphs: '*+:.', color: [1, .75, .3], alpha: [{ t: 0, v: 1 }, { t: 1, v: 0 }], max: 1000 })
const layerName = (e: EmitterDef) => ({ heat: 'Flame', ring: 'Ring', beam: 'Beam', ribbon: 'Trail', decal: 'Decal', flipbook: 'Frames', particle: 'Particles' }[e.render ?? 'particle'])
const fresh = (): EffectDef => ({ name: 'My effect', duration: 3, loop: true, emitters: [newEmitter()] })

/** Form authoring over the existing effect runtime; JSON remains an advanced option. */
export function createEffectEditor(root: HTMLElement, callbacks: {
  definitions(): Record<string, EffectDef>
  save(key: string, definition: EffectDef): Promise<void>
  place(key: string): void
  reveal(): void
}) {
  let draft = fresh(), selectedKey: string | undefined, emitter = 0, active = false, saving = false, dirty = false
  const abort = new AbortController(), history = createHistory(draft, 60), stage = createEffectPreview({
    move(offset, commit) {
      const layer = draft.emitters[emitter]; if (!layer) return
      layer.offset = offset; edited(commit)
      root.querySelectorAll<HTMLInputElement>('[data-effect-offset]').forEach(input => input.value = offset[Number(input.dataset.effectOffset)].toFixed(2))
    },
  })
  let editingMode = 'simple'
  root.innerHTML = `<div class="fx-heading"><h2>Create effect</h2><p>Choose a preset, adjust it and save to Assets.</p></div>
  <div class="fx-templates" aria-label="Effect templates"></div>
  <div class="fx-toolbar"><select data-fx="source" aria-label="Effect preset"></select><button data-fx="new">Start from scratch</button></div>
  <label class="fx-name">Effect name<input data-fx="name" aria-label="Effect name" placeholder="Effect name"></label>
  <div class="fx-mode" role="group" aria-label="Control complexity"><button data-fx-mode="simple" aria-pressed="true">Basic</button><button data-fx-mode="advanced" aria-pressed="false">Advanced</button><button data-fx="undo" title="Undo effect edit (Ctrl Z)">↶</button><button data-fx="redo" title="Redo effect edit (Ctrl Shift Z)">↷</button></div>
  <div class="fx-general"></div><div class="fx-status" role="status"></div>
  <div class="fx-body"><div class="fx-layers-heading">Effect layers <small>Select the layer to adjust</small></div><div class="fx-emitter-list"></div><div class="fx-position"></div><div class="fx-quick"></div><div class="fx-fields"></div></div>
  <details class="fx-advanced"><summary>JSON definition</summary><textarea data-fx="json" spellcheck="false" aria-label="Effect JSON definition"></textarea><button data-fx="apply">Apply JSON</button></details>
  <details class="fx-files"><summary>Import or download file</summary><button data-fx="export">Download effect</button><label class="file">Open effect<input data-fx="import" type="file" accept=".json" hidden></label></details>
  <footer class="studio-save"><span data-fx="saved-note">Not yet saved to Assets</span><div><button data-fx="save" class="primary">Save to Assets</button><button data-fx="place">Save and place in scene</button><button data-fx="reveal">Show in Assets</button></div></footer>`
  root.dataset.effectMode = editingMode
  const preset = (name: string) => {
    const definition = structuredClone(POMOROG_EFFECTS.find(def => def.name === name)!)
    if (name === 'fogueira') definition.emitters.forEach((e, i) => e.name = ['Flame', 'Embers', 'Sparks', 'Smoke'][i])
    return definition
  }
  const templates = [
    { id: 'fire', name: 'Fire', symbol: '@', detail: 'Flame, embers and sparks', color: '#f0b669', make: () => ({ ...preset('fogueira'), name: 'My fire' }) },
    { id: 'smoke', name: 'Smoke', symbol: '~', detail: 'Rises and disperses', color: '#b5c3cc', make: () => ({ name: 'My smoke', duration: 4, loop: true, emitters: [preset('fogueira').emitters[3]] }) },
    { id: 'sparks', name: 'Sparks', symbol: '*', detail: 'Small rising embers', color: '#e6c885', make: () => ({ name: 'My sparks', duration: 4, loop: true, emitters: [preset('fogueira').emitters[2]] }) },
    { id: 'magic', name: 'Magic', symbol: 'o', detail: 'Aura and surrounding light', color: '#cab2ee', make: () => ({ ...preset('aura'), name: 'My magic' }) },
    { id: 'explosion', name: 'Explosion', symbol: '#', detail: 'Impact and expansion', color: '#ec9471', make: () => ({ ...preset('explosao-de-fogo'), name: 'My explosion' }) },
    { id: 'lightning', name: 'Lightning', symbol: '|', detail: 'Beam with impact', color: '#a7c6ff', make: () => ({ ...preset('raio'), name: 'My lightning' }) },
  ]
  for (const template of templates) {
    const button = document.createElement('button'); button.dataset.effectTemplate = template.id; button.style.setProperty('--template-color', template.color)
    button.innerHTML = `<b>${template.symbol}</b><strong>${template.name}</strong><small>${template.detail}</small>`
    button.onclick = () => { stop(); draft = parseEffect(template.make()); selectedKey = undefined; emitter = 0; dirty = true; history.reset(draft); refreshSources(); render(); if (active) play(true) }
    root.querySelector('.fx-templates')!.append(button)
  }
  root.querySelectorAll<HTMLButtonElement>('[data-fx-mode]').forEach(button => { button.onclick = () => { editingMode = button.dataset.fxMode!; root.dataset.effectMode = editingMode; root.querySelectorAll('[data-fx-mode]').forEach(el => el.setAttribute('aria-pressed', String((el as HTMLElement).dataset.fxMode === editingMode))); render() } })
  const get = <T extends HTMLElement = HTMLElement>(key: string) => root.querySelector<T>(`[data-fx="${key}"]`)!
  const status = (message: string) => { root.querySelector('.fx-status')!.textContent = message }
  const savedNote = () => { get<HTMLButtonElement>('reveal').disabled = !selectedKey; get('saved-note').textContent = dirty || !selectedKey ? 'Changes not yet saved to Assets' : 'Saved in Assets → Effects' }
  function stop() { stage.stop() }
  function play(reframe = false) {
    try { stage.play(parseEffect(draft), reframe); status('Isolated preview · adjustments appear automatically.') }
    catch (error) { status(String(error)) }
  }
  function edited(commit = true) { if (commit) history.commit(draft); refreshUndo(); dirty = true; savedNote(); get<HTMLTextAreaElement>('json').value = JSON.stringify(draft, null, 2); if (active) play() }
  function refreshUndo() { get<HTMLButtonElement>('undo').disabled = !history.canUndo; get<HTMLButtonElement>('redo').disabled = !history.canRedo }
  function undo(redo = false) { draft = redo ? history.redo() : history.undo(); emitter = Math.min(emitter, Math.max(0, draft.emitters.length - 1)); dirty = true; render(); if (active) play() }
  get('undo').onclick = () => undo(); get('redo').onclick = () => undo(true)
  addEventListener('keydown', event => {
    if (!active || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'z' || (event.target instanceof HTMLElement && event.target.matches('input,textarea'))) return
    event.preventDefault(); event.stopImmediatePropagation(); undo(event.shiftKey)
  }, { signal: abort.signal })
  function refreshSources() {
    const select = get<HTMLSelectElement>('source'); select.replaceChildren(new Option('Choose a preset or saved effect…', ''))
    const saved = document.createElement('optgroup'); saved.label = 'In this document'
    for (const [key, def] of Object.entries(callbacks.definitions())) saved.append(new Option(effectName(def.name), key))
    const templates = document.createElement('optgroup'); templates.label = 'Pomorog presets'
    for (const def of POMOROG_EFFECTS) templates.append(new Option(effectName(def.name), `preset:${def.name}`))
    select.append(saved, templates); select.value = selectedKey ?? ''
  }
  function render() {
    savedNote(); refreshUndo(); stage.selectEmitter(emitter)
    get<HTMLInputElement>('name').value = draft.name
    get<HTMLTextAreaElement>('json').value = JSON.stringify(draft, null, 2)
    const list = root.querySelector('.fx-emitter-list')!, fields = root.querySelector('.fx-fields')!
    list.replaceChildren(); fields.replaceChildren()
    draft.emitters.forEach((_, i) => { const button = document.createElement('button'); button.textContent = draft.emitters[i].name || `${layerName(draft.emitters[i])} ${i + 1}`; button.classList.toggle('active', i === emitter); button.onclick = () => { emitter = i; render() }; list.append(button) })
    for (const [title, action] of [
      ['+ Layer', () => { if (draft.emitters.length >= 32) return; draft.emitters.push(newEmitter()); emitter = draft.emitters.length - 1 }],
      ['Duplicate layer', () => { if (draft.emitters.length >= 32 || !draft.emitters[emitter]) return; draft.emitters.push({ ...structuredClone(draft.emitters[emitter]), name: (draft.emitters[emitter].name ?? layerName(draft.emitters[emitter])) + ' copy' }); emitter = draft.emitters.length - 1 }],
      ['Delete layer', () => { draft.emitters.splice(emitter, 1); emitter = Math.max(0, emitter - 1) }],
    ] as const) { const button = document.createElement('button'); button.textContent = title; button.onclick = () => { action(); edited(); render() }; list.append(button) }
    function group(title: string) { const box = document.createElement('fieldset'), legend = document.createElement('legend'); legend.textContent = title; box.append(legend); fields.append(box); return box }
    function field(box: HTMLElement, label: string, value: string | number | boolean, change: (value: string) => void, type = 'number', min = 0, max = 10000) {
      const row = document.createElement('label'); row.textContent = label
      const input = document.createElement('input'); input.type = type; input.dataset.effectField = label; input.setAttribute('aria-label', label)
      input.value = String(value); input.checked = !!value; input.step = '.05'; input.min = String(min); input.max = String(max)
      input.onchange = () => {
        if (type === 'number' && (!Number.isFinite(input.valueAsNumber) || input.valueAsNumber < min || input.valueAsNumber > max)) { render(); return }
        change(type === 'checkbox' ? String(input.checked) : input.value); edited()
      }
      row.append(input); box.append(row)
    }
    function select(box: HTMLElement, label: string, value: string, options: [string,string][], change: (value: string) => void) {
      const row = document.createElement('label'); row.textContent = label; const input = document.createElement('select'); input.setAttribute('aria-label', label); input.dataset.effectField = label
      input.replaceChildren(...options.map(([key,title]) => new Option(title,key))); input.value = value
      input.onchange = () => { change(input.value); edited(); render() }; row.append(input); box.append(row)
    }
    const general = root.querySelector<HTMLElement>('.fx-general')!; general.replaceChildren()
    field(general, 'Duration (s)', draft.duration, v => draft.duration = Number(v), 'number', .01, 3600)
    field(general, 'Loop', !!draft.loop, v => draft.loop = v === 'true', 'checkbox')
    field(general, 'Emit light', !!draft.light, v => { draft.light = v === 'true' ? { color: 0xffac55, intensity: 14, distance: 7, offset: [0,1,0], flicker: .12 } : undefined; render() }, 'checkbox')
    if (draft.light) {
      field(general, 'Light color', '#' + draft.light.color.toString(16).padStart(6, '0'), v => draft.light!.color = parseInt(v.slice(1), 16), 'color')
      field(general, 'Intensity', draft.light.intensity, v => draft.light!.intensity = Number(v), 'number', 0, 100)
      field(general, 'Range (m)', draft.light.distance ?? 6, v => draft.light!.distance = Number(v), 'number', .1, 100)
      field(general, 'Light height', draft.light.offset?.[1] ?? 1, v => { draft.light!.offset ??= [0,1,0]; draft.light!.offset[1] = Number(v) }, 'number', -100, 100)
    }
    const quick = root.querySelector<HTMLElement>('.fx-quick')!; quick.replaceChildren()
    const position = root.querySelector<HTMLElement>('.fx-position')!; position.replaceChildren()
    const e = draft.emitters[emitter]; if (!e) { quick.textContent = 'Add a layer to get started.'; return }
    field(position, 'Layer name', e.name ?? layerName(e), value => { e.name = value; render() }, 'text')
    const axes = document.createElement('div'); axes.className = 'vector-row'; axes.innerHTML = '<span>Origin</span>'
    for (const [i, axis] of ['X','Y','Z'].entries()) {
      const row = document.createElement('label'); row.textContent = axis; row.className = `axis-${axis.toLowerCase()}`
      const input = document.createElement('input'); input.type = 'number'; input.step = '.1'; input.value = String(Number((e.offset?.[i] ?? 0).toFixed(3))); input.dataset.effectOffset = String(i); input.setAttribute('aria-label', `Origin ${axis}`)
      input.onchange = () => { if (!Number.isFinite(input.valueAsNumber)) return; e.offset ??= [0,0,0]; e.offset[i] = input.valueAsNumber; edited() }
      row.append(input); axes.append(row)
    }
    position.append(axes)
    const reset = document.createElement('button'); reset.textContent = 'Reset position'; reset.onclick = () => { e.offset = [0,0,0]; edited(); render() }; position.append(reset)
    const hint = document.createElement('p'); hint.className = 'empty-note'
    hint.textContent = e.render === 'heat' ? 'Heat-grid flame. Adjust glyphs here; sparks and smoke have their own layers.' : e.render === 'beam' ? 'The beam connects the origin to the target. Size and color define its appearance; adjust the target under Advanced.' : 'Adjust controls to preview the result. Advanced shows each layer\'s shape, direction and details.'
    quick.append(hint)
    function slider(label: string, value: number, min: number, max: number, step: number, update: (value: number) => void, unit = '') {
      const row = document.createElement('label'); row.className = 'fx-slider'; row.textContent = label
      const input = document.createElement('input'), output = document.createElement('output'); input.type = 'range'; input.min = String(min); input.max = String(Math.max(max, value)); input.step = String(step); input.value = String(value); input.dataset.quick = label; input.setAttribute('aria-label', label)
      const display = () => output.textContent = `${Number(input.value).toLocaleString('en-US', { maximumFractionDigits: 2 })}${unit}`
      input.oninput = () => { update(input.valueAsNumber); display(); edited(false) }; input.onchange = () => edited(); display(); row.append(input,output); quick.append(row)
    }
    if (e.render === 'heat') {
      slider('Glyph size', e.heat?.letter ?? .18, .08, .6, .01, value => { e.heat = { ...e.heat, letter: value } }, ' m')
    } else {
      const burst = !!e.bursts?.length && !(e.rate ?? 0), staticKind = ['beam','ribbon','flipbook'].includes(e.render ?? '')
      if (!staticKind) slider(burst ? 'Count per burst' : 'Count per second', burst ? e.bursts![0].count : e.rate ?? 0, 1, 120, 1, value => { if (burst) e.bursts![0].count = value; else e.rate = value })
      const size = typeof e.size === 'number' ? e.size : Array.isArray(e.size) ? typeof e.size[0] === 'number' ? e.size[0] : e.size[0]?.v ?? .18 : .18
      slider('Glyph size', size, .08, .65, .01, value => { const ratio = value / Math.max(.001, typeof e.size === 'number' ? e.size : Array.isArray(e.size) ? typeof e.size[0] === 'number' ? e.size[0] : e.size[0]?.v ?? .18 : .18); e.size = typeof e.size === 'number' || !e.size ? value : typeof e.size[0] === 'number' ? (e.size as [number,number]).map(n => n * ratio) as [number,number] : (e.size as {t:number;v:number}[]).map(p => ({ ...p, v: p.v * ratio })) }, ' m')
      if (!staticKind && e.render !== 'ring') {
        slider('Lifetime', typeof e.life === 'number' ? e.life : e.life?.[1] ?? 1, .1, 8, .1, value => { e.life = value }, ' s')
        slider('Rise / fall', e.velocity?.[1] ?? 0, -3, 5, .1, value => { e.velocity ??= [0,0,0]; e.velocity[1] = value }, ' m/s')
      }
      if (e.render === 'ring') slider('Ring radius', e.ring?.to ?? 2, .1, 8, .1, value => { e.ring ??= { from: 0, to: 2, count: 32 }; e.ring.to = value }, ' m')
      else if (!staticKind) slider('Spread', e.shape?.radius ?? .3, 0, 3, .05, value => { e.shape = { ...e.shape, kind: e.shape?.kind ?? 'sphere', radius: value } }, ' m')
      const first = Array.isArray(e.color) && typeof e.color[0] === 'object' ? (e.color as {color:number[]}[])[0]?.color ?? [1,1,1] : e.color as number[] ?? [1,1,1]
      const hex = '#' + first.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2,'0')).join('')
      const colorLevels = Array.isArray(e.color) && typeof e.color[0] === 'object' ? (e.color as {color:number[]}[]).map(p => Math.max(...p.color)) : []
      field(quick, 'Color', hex, v => { const rgb = [1,3,5].map(i => parseInt(v.slice(i,i+2),16)/255) as [number,number,number]; e.color = Array.isArray(e.color) && typeof e.color[0] === 'object' ? (e.color as {t:number;color:number[]}[]).map((p, i) => ({ ...p, color: rgb.map(c => c * colorLevels[i]) as [number,number,number] })) : rgb }, 'color')
    }

    const emission = group('Emission')
    select(emission, 'Type', e.render ?? 'particle', [['particle','Particles'],['ring','Ring'],['beam','Beam'],['ribbon','Trail'],['heat','Fire'],['decal','Ground decal'],['flipbook','Flipbook (JSON)']], v => { e.render = v as EmitterDef['render']; if(v==='ring') {e.ring ??= {from:0,to:2,count:32}; e.rate=0; e.bursts=[{at:0,count:1}]} })
    field(emission, 'Glyphs / s', e.rate ?? 0, v => e.rate = Number(v))
    field(emission, 'Initial burst', e.bursts?.find(b => b.at === 0)?.count ?? 0, v => { e.bursts = [{ at: 0, count: Math.round(Number(v)) }, ...(e.bursts ?? []).filter(b => b.at !== 0)] })
    field(emission, 'Start (s)', e.start ?? 0, v => e.start = Number(v))
    field(emission, 'Minimum lifetime (s)', Array.isArray(e.life) ? e.life[0] : e.life ?? 1, v => { const max = Array.isArray(e.life) ? e.life[1] : e.life ?? 1; e.life = [Number(v), Math.max(Number(v),max)]; render() }, 'number', .01)
    field(emission, 'Maximum lifetime (s)', Array.isArray(e.life) ? e.life[1] : e.life ?? 1, v => { const min = Array.isArray(e.life) ? e.life[0] : e.life ?? 1; e.life = [Math.min(Number(v),min), Number(v)]; render() }, 'number', .01)
    const shape = group('Spawn shape')
    select(shape, 'Shape', e.shape?.kind ?? 'point', [['point','Point'],['sphere','Sphere'],['cone','Cone'],['ring','Ring'],['box','Box'],['line','Line']], v => { e.shape = { ...e.shape, kind: v as NonNullable<EmitterDef['shape']>['kind'] } })
    field(shape, 'Radius (m)', e.shape?.radius ?? .3, v => e.shape = { ...e.shape, kind: e.shape?.kind ?? 'sphere', radius: Number(v) })
    if (e.shape?.kind === 'box' || e.shape?.kind === 'line') for (const [axis,i] of ['X','Y','Z'].map((a,i) => [a,i] as const)) {
      const key = e.shape.kind === 'box' ? 'size' : 'to'
      field(shape, `${key === 'size' ? 'Dimension' : 'Target'} ${axis}`, e.shape[key]?.[i] ?? 1, v => { e.shape![key] ??= [1,1,1]; e.shape![key]![i] = Number(v) }, 'number', key === 'size' ? .01 : -1000)
    }
    if (e.render === 'ring') for (const [key,title,fallback] of [['from','Initial radius',0],['to','Final radius',2],['count','Ring glyph count',32]] as const) field(shape,title,e.ring?.[key] ?? fallback,v => { e.ring ??= { from: 0, to: 2, count: 32 }; e.ring[key] = Number(v) },'number',key === 'count' ? 1 : 0)
    const movement = group('Motion')
    for (const [i,axis] of ['X','Y','Z'].entries()) field(movement, `Speed ${axis}`, e.velocity?.[i] ?? 0, v => { e.velocity ??= [0,0,0]; e.velocity[i] = Number(v) }, 'number', -1000)
    for (const [key,title] of [['gravity','Gravity'],['drag','Drag'],['noise','Noise'],['spin','Spin']] as const) field(movement,title,e[key] ?? 0,v => e[key] = Number(v),'number',key === 'spin' ? -1000 : 0)
    const look = group('Appearance')
    field(look, 'Glyphs', e.glyphs ?? '*+:.', v => e.glyphs = v, 'text')
    const scalar = (v: EmitterDef['size'], last = false) => typeof v === 'number' ? v : Array.isArray(v) ? typeof v[0] === 'number' ? Number(v[last ? 1 : 0]) : (v[last ? v.length - 1 : 0] as {v:number})?.v ?? .18 : .18
    field(look,'Initial size',scalar(e.size),v => e.size = [{t:0,v:Number(v)},{t:1,v:scalar(e.size,true)}],'number',.01,10)
    field(look,'Final size',scalar(e.size,true),v => e.size = [{t:0,v:scalar(e.size)},{t:1,v:Number(v)}],'number',.01,10)
    field(look,'Glow',e.glow ?? 1,v => e.glow = Number(v),'number',0,10)
    const rgb = (last: boolean): number[] => Array.isArray(e.color) && typeof e.color[0] === 'object' ? (e.color as {color:number[]}[])[last ? e.color.length - 1 : 0]?.color ?? [1,1,1] : e.color as number[] ?? [1,1,1]
    const hex = (color: number[]) => '#' + color.map(v => Math.round(Math.min(1,Math.max(0,v))*255).toString(16).padStart(2,'0')).join('')
    for (const last of [false,true]) field(look,last ? 'End color' : 'Start color',hex(rgb(last)),v => { const color = [1,3,5].map(i => parseInt(v.slice(i,i+2),16)/255) as [number,number,number]; e.color = [{t:0,color:last ? rgb(false) as [number,number,number] : color},{t:1,color:last ? color : rgb(true) as [number,number,number]}] },'color')
  }
  async function save(place = false) {
    if (saving) return
    try {
      draft.name = get<HTMLInputElement>('name').value.trim()
      const definition = parseEffect(draft), key = selectedKey ?? `fx:custom-${crypto.randomUUID()}`
      saving = true; get<HTMLButtonElement>('save').disabled = true; get<HTMLButtonElement>('place').disabled = true
      await callbacks.save(key, definition); selectedKey = key; dirty = false; refreshSources(); savedNote(); status('Saved to Assets → Effects. Ready to use on the map.')
      if (place) { stop(); callbacks.place(key) } else if (active) stage.play(definition)
    } catch (error) { status(String(error)) }
    finally { saving = false; get<HTMLButtonElement>('save').disabled = false; get<HTMLButtonElement>('place').disabled = false }
  }
  function newEffect() { stop(); selectedKey = undefined; draft = fresh(); emitter = 0; dirty = true; history.reset(draft); refreshSources(); render(); if (active) play(true) }
  get('new').onclick = newEffect
  get<HTMLInputElement>('name').onchange = e => { draft.name = (e.target as HTMLInputElement).value; edited() }
  get<HTMLSelectElement>('source').onchange = e => {
    const key = (e.target as HTMLSelectElement).value
    const source = key.startsWith('preset:') ? POMOROG_EFFECTS.find(def => `preset:${def.name}` === key) : callbacks.definitions()[key]
    if (!source) return
    stop(); draft = structuredClone(source); if (key.startsWith('preset:')) draft.name = effectName(draft.name); selectedKey = key.startsWith('preset:') ? undefined : key; emitter = 0; dirty = !selectedKey; history.reset(draft); render(); if (active) play(true)
  }
  get('reveal').onclick = callbacks.reveal
  get('save').onclick = () => { void save() }; get('place').onclick = () => { void save(true) }
  get('export').onclick = () => {
    try { const def = parseEffect(draft), url = URL.createObjectURL(new Blob([JSON.stringify(def,null,2)],{type:'application/json'})); const a=document.createElement('a'); a.href=url; a.download=`${def.name.replace(/[^\p{L}\p{N}_-]/gu,'-')}.effect.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000) } catch(error) {status(String(error))}
  }
  get('apply').onclick = () => { try { draft = parseEffect(JSON.parse(get<HTMLTextAreaElement>('json').value)); emitter = 0; edited(); render() } catch(error) {status(String(error))} }
  get<HTMLInputElement>('import').onchange = async e => {
    const input=e.target as HTMLInputElement,file=input.files?.[0];input.value='';if(!file)return
    try {const candidate=parseEffect(JSON.parse(await file.text()));stop();draft=candidate;selectedKey=undefined;emitter=0;history.reset(draft);edited();refreshSources();render()}catch(error){status(String(error))}
  }
  root.closest('#editor-workspace')!.addEventListener('project-tab', event => { active = (event as CustomEvent).detail === 'effects'; if (active) { refreshSources(); stage.show(draft) } else stage.hide() }, { signal: abort.signal })
  refreshSources(); render(); status('Choose a preset above or adjust the current effect.')
  return {
    newEffect, save,
    frame: stage.frame, capture: stage.capture,
    edit(key: string) { const def = callbacks.definitions()[key]; if (!def) return; draft = structuredClone(def); selectedKey = key; emitter = 0; dirty = false; history.reset(draft); refreshSources(); render(); if (active) play(true) },
    refresh() { refreshSources(); if (selectedKey && !dirty) { const def = callbacks.definitions()[selectedKey]; if (def) { if (JSON.stringify(def) !== JSON.stringify(draft)) { draft = structuredClone(def); history.reset(draft) }; render(); if (active) play(true) } else { stop(); selectedKey = undefined; savedNote() } } },
    stop,
    dispose() { abort.abort(); stage.dispose() },
  }
}
