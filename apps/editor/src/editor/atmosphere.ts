import { pomorog, parseScene, type AsciiEngine, type AsciiStyle } from '@ascii-engine/core'

/** Lighting authoring shares the scene's portable style, including undo/export. */
export function createAtmosphereStudio(root: HTMLElement, engine: AsciiEngine, changed: () => void) {
  const presets: Record<AsciiStyle['atmosphere'], Partial<AsciiStyle>> = {
    moon: { atmosphere: 'moon', inkTint: [1,1,1], background: pomorog.background, fog: pomorog.fog, hemisphere: pomorog.hemisphere, moon: pomorog.moon, fill: pomorog.fill, bodyAmbient: pomorog.bodyAmbient, brightness: 1 },
    dusk: { atmosphere: 'dusk', inkTint: [1,.86,.74], background: 0x100b16, fog: { color: 0x100b16, density: .018 }, hemisphere: { sky: 0xc5acce, ground: 0x433025, intensity: 1.15 }, moon: { ...pomorog.moon, color: 0xffbd83, intensity: 1.65, position: [-10,7,6] }, fill: { ...pomorog.fill, color: 0x7c97c2, intensity: .4 }, bodyAmbient: .27, brightness: 1 },
    ember: { atmosphere: 'ember', inkTint: [1,.7,.43], background: 0x140702, fog: { color: 0x140702, density: .022 }, hemisphere: { sky: 0xdca177, ground: 0x472015, intensity: 1 }, moon: { ...pomorog.moon, color: 0xff9555, intensity: 1.8 }, fill: { ...pomorog.fill, color: 0xc1694c, intensity: .25 }, bodyAmbient: .24, brightness: 1 },
  }
  root.innerHTML = `<div class="fx-toolbar"><strong>Estúdio de atmosfera</strong><select data-studio="preset" aria-label="Base da atmosfera"><option value="moon">Luar</option><option value="dusk">Entardecer</option><option value="ember">Brasa</option></select><button data-studio="reset">Restaurar base</button><button data-studio="export">Baixar atmosfera</button><label class="file">Abrir atmosfera<input data-studio="import" type="file" accept=".json" hidden></label></div><p class="fx-status" role="status">Ajustes aparecem na cena e são salvos com o mapa. Ctrl Z desfaz.</p><div class="fx-fields studio-fields"></div>`
  const fields = root.querySelector('.studio-fields')!, status = root.querySelector('.fx-status')!
  const get = <T extends HTMLElement>(key: string) => root.querySelector<T>(`[data-studio="${key}"]`)!
  const hex = (value: number) => '#' + Math.round(value).toString(16).padStart(6, '0')
  function apply(patch: Partial<AsciiStyle>, commit = true) { engine.setStyle({ bodySceneLighting: true, inkFog: true, ...patch }); if (commit) changed() }
  function setPreset(value: AsciiStyle['atmosphere']) { apply(structuredClone(presets[value])); refresh() }
  function refresh() {
    const s = engine.style; get<HTMLSelectElement>('preset').value = s.atmosphere; fields.replaceChildren()
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
  function portable(): Partial<AsciiStyle> { const { atmosphere, inkTint, bodySceneLighting, inkFog, brightness, background, fog, hemisphere, moon, fill, bodyAmbient } = engine.exportStyle(); return { atmosphere, inkTint, bodySceneLighting, inkFog, brightness, background, fog, hemisphere, moon, fill, bodyAmbient } }
  get('export').onclick = () => { const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, atmosphere: portable() },null,2)], {type:'application/json'})), a = document.createElement('a'); a.href=url; a.download='minha.atmosphere.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000) }
  get<HTMLInputElement>('import').onchange = async e => {
    const input = e.target as HTMLInputElement, file = input.files?.[0]; input.value = ''; if (!file) return
    try { const content = JSON.parse(await file.text()); if (content.version !== 1 || !content.atmosphere || typeof content.atmosphere !== 'object') throw new Error('Arquivo de atmosfera inválido.'); const style = parseScene({ version: 1, objects: [], style: content.atmosphere }).style!; const allowed = new Set(Object.keys(portable())); apply(Object.fromEntries(Object.entries(style).filter(([key]) => allowed.has(key)))); refresh(); status.textContent = 'Atmosfera aberta e aplicada à cena.' } catch (error) { status.textContent = String(error) }
  }
  refresh()
  return { refresh, setPreset }
}
