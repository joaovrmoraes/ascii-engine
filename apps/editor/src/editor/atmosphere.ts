import { pomorog, parseScene, atmosphereStyle, type AtmosphereAsset, type AsciiEngine, type AsciiStyle } from '@ascii-engine/core'

/** Lighting authoring shares the scene's portable style, including undo/export. */
export function createAtmosphereStudio(root: HTMLElement, engine: AsciiEngine, changed: () => void, callbacks: {
  reveal(): void
  definitions(): Record<string, AtmosphereAsset>
  save(key: string, asset: AtmosphereAsset): Promise<void>
}) {
  let selectedKey: string | undefined, saving = false
  const presets: Record<AsciiStyle['atmosphere'], Partial<AsciiStyle>> = {
    moon: { atmosphere: 'moon', inkTint: [1,1,1], background: pomorog.background, fog: pomorog.fog, hemisphere: pomorog.hemisphere, moon: pomorog.moon, fill: pomorog.fill, bodyAmbient: pomorog.bodyAmbient, brightness: 1 },
    dusk: { atmosphere: 'dusk', inkTint: [1,.86,.74], background: 0x100b16, fog: { color: 0x100b16, density: .018 }, hemisphere: { sky: 0xc5acce, ground: 0x433025, intensity: 1.15 }, moon: { ...pomorog.moon, color: 0xffbd83, intensity: 1.65, position: [-10,7,6] }, fill: { ...pomorog.fill, color: 0x7c97c2, intensity: .4 }, bodyAmbient: .27, brightness: 1 },
    ember: { atmosphere: 'ember', inkTint: [1,.7,.43], background: 0x140702, fog: { color: 0x140702, density: .022 }, hemisphere: { sky: 0xdca177, ground: 0x472015, intensity: 1 }, moon: { ...pomorog.moon, color: 0xff9555, intensity: 1.8 }, fill: { ...pomorog.fill, color: 0xc1694c, intensity: .25 }, bodyAmbient: .24, brightness: 1 },
  }
  root.innerHTML = `<div class="fx-heading"><h2>Criar atmosfera</h2><p>Ajuste a iluminação no mapa e salve para reutilizar.</p></div>
    <div class="fx-toolbar"><select data-studio="preset" aria-label="Base da atmosfera"><option value="moon">Luar</option><option value="dusk">Entardecer</option><option value="ember">Brasa</option></select><button data-studio="reset">Restaurar base</button></div>
    <label class="fx-name">Nome da atmosfera<input data-studio="name" aria-label="Nome da atmosfera" value="Minha atmosfera"></label>
    <p class="fx-status" role="status">Ajustes aparecem na cena. Ctrl Z desfaz. Salve nos Assets para reutilizar.</p><div class="fx-fields studio-fields"></div>
    <details class="fx-files"><summary>Importar ou baixar arquivo</summary><button data-studio="export">Baixar atmosfera</button><label class="file">Abrir atmosfera<input data-studio="import" type="file" accept=".json" hidden></label></details>
    <footer class="studio-save"><span data-studio="saved-note">Ainda não salva nos Assets</span><div><button data-studio="save" class="primary">Salvar nos Assets</button><button data-studio="copy">Salvar cópia</button><button data-studio="reveal">Ver nos Assets</button></div></footer>`
  const fields = root.querySelector('.studio-fields')!, status = root.querySelector('.fx-status')!
  const get = <T extends HTMLElement>(key: string) => root.querySelector<T>(`[data-studio="${key}"]`)!
  const hex = (value: number) => '#' + Math.round(value).toString(16).padStart(6, '0')
  function savedNote() {
    get<HTMLButtonElement>('reveal').disabled = !selectedKey
    const saved = selectedKey && callbacks.definitions()[selectedKey]
    const same = saved && saved.name === get<HTMLInputElement>('name').value.trim() && JSON.stringify(saved.style) === JSON.stringify(portable())
    get('saved-note').textContent = same ? 'Salva em Assets → Atmosferas' : 'Alterações ainda não salvas nos Assets'
  }
  function apply(patch: Partial<AsciiStyle>, commit = true) { engine.setStyle({ bodySceneLighting: true, inkFog: true, ...patch }); if (commit) changed(); savedNote() }
  function setPreset(value: AsciiStyle['atmosphere']) { selectedKey = undefined; get<HTMLInputElement>('name').value = { moon: 'Meu luar', dusk: 'Meu entardecer', ember: 'Minha brasa' }[value]; apply(structuredClone(presets[value])); refresh() }
  function refresh() {
    const s = engine.style; get<HTMLSelectElement>('preset').value = s.atmosphere; fields.replaceChildren(); if (selectedKey && !callbacks.definitions()[selectedKey]) selectedKey = undefined; savedNote()
    function group(title: string) { const box = document.createElement('fieldset'), legend = document.createElement('legend'); legend.textContent = title; box.append(legend); fields.append(box); return box }
    function field(box: HTMLElement, label: string, value: number | string, patch: (value: number) => Partial<AsciiStyle>, type = 'number', min = 0, max = 10, step = .05) {
      const row = document.createElement('label'); row.textContent = label
      const input = document.createElement('input'); input.type = type; input.value = String(value); input.min = String(min); input.max = String(max); input.step = String(step); input.dataset.studioField = label; input.setAttribute('aria-label', label)
      const valueOf = () => type === 'color' ? parseInt(input.value.slice(1), 16) : input.valueAsNumber
      input.oninput = () => { const n = valueOf(); if (Number.isFinite(n) && (type === 'color' || n >= min && n <= max)) apply(patch(n), false) }
      input.onchange = () => { const n = valueOf(); if (Number.isFinite(n) && (type === 'color' || n >= min && n <= max)) apply(patch(n)); else refresh() }
      row.append(input); box.append(row)
    }
    const scene = group('Cena e letras')
    field(scene, 'Exposição', s.brightness, brightness => ({ brightness }), 'number', 0, 4)
    const tint = s.inkTint ?? (s.atmosphere === 'dusk' ? [1.25,.8,.65] : s.atmosphere === 'ember' ? [1.5,.65,.36] : [1,1,1])
    field(scene, 'Cor das letras', '#' + tint.map(v => Math.round(Math.min(1,v)*255).toString(16).padStart(2,'0')).join(''), c => ({ inkTint: [(c >> 16)/255, ((c >> 8)&255)/255, (c&255)/255] }), 'color')
    field(scene, 'Fundo', hex(s.background), background => ({ background }), 'color')
    field(scene, 'Luz nas letras', s.bodyAmbient, bodyAmbient => ({ bodyAmbient }), 'number', 0, 2)
    const sun = group('Luz principal')
    field(sun, 'Cor principal', hex(s.moon.color), color => ({ moon: { ...engine.style.moon, color } }), 'color')
    field(sun, 'Intensidade principal', s.moon.intensity, intensity => ({ moon: { ...engine.style.moon, intensity } }), 'number', 0, 10)
    for (const [i, axis] of ['X','Y','Z'].entries()) field(sun, `Direção ${axis}`, s.moon.position[i], n => { const position = [...engine.style.moon.position] as [number,number,number]; position[i] = n; return { moon: { ...engine.style.moon, position } } }, 'number', -50, 50, .5)
    field(sun, 'Sombra', s.moon.shadowIntensity, shadowIntensity => ({ moon: { ...engine.style.moon, shadowIntensity } }), 'number', 0, 1)
    const ambient = group('Luz ambiente')
    field(ambient, 'Cor do céu', hex(s.hemisphere.sky), sky => ({ hemisphere: { ...engine.style.hemisphere, sky } }), 'color')
    field(ambient, 'Cor do chão', hex(s.hemisphere.ground), ground => ({ hemisphere: { ...engine.style.hemisphere, ground } }), 'color')
    field(ambient, 'Intensidade ambiente', s.hemisphere.intensity, intensity => ({ hemisphere: { ...engine.style.hemisphere, intensity }, bodyAmbient: .3 * intensity / 1.25 }), 'number', 0, 5)
    field(ambient, 'Cor de preenchimento', hex(s.fill.color), color => ({ fill: { ...engine.style.fill, color } }), 'color')
    field(ambient, 'Preenchimento', s.fill.intensity, intensity => ({ fill: { ...engine.style.fill, intensity } }), 'number', 0, 5)
    const fog = group('Névoa')
    field(fog, 'Cor da névoa', hex(s.fog?.color ?? s.background), color => ({ fog: { color, density: engine.style.fog?.density ?? .012 } }), 'color')
    field(fog, 'Densidade', s.fog?.density ?? 0, density => ({ fog: density ? { color: engine.style.fog?.color ?? engine.style.background, density } : null }), 'number', 0, .15, .002)
    const hint = document.createElement('p'); hint.className = 'empty-note'; hint.textContent = 'Densidade zero desliga a névoa.'; fog.append(hint)
  }
  get<HTMLSelectElement>('preset').onchange = e => setPreset((e.target as HTMLSelectElement).value as AsciiStyle['atmosphere'])
  get('reset').onclick = () => setPreset(engine.style.atmosphere)
  function portable() { return atmosphereStyle(engine.exportStyle()) }
  function applyAsset(key: string) {
    const asset = callbacks.definitions()[key]; if (!asset) return
    selectedKey = key; get<HTMLInputElement>('name').value = asset.name; apply(structuredClone(asset.style)); refresh()
    status.textContent = `Atmosfera “${asset.name}” aplicada. Ctrl Z desfaz.`
  }
  async function save(copy = false) {
    if (saving) return
    const name = get<HTMLInputElement>('name').value.trim()
    if (!name) { status.textContent = 'Dê um nome à atmosfera antes de salvar.'; get('name').focus(); return }
    saving = true; get<HTMLButtonElement>('save').disabled = true; get<HTMLButtonElement>('copy').disabled = true
    try {
      const key = !copy && selectedKey ? selectedKey : `atmosphere-${crypto.randomUUID()}`
      await callbacks.save(key, { name, style: portable() }); selectedKey = key; savedNote()
      status.textContent = 'Salva nos Assets → Atmosferas. Clique nela na biblioteca para aplicar; duplo clique para editar.'
    } catch (error) { status.textContent = String(error) }
    finally { saving = false; get<HTMLButtonElement>('save').disabled = false; get<HTMLButtonElement>('copy').disabled = false }
  }
  get('reveal').onclick = callbacks.reveal
  get('save').onclick = () => { void save() }; get('copy').onclick = () => { void save(true) }
  get<HTMLInputElement>('name').oninput = savedNote
  get('export').onclick = () => { const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, name: get<HTMLInputElement>('name').value.trim(), atmosphere: portable() },null,2)], {type:'application/json'})), a = document.createElement('a'); a.href=url; a.download='minha.atmosphere.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000) }
  get<HTMLInputElement>('import').onchange = async e => {
    const input = e.target as HTMLInputElement, file = input.files?.[0]; input.value = ''; if (!file) return
    try { const content = JSON.parse(await file.text()); if (content.version !== 1 || !content.atmosphere || typeof content.atmosphere !== 'object') throw new Error('Arquivo de atmosfera inválido.'); const style = parseScene({ version: 1, objects: [], style: content.atmosphere }).style!; selectedKey = undefined; get<HTMLInputElement>('name').value = typeof content.name === 'string' ? content.name : file.name.replace(/\.atmosphere\.json$/, ''); apply(atmosphereStyle(style)); refresh(); status.textContent = 'Atmosfera aberta. Clique em Salvar nos Assets para adicioná-la à biblioteca.' } catch (error) { status.textContent = String(error) }
  }
  refresh()
  return { refresh, setPreset, applyAsset }
}
