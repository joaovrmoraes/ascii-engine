import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const source = path.resolve(
  process.env.ASCII_VIDEO_SOURCE ?? '/home/jonny/Videos/ASCII-Engine-2026-10-11',
)
const output = path.resolve(process.env.ASCII_VIDEO_OUTPUT ?? path.join(source, 'edicao'))
const dir = path.join(output, 'diagnostico')
mkdirSync(dir, { recursive: true })
const run = args =>
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-threads', '2', ...args], {
    maxBuffer: 40 * 1024 * 1024,
  })
const shot = path.join(source, '10-previa-final.png')
const recording = path.join(source, 'ASCII-Engine-criacao-completa.mp4')
const rgb = (file, time) =>
  run([
    ...(time === undefined ? [] : ['-ss', String(time)]),
    '-i',
    file,
    '-frames:v',
    '1',
    '-pix_fmt',
    'rgb24',
    '-f',
    'rawvideo',
    '-',
  ])
const ref = rgb(shot)
const video = rgb(recording, 306)
const stats = data => {
  let count = 0,
    saturation = 0,
    chroma = 0
  for (let y = 140; y < 740; y++)
    for (let x = 680; x < 1850; x++) {
      const i = (y * 2560 + x) * 3
      const max = Math.max(data[i], data[i + 1], data[i + 2])
      const min = Math.min(data[i], data[i + 1], data[i + 2])
      if (max < 40) continue
      count++
      saturation += (max - min) / max
      chroma += max - min
    }
  return { pixels: count, meanSaturationHSV: saturation / count, meanChromaRGB: chroma / count }
}
const rmse = (a, b) => {
  let sum = 0,
    n = 0
  for (let y = 140; y < 740; y++)
    for (let x = 680; x < 1850; x++)
      for (let c = 0; c < 3; c++) {
        const i = (y * 2560 + x) * 3 + c
        sum += (a[i] - b[i]) ** 2
        n++
      }
  return Math.sqrt(sum / n)
}
const flatPatch = data => {
  const sum = [0, 0, 0]
  let n = 0
  for (let y = 920; y < 960; y++)
    for (let x = 500; x < 650; x++) {
      const i = (y * 2560 + x) * 3
      for (let c = 0; c < 3; c++) sum[c] += data[i + c]
      n++
    }
  return sum.map(v => Number((v / n).toFixed(3)))
}
const controlled = {}
for (const format of ['yuv420p', 'yuv444p']) {
  const file = path.join(dir, `controle-${format}.mkv`)
  run([
    '-y',
    '-i',
    shot,
    '-frames:v',
    '1',
    '-vf',
    `scale=iw:ih:out_color_matrix=bt709:out_range=tv,format=${format}`,
    '-c:v',
    'libx264',
    '-preset',
    'ultrafast',
    '-crf',
    '0',
    '-threads',
    '2',
    '-color_range',
    'tv',
    '-colorspace',
    'bt709',
    '-color_trc',
    'bt709',
    '-color_primaries',
    'bt709',
    file,
  ])
  const decoded = rgb(file)
  controlled[format] = { rmseRGB: rmse(ref, decoded), ...stats(decoded) }
}
const metadata = JSON.parse(
  execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=pix_fmt,color_range,color_space,color_transfer,color_primaries',
      '-of',
      'json',
      recording,
    ],
    { encoding: 'utf8' },
  ),
)
const report = {
  recording: metadata.streams[0],
  method:
    'Original screenshot versus controlled H.264 CRF 0 roundtrip of the same PNG. Same BT.709 matrix and TV range; only chroma sampling changes. Actual footage uses a different animation time: compare distributions rather than pixel RMSE.',
  originalScreenshot: stats(ref),
  originalRecording: stats(video),
  controlled,
  flatUIPatch: { original: flatPatch(ref), recorded: flatPatch(video) },
  correction:
    'Remotion: saturate(1.4), brightness/gamma unchanged. Rec.709 4:4:4 master. Editorial compensation does not restore discarded data.',
}
writeFileSync(path.join(dir, 'analise-cor.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
