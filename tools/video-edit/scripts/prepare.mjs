import {copyFile, mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const media = path.resolve(process.env.ASCII_VIDEO_SOURCE ?? '/home/jonny/Videos/ASCII-Engine-2026-10-11');
const input = path.join(media, 'ASCII-Engine-criacao-completa.mp4');
const probe = JSON.parse(execFileSync('ffprobe', ['-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate','-of','json', input], {encoding:'utf8'})).streams[0];
if (probe.width !== 2560 || probe.height !== 1080 || probe.r_frame_rate !== '30/1') {
  throw new Error('Esta edição exige a captura original de 2560×1080 a 30 fps. Ajuste a composição para usar outra gravação.');
}
await mkdir(path.join(project, 'public'), {recursive: true});
await copyFile(input, path.join(project, 'public/recording.mp4'));
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', '306', '-i', path.join(media, 'ASCII-Engine-criacao-completa.mp4'), '-frames:v', '1', '-vf', 'crop=1180:610:674:134', path.join(project, 'public/result.png')]);
await writeFile(path.join(project, 'public/source.json'), JSON.stringify({directory: media}, null, 2));
console.log('Mídia preparada. Originais preservados em:', media);
