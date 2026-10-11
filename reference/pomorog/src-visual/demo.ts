import { createCharacter, createCombatState, createRng, derive, MONSTERS, resolveEncounter, type HuntEvent } from '../../engine'
import type { VisualSettings } from './types'

/** Presentation-only expedition. No platform, storage, timer or progression writes. */
// Locked to the endless forest (user's request): a compressed pomodoro loop of
// one long hunt — walks, five encounters — followed by a rest at the bonfire.
export const DEMO_AREAS = [
  { id: 'dark_forest', title: 'Floresta Sombria', subtitle: 'Trilha infinita · caçada e pausa', monsters: ['forest_wolf', 'crimson_grub', 'giant_spider', 'forest_wasp', 'goblin_scout'], items: ['wolf_fang', 'gazing_eye', 'spider_silk', 'wasp_stinger', 'goblin_hand'] },
] as const
/** Long stretches of trail between encounters, as in a real 25-minute hunt. */
const WALKS = [6, 16, 12, 18, 14]
export const DEMO_MAX_HP = 120
export type DemoStage = 'walk' | 'approach' | 'fight' | 'defeat' | 'loot' | 'camp' | 'depart'
export interface DemoBeat {
  start: number; end: number; stage: DemoStage; area: number; encounter: number
  monster?: string; monsterHp: number; hp: number; item?: string
  feedback?: VisualSettings['feedback']; event?: HuntEvent
}

function createTimeline() {
  const beats: DemoBeat[] = [], areaStarts: number[] = []
  let time = 0, hp = DEMO_MAX_HP
  const character = createCharacter('visual-demo')
  // Explicit preview stats keep every showcase encounter readable and survivable.
  // The normal game's character and encounter numbers are untouched.
  character.loadout = { fast: { skillId: null, trigger: { kind: 'always' } }, medium: { skillId: null, trigger: { kind: 'always' } }, heavy: { skillId: null, trigger: { kind: 'always' } } }
  function add(seconds: number, beat: Omit<DemoBeat, 'start' | 'end'>) {
    beats.push({ ...beat, start: time, end: time + seconds }); time += seconds
  }
  DEMO_AREAS.forEach((area, areaIndex) => {
    areaStarts.push(time)
    area.monsters.forEach((id, encounter) => {
      const monster = MONSTERS[id]
      const base = { area: areaIndex, encounter, hp, monsterHp: monster.hp }
      add(WALKS[encounter], { ...base, stage: 'walk' })
      add(1.6, { ...base, stage: 'approach', monster: id })
      const state = createCombatState(hp, 0)
      const outcome = resolveEncounter({
        rng: createRng(`showcase:${id}`), character, monster, state, strategy: 'balanced', startMinute: 0,
        derived: { ...derive(character), maxHp: DEMO_MAX_HP, atk: monster.hp * .24 * (1 + monster.def / 45), def: 12, hit: monster.flee + 13, flee: monster.hit, aspd: monster.aspd * 1.1, crit: 0 },
      })
      let monsterHp = monster.hp
      let playerActions = 0
      for (const event of outcome.events) {
        let feedback: VisualSettings['feedback']
        if (event.type === 'attack' || event.type === 'skill') {
          playerActions++
          monsterHp = Math.max(0, monsterHp - event.damage)
          const spells = ['lightning', 'fire', 'frost'] as const
          feedback = { id: `${areaIndex}:${encounter}:${beats.length}`, target: 'enemy', text: `-${event.damage}`, spell: playerActions === 2 || monsterHp === 0 ? spells[(areaIndex + encounter) % 3] : undefined }
        } else if (event.type === 'damage') {
          hp = event.hpAfter
          feedback = { id: `${areaIndex}:${encounter}:${beats.length}`, target: 'player', text: `-${event.amount}` }
        } else if (event.type === 'miss') {
          feedback = { id: `${areaIndex}:${encounter}:${beats.length}`, target: event.byPlayer ? 'enemy' : 'player', text: 'MISS' }
        } else continue
        add(monsterHp === 0 ? 1.4 : .85, { ...base, stage: monsterHp === 0 ? 'defeat' : 'fight', monster: id, monsterHp, hp, event, feedback })
      }
      add(3.2, { ...base, stage: 'loot', hp, monsterHp: 0, item: area.items[encounter] })
    })
    // The pomodoro break: walk on to the bonfire, sit, recover.
    add(30, { area: areaIndex, encounter: area.monsters.length - 1, stage: 'camp', hp, monsterHp: 0 })
    hp = DEMO_MAX_HP
    add(3, { area: areaIndex, encounter: area.monsters.length - 1, stage: 'depart', hp, monsterHp: 0 })
  })
  return { beats, areaStarts, duration: time }
}
export const DEMO = createTimeline()

export function demoFrame(elapsed: number) {
  const time = ((elapsed % DEMO.duration) + DEMO.duration) % DEMO.duration
  const beat = DEMO.beats.find((entry) => time < entry.end) ?? DEMO.beats[0]
  const progress = (time - beat.start) / (beat.end - beat.start)
  const hp = beat.stage === 'camp' ? Math.round(beat.hp + (DEMO_MAX_HP - beat.hp) * Math.max(0, (progress - .55) / .45)) : beat.hp
  const items: Record<string, number> = {}
  let kills = 0
  for (const entry of DEMO.beats) {
    if (entry.start > time) break
    if (entry.stage === 'loot' && entry.item && time > entry.start + 2.4) { items[entry.item] = (items[entry.item] ?? 0) + 1; kills++ }
  }
  return { beat, time, progress, hp, items, kills, area: DEMO_AREAS[beat.area] }
}
