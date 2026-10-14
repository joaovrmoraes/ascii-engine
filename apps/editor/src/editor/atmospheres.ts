import { pomorog } from '@ascii-engine/core/pomorog'
import { atmosphereStyle, type AsciiStyle, type AtmosphereStyle, type SceneDoc } from '@ascii-engine/core'

export const ATMOSPHERE_PRESETS: Record<AsciiStyle['atmosphere'], Partial<AsciiStyle>> = {
    moon: { atmosphere: 'moon', inkTint: [1,1,1], background: pomorog.background, fog: pomorog.fog, hemisphere: pomorog.hemisphere, moon: pomorog.moon, fill: pomorog.fill, bodyAmbient: pomorog.bodyAmbient, brightness: 1 },
    dusk: { atmosphere: 'dusk', inkTint: [1,.86,.74], background: 0x100b16, fog: { color: 0x100b16, density: .018 }, hemisphere: { sky: 0xc5acce, ground: 0x433025, intensity: 1.15 }, moon: { ...pomorog.moon, color: 0xffbd83, intensity: 1.65, position: [-10,7,6] }, fill: { ...pomorog.fill, color: 0x7c97c2, intensity: .4 }, bodyAmbient: .27, brightness: 1 },
    ember: { atmosphere: 'ember', inkTint: [1,.7,.43], background: 0x140702, fog: { color: 0x140702, density: .022 }, hemisphere: { sky: 0xdca177, ground: 0x472015, intensity: 1 }, moon: { ...pomorog.moon, color: 0xff9555, intensity: 1.8 }, fill: { ...pomorog.fill, color: 0xc1694c, intensity: .25 }, bodyAmbient: .24, brightness: 1 },
  }

const labels = { moon: 'Moonlight', dusk: 'Dusk', ember: 'Ember' }
export function atmosphereChoices(doc: SceneDoc) {
  return [
    ...Object.entries(ATMOSPHERE_PRESETS).map(([id, style]) => ({ id, name: labels[id as keyof typeof labels], style: atmosphereStyle({ ...style, bodySceneLighting: true, inkFog: true }) })),
    ...Object.entries(doc.atmospheres ?? {}).map(([id, asset]) => ({ id: `asset:${id}`, ...asset })),
  ]
}
export function matchingAtmosphere(doc: SceneDoc, style: AtmosphereStyle) {
  return [...atmosphereChoices(doc)].reverse().find(choice => Object.entries(choice.style).every(([key, value]) => JSON.stringify(style[key as keyof AtmosphereStyle]) === JSON.stringify(value)))?.id
}
export function fillAtmosphereSelect(select: HTMLSelectElement, doc: SceneDoc, value: string, legacy = false) {
  select.replaceChildren(new Option('Current scene', 'current'))
  for (const choice of atmosphereChoices(doc)) select.append(new Option(choice.name, choice.id))
  if (legacy) select.append(new Option('Saved texture preview lighting', 'legacy'))
  select.value = value
}
