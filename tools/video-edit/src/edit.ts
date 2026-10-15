export const FPS = 30
export const WIDTH = 2560
export const HEIGHT = 1440
export const CARD = 54
// The OBS source is I444: preserve color without saturation compensation.
export const SATURATION = 1
export const COLOR_FILTER = `saturate(${SATURATION})`
export const SCENE_TITLE = 'Living Shore'
export const SCENE_LINES = ['Living', 'Shore']
export const MAP_FILE = 'Margem-Viva.ascii.json'
export const SOURCE_DIRECTORY = '/home/jonny/Videos/ASCII-Engine-Closeup-2026-10-11'
export const POSTER_SECOND = 445
export const POSTER_CROP = '1180:610:646:134'

export type Chapter = {
  id: string
  title: string
  subtitle: string
  color: string
  start: number
  end: number
  speed: number
  notes: { at: number; title: string; detail: string }[]
}

export const chapters: Chapter[] = [
  {
    id: '01-Terreno',
    title: 'Shape the terrain',
    subtitle: 'The camera follows the work area.',
    color: '#b8d591',
    start: 0,
    end: 44.366667,
    speed: 1.2,
    notes: [
      { at: 0, title: 'Living Shore', detail: 'Create a map and prepare the composition.' },
      {
        at: 25.366,
        title: 'Terrain close-up',
        detail: 'Sculpt and smooth the slope with a brush.',
      },
    ],
  },
  {
    id: '02-Agua',
    title: 'Water, paths and wind',
    subtitle: 'Take a closer look at the moving scene.',
    color: '#91cbd4',
    start: 44.366667,
    end: 126.833333,
    speed: 1,
    notes: [
      {
        at: 44.366,
        title: 'Water brush',
        detail: 'Paint a lake and inspect the shoreline up close.',
      },
      {
        at: 71.699,
        title: 'Clear a path',
        detail: 'Paint the trail and clearing beside the water.',
      },
      {
        at: 101.633,
        title: 'Grass in the wind',
        detail: 'Low, close view · movement at normal speed.',
      },
    ],
  },
  {
    id: '03-Objetos',
    title: 'Compose with objects',
    subtitle: 'Build the shore with trees, rocks and ruins.',
    color: '#c5c895',
    start: 126.833333,
    end: 209.533333,
    speed: 1.3,
    notes: [
      {
        at: 126.833,
        title: 'Object library',
        detail: 'Choose an asset, preview it in 3D and place it in the scene.',
      },
      {
        at: 162,
        title: 'Rocks on the shore',
        detail: 'Use objects to give the terrain and lake a sense of scale.',
      },
      {
        at: 181,
        title: 'Ruin and fallen log',
        detail: 'Complete the composition and adjust rotation in the inspector.',
      },
    ],
  },
  {
    id: '04-Efeito-e-luz',
    title: 'Create a lit effect',
    subtitle: 'A fire made of letters, layer by layer.',
    color: '#eab27a',
    start: 209.533333,
    end: 284.233333,
    speed: 1,
    notes: [
      {
        at: 209.533,
        title: 'Effect studio',
        detail: 'Start with fire in an isolated close-up preview.',
      },
      {
        at: 222.633,
        title: 'Effect lighting',
        detail: 'Adjust light intensity, range and height.',
      },
      {
        at: 235.733,
        title: 'Rising sparks',
        detail: 'Edit layers, their origins and particle counts.',
      },
      {
        at: 250.199,
        title: 'Save to Assets',
        detail: 'Reuse the effect and place it on the shore.',
      },
      {
        at: 274.699,
        title: 'Fire in motion',
        detail: 'Fixed camera · flame, sparks and light in real time.',
      },
    ],
  },
  {
    id: '05-Atmosfera',
    title: 'Build the atmosphere',
    subtitle: 'Light direction, color and depth.',
    color: '#b2bde4',
    start: 284.233333,
    end: 355.766667,
    speed: 1.15,
    notes: [
      {
        at: 284.233,
        title: 'Atmosphere studio',
        detail: 'Compare dusk and moonlight on the same scene.',
      },
      {
        at: 311.499,
        title: 'Direction and intensity',
        detail: 'Adjust exposure, light rotation and elevation.',
      },
      { at: 324.399, title: 'Shadows and fog', detail: 'Balance ambient light and depth.' },
      {
        at: 336.799,
        title: 'Atmosphere in Assets',
        detail: 'Save Shore moonlight and apply it to the map.',
      },
    ],
  },
  {
    id: '06-Camera-e-exportacao',
    title: 'Frame the close-up',
    subtitle: 'Give the scene its own camera.',
    color: '#94d2b5',
    start: 355.766667,
    end: 452.8,
    speed: 1,
    notes: [
      {
        at: 355.766,
        title: 'Gentle ripples',
        detail: 'Move closer and adjust water in the inspector.',
      },
      {
        at: 379.199,
        title: 'Real-time water',
        detail: 'Observe waves and reflections with a fixed camera.',
      },
      { at: 396.533, title: 'Scene camera', detail: 'Live preview · a 6.5-meter frame in 16:9.' },
      {
        at: 428.899,
        title: 'Save and export',
        detail: 'Save the editable map and export the scene for Pomorog.',
      },
      {
        at: 438.433,
        title: 'Living Shore',
        detail: 'Grass, water, reflections and fire · result at normal speed.',
      },
    ],
  },
]

export const bodyFrames = (chapter: Chapter) =>
  Math.ceil(((chapter.end - chapter.start) * FPS) / chapter.speed)
export const chapterFrames = (chapter: Chapter) => CARD + bodyFrames(chapter) + 12
export const INTRO = 120
export const OUTRO = 120
export const totalFrames = INTRO + chapters.reduce((n, c) => n + chapterFrames(c), 0) + OUTRO
