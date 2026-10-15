// Animated GitHub README previews extracted from the existing feature videos.
// Usage: node scripts/prepare-showcase-gifs.mjs
import { spawnSync } from 'node:child_process'
import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const output = join(root, 'docs/showcase/gifs')
const evidence = join(root, 'docs/captures/readme-gifs-2026-10-12')
mkdirSync(output, { recursive: true })
mkdirSync(evidence, { recursive: true })
const clips = [
  {
    name: 'living-shore',
    video: '06-camera',
    start: 92,
    seconds: 4,
    crop: '885:458:484:235',
    width: 720,
  },
  { name: '01-terrain', video: '01-terrain', start: 24, seconds: 4, width: 800 },
  { name: '02-water', video: '02-water', start: 67, seconds: 4, width: 800 },
  { name: '03-objects', video: '03-objects', start: 13, seconds: 4, width: 800 },
  { name: '04-effects', video: '04-effects', start: 28, seconds: 4, width: 800 },
  { name: '05-atmosphere', video: '05-atmosphere', start: 7, seconds: 4, width: 800 },
  { name: '06-camera', video: '06-camera', start: 55, seconds: 4, width: 800 },
]
const run = (command, args) => {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
  if (result.status !== 0) throw new Error(`${command}: ${result.error ?? result.stderr}`)
  return result.stdout
}
const validation = []
for (const clip of clips) {
  const file = join(output, clip.name + '.gif'),
    input = join(root, 'docs/showcase/videos', clip.video + '.mp4')
  const transform = `${clip.crop ? 'crop=' + clip.crop + ',' : ''}fps=8,scale=${clip.width}:-1:flags=lanczos`
  console.log(`Preparing ${clip.name}`)
  run('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'error',
    '-nostdin',
    '-threads',
    '2',
    '-ss',
    String(clip.start),
    '-t',
    String(clip.seconds),
    '-i',
    input,
    '-filter_complex_threads',
    '1',
    '-filter_complex',
    `${transform},split[a][b];[a]palettegen=stats_mode=diff:max_colors=128[p];[b][p]paletteuse=dither=none:diff_mode=rectangle`,
    '-loop',
    '0',
    '-an',
    '-y',
    file,
  ])
  if (statSync(file).size > 10 * 1024 * 1024)
    throw new Error(`Preview exceeds 10 MiB: ${clip.name}`)
  const probe = JSON.parse(
    run('ffprobe', [
      '-v',
      'error',
      '-count_frames',
      '-show_entries',
      'stream=width,height,nb_read_frames:format=duration,size',
      '-of',
      'json',
      file,
    ]),
  )
  if (Number(probe.streams[0].nb_read_frames) < 30)
    throw new Error(`Preview is not animated: ${clip.name}`)
  run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-xerror', '-i', file, '-f', 'null', '-'])
  validation.push({
    ...clip,
    fps: 8,
    loop: 'infinite',
    file: `docs/showcase/gifs/${clip.name}.gif`,
    fullDecode: 'passed',
    ...probe,
  })
  console.log(`${clip.name}: ${(statSync(file).size / 1048576).toFixed(1)} MiB`)
}
writeFileSync(join(evidence, 'gifs.json'), JSON.stringify(validation, null, 2) + '\n')
