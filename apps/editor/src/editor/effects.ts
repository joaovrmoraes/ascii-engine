import { POMOROG_EFFECTS, parseEffect, type AsciiEngine, type EffectDef, type EffectInstance, type EmitterDef } from '@ascii-engine/core'
import type * as THREE from 'three'

const newEmitter = (): EmitterDef => ({ render: 'particle', shape: { kind: 'sphere', radius: .3 }, rate: 24, life: [1, 2], velocity: [0, 1, 0], size: .18, glyphs: '*+:.', color: [1, .75, .3], alpha: [{ t: 0, v: 1 }, { t: 1, v: 0 }], max: 1000 })
const fresh = (): EffectDef => ({ name: 'Meu efeito', duration: 3, loop: true, emitters: [newEmitter()] })

/** Form authoring over the existing effect runtime; JSON remains an advanced option. */
export function createEffectEditor(root: HTMLElement, engine: AsciiEngine, callbacks: {
  definitions(): Record<string, EffectDef>
  position(): THREE.Vector3
  save(key: string, definition: EffectDef): Promise<void>
  place(key: string): void
}) {
  let draft = fresh(), selectedKey: string | undefined, emitter = 0, preview: EffectInstance | undefined, active = false, saving = false, dirty = false
  const abort = new AbortController()
  root.innerHTML = `<div class="fx-toolbar">
    <select data-fx="source" aria-label="Base do efeito"></select><button data-fx="new">Novo efeito</button>
    <input data-fx="name" aria-label="Nome do efeito" placeholder="Nome do efeito">
    <button data-fx="play">▶ Prévia</button><button data-fx="stop">■ Parar</button>
    <button data-fx="save">Salvar na biblioteca</button><button data-fx="place">Salvar e colocar</button>
    <button data-fx="export">Baixar efeito</button><label class="file">Abrir efeito<input data-fx="import" type="file" accept=".json" hidden></label>
  </div><div class="fx-general"></div><div class="fx-status" role="status"></div><div class="fx-body"><div class="fx-emitter-list"></div><div class="fx-fields"></div></div>
  <details class="fx-advanced"><summary>Avançado — definição JSON</summary><textarea data-fx="json" spellcheck="false" aria-label="Definição JSON do efeito"></textarea><button data-fx="apply">Aplicar JSON</button></details>`
  const get = <T extends HTMLElement = HTMLElement>(key: string) => root.querySelector<T>(`[data-fx="${key}"]`)!
  const status = (message: string) => { root.querySelector('.fx-status')!.textContent = message }
  function stop() { preview?.cancel(); preview = undefined }
  function play() {
    try { const definition = parseEffect(draft); stop(); preview = engine.fx.play(definition, callbacks.position()); status('Prévia no centro da vista · alterações ainda precisam ser salvas na biblioteca.') }
    catch (error) { status(String(error)) }
  }
  function edited() { dirty = true; get<HTMLTextAreaElement>('json').value = JSON.stringify(draft, null, 2); if (active) play() }
  function refreshSources() {
    const select = get<HTMLSelectElement>('source'); select.replaceChildren(new Option('Escolher base ou efeito salvo…', ''))
    const saved = document.createElement('optgroup'); saved.label = 'Neste documento'
    for (const [key, def] of Object.entries(callbacks.definitions())) saved.append(new Option(def.name, key))
    const templates = document.createElement('optgroup'); templates.label = 'Bases do Pomorog'
    for (const def of POMOROG_EFFECTS) templates.append(new Option(def.name, `preset:${def.name}`))
    select.append(saved, templates); select.value = selectedKey ?? ''
  }
  function render() {
    get<HTMLInputElement>('name').value = draft.name
    get<HTMLTextAreaElement>('json').value = JSON.stringify(draft, null, 2)
    const list = root.querySelector('.fx-emitter-list')!, fields = root.querySelector('.fx-fields')!
    list.replaceChildren(); fields.replaceChildren()
    draft.emitters.forEach((_, i) => { const button = document.createElement('button'); button.textContent = `Emissor ${i + 1}`; button.classList.toggle('active', i === emitter); button.onclick = () => { emitter = i; render() }; list.append(button) })
    for (const [title, action] of [
      ['+ Emissor', () => { if (draft.emitters.length >= 32) return; draft.emitters.push(newEmitter()); emitter = draft.emitters.length - 1 }],
      ['Duplicar emissor', () => { if (draft.emitters.length >= 32 || !draft.emitters[emitter]) return; draft.emitters.push(structuredClone(draft.emitters[emitter])); emitter = draft.emitters.length - 1 }],
      ['Excluir emissor', () => { draft.emitters.splice(emitter, 1); emitter = Math.max(0, emitter - 1) }],
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
    field(general, 'Duração (s)', draft.duration, v => draft.duration = Number(v), 'number', .01, 3600)
    field(general, 'Repetir', !!draft.loop, v => draft.loop = v === 'true', 'checkbox')
    field(general, 'Emitir luz', !!draft.light, v => { draft.light = v === 'true' ? { color: 0xffac55, intensity: 14, distance: 7, offset: [0,1,0], flicker: .12 } : undefined; render() }, 'checkbox')
    if (draft.light) {
      field(general, 'Cor da luz', '#' + draft.light.color.toString(16).padStart(6, '0'), v => draft.light!.color = parseInt(v.slice(1), 16), 'color')
      field(general, 'Intensidade', draft.light.intensity, v => draft.light!.intensity = Number(v), 'number', 0, 100)
      field(general, 'Alcance (m)', draft.light.distance ?? 6, v => draft.light!.distance = Number(v), 'number', .1, 100)
      field(general, 'Altura da luz', draft.light.offset?.[1] ?? 1, v => { draft.light!.offset ??= [0,1,0]; draft.light!.offset[1] = Number(v) }, 'number', -100, 100)
    }
    const e = draft.emitters[emitter]; if (!e) return
    const emission = group('Emissão')
    select(emission, 'Tipo', e.render ?? 'particle', [['particle','Partículas'],['ring','Anel'],['beam','Feixe'],['ribbon','Rastro'],['heat','Fogo'],['decal','Marca no chão'],['flipbook','Flipbook (JSON)']], v => { e.render = v as EmitterDef['render']; if(v==='ring') {e.ring ??= {from:0,to:2,count:32}; e.rate=0; e.bursts=[{at:0,count:1}]} })
    field(emission, 'Letras / s', e.rate ?? 0, v => e.rate = Number(v))
    field(emission, 'Rajada inicial', e.bursts?.find(b => b.at === 0)?.count ?? 0, v => { e.bursts = [{ at: 0, count: Math.round(Number(v)) }, ...(e.bursts ?? []).filter(b => b.at !== 0)] })
    field(emission, 'Início (s)', e.start ?? 0, v => e.start = Number(v))
    field(emission, 'Vida mínima (s)', Array.isArray(e.life) ? e.life[0] : e.life ?? 1, v => { const max = Array.isArray(e.life) ? e.life[1] : e.life ?? 1; e.life = [Number(v), Math.max(Number(v),max)]; render() }, 'number', .01)
    field(emission, 'Vida máxima (s)', Array.isArray(e.life) ? e.life[1] : e.life ?? 1, v => { const min = Array.isArray(e.life) ? e.life[0] : e.life ?? 1; e.life = [Math.min(Number(v),min), Number(v)]; render() }, 'number', .01)
    const shape = group('Forma de nascimento')
    select(shape, 'Forma', e.shape?.kind ?? 'point', [['point','Ponto'],['sphere','Esfera'],['cone','Cone'],['ring','Anel'],['box','Caixa'],['line','Linha']], v => { e.shape = { ...e.shape, kind: v as NonNullable<EmitterDef['shape']>['kind'] } })
    field(shape, 'Raio (m)', e.shape?.radius ?? .3, v => e.shape = { ...e.shape, kind: e.shape?.kind ?? 'sphere', radius: Number(v) })
    if (e.shape?.kind === 'box' || e.shape?.kind === 'line') for (const [axis,i] of ['X','Y','Z'].map((a,i) => [a,i] as const)) {
      const key = e.shape.kind === 'box' ? 'size' : 'to'
      field(shape, `${key === 'size' ? 'Dimensão' : 'Destino'} ${axis}`, e.shape[key]?.[i] ?? 1, v => { e.shape![key] ??= [1,1,1]; e.shape![key]![i] = Number(v) }, 'number', key === 'size' ? .01 : -1000)
    }
    if (e.render === 'ring') for (const [key,title,fallback] of [['from','Raio inicial',0],['to','Raio final',2],['count','Letras no anel',32]] as const) field(shape,title,e.ring?.[key] ?? fallback,v => { e.ring ??= { from: 0, to: 2, count: 32 }; e.ring[key] = Number(v) },'number',key === 'count' ? 1 : 0)
    const movement = group('Movimento')
    for (const [i,axis] of ['X','Y','Z'].entries()) field(movement, `Velocidade ${axis}`, e.velocity?.[i] ?? 0, v => { e.velocity ??= [0,0,0]; e.velocity[i] = Number(v) }, 'number', -1000)
    for (const [key,title] of [['gravity','Gravidade'],['drag','Arrasto'],['noise','Variação'],['spin','Giro']] as const) field(movement,title,e[key] ?? 0,v => e[key] = Number(v),'number',key === 'spin' ? -1000 : 0)
    const look = group('Aparência')
    field(look, 'Letras', e.glyphs ?? '*+:.', v => e.glyphs = v, 'text')
    const scalar = (v: EmitterDef['size'], last = false) => typeof v === 'number' ? v : Array.isArray(v) ? typeof v[0] === 'number' ? Number(v[last ? 1 : 0]) : (v[last ? v.length - 1 : 0] as {v:number})?.v ?? .18 : .18
    field(look,'Tamanho inicial',scalar(e.size),v => e.size = [{t:0,v:Number(v)},{t:1,v:scalar(e.size,true)}],'number',.01,10)
    field(look,'Tamanho final',scalar(e.size,true),v => e.size = [{t:0,v:scalar(e.size)},{t:1,v:Number(v)}],'number',.01,10)
    field(look,'Brilho',e.glow ?? 1,v => e.glow = Number(v),'number',0,10)
    const rgb = (last: boolean): number[] => Array.isArray(e.color) && typeof e.color[0] === 'object' ? (e.color as {color:number[]}[])[last ? e.color.length - 1 : 0]?.color ?? [1,1,1] : e.color as number[] ?? [1,1,1]
    const hex = (color: number[]) => '#' + color.map(v => Math.round(Math.min(1,Math.max(0,v))*255).toString(16).padStart(2,'0')).join('')
    for (const last of [false,true]) field(look,last ? 'Cor final' : 'Cor inicial',hex(rgb(last)),v => { const color = [1,3,5].map(i => parseInt(v.slice(i,i+2),16)/255) as [number,number,number]; e.color = [{t:0,color:last ? rgb(false) as [number,number,number] : color},{t:1,color:last ? color : rgb(true) as [number,number,number]}] },'color')
  }
  async function save(place = false) {
    if (saving) return
    try {
      const definition = parseEffect(draft), key = selectedKey ?? `fx:custom-${crypto.randomUUID()}`
      saving = true; get<HTMLButtonElement>('save').disabled = true; get<HTMLButtonElement>('place').disabled = true
      await callbacks.save(key, definition); selectedKey = key; dirty = false; refreshSources(); status('Efeito salvo na biblioteca e no documento.')
      if (place) { stop(); callbacks.place(key) }
    } catch (error) { status(String(error)) }
    finally { saving = false; get<HTMLButtonElement>('save').disabled = false; get<HTMLButtonElement>('place').disabled = false }
  }
  function newEffect() { stop(); selectedKey = undefined; draft = fresh(); emitter = 0; dirty = true; refreshSources(); render(); if (active) play() }
  get('new').onclick = newEffect
  get<HTMLInputElement>('name').onchange = e => { draft.name = (e.target as HTMLInputElement).value; edited() }
  get<HTMLSelectElement>('source').onchange = e => {
    const key = (e.target as HTMLSelectElement).value
    const source = key.startsWith('preset:') ? POMOROG_EFFECTS.find(def => `preset:${def.name}` === key) : callbacks.definitions()[key]
    if (!source) return
    stop(); draft = structuredClone(source); selectedKey = key.startsWith('preset:') ? undefined : key; emitter = 0; dirty = !selectedKey; render(); if (active) play()
  }
  get('play').onclick = play; get('stop').onclick = stop
  get('save').onclick = () => { void save() }; get('place').onclick = () => { void save(true) }
  get('export').onclick = () => {
    try { const def = parseEffect(draft), url = URL.createObjectURL(new Blob([JSON.stringify(def,null,2)],{type:'application/json'})); const a=document.createElement('a'); a.href=url; a.download=`${def.name.replace(/[^\p{L}\p{N}_-]/gu,'-')}.effect.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000) } catch(error) {status(String(error))}
  }
  get('apply').onclick = () => { try { draft = parseEffect(JSON.parse(get<HTMLTextAreaElement>('json').value)); emitter = 0; edited(); render() } catch(error) {status(String(error))} }
  get<HTMLInputElement>('import').onchange = async e => {
    const input=e.target as HTMLInputElement,file=input.files?.[0];input.value='';if(!file)return
    try {const candidate=parseEffect(JSON.parse(await file.text()));stop();draft=candidate;selectedKey=undefined;emitter=0;edited();refreshSources();render()}catch(error){status(String(error))}
  }
  root.closest('#editor-workspace')!.addEventListener('project-tab', event => { active = (event as CustomEvent).detail === 'effects'; if (active) { refreshSources(); if (!preview) play() } else stop() }, { signal: abort.signal })
  refreshSources(); render(); status('Crie um efeito ou escolha uma base. A prévia aparece no centro da vista.')
  return {
    newEffect,
    refresh() { refreshSources(); if (selectedKey && !dirty) { const def = callbacks.definitions()[selectedKey]; if (def) { draft = structuredClone(def); render(); if (active) play() } else { stop(); selectedKey = undefined } } },
    stop,
    dispose() { abort.abort(); stop() },
  }
}
