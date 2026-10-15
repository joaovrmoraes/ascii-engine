// Re-edit existing chapters with English cards and captions; preserve originals.
// Usage: node scripts/prepare-showcase.mjs /path/to/edition
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { chapters as captions } from '../tools/video-edit/src/edit.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = process.argv[2]
if (!source)
  throw new Error('Provide the edition directory containing partes/ and capitulos-editados.json.')
const output = join(root, 'docs/showcase')
const captures = join(root, 'docs/captures/readme-2026-10-12')
for (const folder of ['videos', 'posters']) mkdirSync(join(output, folder), { recursive: true })
mkdirSync(captures, { recursive: true })

const chapters = JSON.parse(readFileSync(join(source, 'capitulos-editados.json'), 'utf8'))
const parts = [
  ['01-Terreno', '01-terrain', 29],
  ['02-Agua', '02-water', 65],
  ['03-Objetos', '03-objects', 50],
  ['04-Efeito-e-luz', '04-effects', 68],
  ['05-Atmosfera', '05-atmosphere', 54],
  ['06-Camera-e-exportacao', '06-camera', 93],
]
const run = (command, args) => {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
  if (result.status !== 0) throw new Error(`${command}: ${result.error ?? result.stderr}`)
  return result.stdout
}
const ffmpeg = args =>
  run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-nostdin', '-threads', '2', ...args])
const only = process.argv.find(argument => argument.startsWith('--only='))?.slice(7)
const validation = only ? JSON.parse(readFileSync(join(captures, 'videos.json'), 'utf8')) : []
const temporary = mkdtempSync(join(tmpdir(), 'ascii-captions-'))
const font = '/usr/share/fonts/ttf-ia-writer/iAWriterDuoS-Regular.ttf'
const textFilter = (text, size, x, y, color, enable) => {
  const file = join(temporary, `${textFilter.index++}.txt`)
  writeFileSync(file, text)
  return `drawtext=fontfile=${font}:textfile=${file}:fontsize=${size}:fontcolor=${color}:x=${x}:y=${y}:enable='${enable}'`
}
textFilter.index = 0

try {
  for (const [id, slug, second] of parts) {
    if (only && slug !== only) continue
    const input = join(source, 'partes', `${id}.mp4`)
    const video = join(output, 'videos', `${slug}.mp4`)
    console.log(`Editing ${slug}…`)
    const index = parts.findIndex(part => part[0] === id),
      caption = captions[index]
    const color = caption.color,
      body = 'gte(t,1.8)',
      card = 'lt(t,1.8)'
    const filters = [
      'scale=1920:1080:flags=lanczos:in_color_matrix=bt709:out_color_matrix=bt709:in_range=tv:out_range=tv',
      'drawbox=x=0:y=0:w=iw:h=135:color=0x0b0e0d:t=fill',
      'drawbox=x=0:y=945:w=iw:h=135:color=0x0b0e0d:t=fill',
      `drawbox=x=0:y=0:w=iw:h=ih:color=0x0b0e0d:t=fill:enable='${card}'`,
      textFilter('ASCII ENGINE', 22, 54, 37, '#edf0e6', '1'),
      textFilter(caption.title, 30, 540, 30, '#edf0e6', body),
      textFilter(`0${index + 1} / 06`, 21, 1740, 41, color, body),
      textFilter(`CHAPTER 0${index + 1} / 06`, 25, 120, 280, color, card),
      textFilter(caption.title, 58, 120, 365, '#edf0e6', card),
      textFilter(caption.subtitle, 26, 120, 463, '#a7ada6', card),
      textFilter('LIVING SHORE / ASCII 3D COMPOSITION', 20, 120, 930, '#a7ada6', card),
      textFilter(`LIVE EDITOR / ${caption.speed.toFixed(2)}x`, 16, 1620, 1005, '#a7ada6', body),
    ]
    caption.notes.forEach((note, i) => {
      const begin = Math.max(1.8, 1.8 + (note.at - caption.start) / caption.speed)
      const end = caption.notes[i + 1]
        ? 1.8 + (caption.notes[i + 1].at - caption.start) / caption.speed
        : 999
      const enable = `gte(t,${begin})*lt(t,${end})`
      filters.push(
        textFilter(note.title, 25, 68, 974, color, enable),
        textFilter(note.detail, 19, 68, 1019, '#a7ada6', enable),
      )
    })
    ffmpeg([
      '-i',
      input,
      '-map',
      '0:v:0',
      '-map_metadata',
      '-1',
      '-map_chapters',
      '-1',
      '-vf',
      filters.join(','),
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      '23',
      '-maxrate',
      '3000k',
      '-bufsize',
      '6000k',
      '-threads',
      '2',
      '-filter_threads',
      '1',
      '-pix_fmt',
      'yuv420p',
      '-color_range',
      'tv',
      '-colorspace',
      'bt709',
      '-color_primaries',
      'bt709',
      '-color_trc',
      'bt709',
      '-an',
      '-movflags',
      '+faststart',
      '-y',
      video,
    ])
    ffmpeg([
      '-ss',
      String(second),
      '-i',
      video,
      '-frames:v',
      '1',
      '-update',
      '1',
      '-y',
      join(output, 'posters', `${slug}.png`),
    ])
    const chapter = chapters.find(chapter => chapter.id === id)
    const expectedFrames = chapter.endFrame - chapter.startFrame
    const probe = JSON.parse(
      run('ffprobe', [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-count_frames',
        '-show_entries',
        'stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_read_frames:format=duration,size',
        '-of',
        'json',
        video,
      ]),
    )
    if (Number(probe.streams[0].nb_read_frames) !== expectedFrames)
      throw new Error(`Unexpected frame count: ${slug}`)
    if (statSync(video).size >= 100 * 1024 * 1024) throw new Error(`Video too large: ${slug}`)
    ffmpeg(['-xerror', '-i', video, '-map', '0:v:0', '-f', 'null', '-'])
    const entry = {
      file: `docs/showcase/videos/${slug}.mp4`,
      expectedFrames,
      ...probe,
      fullDecode: 'passed',
    }
    const prior = validation.findIndex(item => item.file === entry.file)
    if (prior < 0) validation.push(entry)
    else validation[prior] = entry
    validation.sort((a, b) => a.file.localeCompare(b.file))
    writeFileSync(join(captures, 'videos.json'), JSON.stringify(validation, null, 2) + '\n')
    console.log(`Validated ${slug}: ${(statSync(video).size / 1024 / 1024).toFixed(1)} MiB`)
  }

  ffmpeg([
    '-ss',
    '93',
    '-i',
    join(source, 'partes/06-Camera-e-exportacao.mp4'),
    '-vf',
    'crop=1180:610:646:314',
    '-frames:v',
    '1',
    '-update',
    '1',
    '-y',
    join(output, 'posters/living-shore.png'),
  ])
  console.log('Six videos and seven images prepared for the README.')
} finally {
  rmSync(temporary, { recursive: true, force: true })
}
