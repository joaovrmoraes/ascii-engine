import {spawnSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {chapters, bodyFrames, FPS, SOURCE_DIRECTORY, SATURATION} from '../src/edit.ts';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(process.env.ASCII_VIDEO_OUTPUT ?? path.join(SOURCE_DIRECTORY, 'edicao'));
const intermediate = path.join(output, 'masters');
mkdirSync(intermediate, {recursive: true});
const ffmpeg = args => {
  const result = spawnSync('ffmpeg', ['-hide_banner','-loglevel','error','-nostdin','-y','-threads','2',...args], {encoding:'utf8',maxBuffer:8*1024*1024});
  if (result.status !== 0) throw new Error(result.stderr);
};

for (const chapter of chapters) {
  const frames = bodyFrames(chapter);
  const args = ['-ss',String(chapter.start),'-t',String(chapter.end-chapter.start),'-i',path.join(project,'public/recording.mp4')];
  for (const j of chapter.notes.keys()) args.push('-i',path.join(output,'previas',`${chapter.id}-faixa-${j}.png`));
  // Matriz RGB de saturação preserva luminância, como o filtro CSS do Remotion.
  // Entrar/sair explicitamente de BT.709 evita a interpretação implícita de YUV.
  const color = SATURATION === 1 ? 'format=yuv444p' : 'scale=in_color_matrix=bt709:out_range=pc,format=gbrp,colorchannelmixer=rr=1.31496:rg=-0.28608:rb=-0.02888:gr=-0.08504:gg=1.11392:gb=-0.02888:br=-0.08504:bg=-0.28608:bb=1.37112,scale=out_color_matrix=bt709:out_range=tv,format=yuv444p';
  const graph = [`[0:v]setpts=(PTS-STARTPTS)/${chapter.speed},fps=${FPS},${color},pad=2560:1440:0:180:color=0x0b0e0d,tpad=stop_mode=clone:stop_duration=1,trim=end_frame=${frames+12},setpts=PTS-STARTPTS[v0]`];
  chapter.notes.forEach((note,j) => {
    const start = Math.max(0,(note.at-chapter.start)/chapter.speed);
    graph.push(`[${j+1}:v]scale=iw:ih:out_color_matrix=bt709:out_range=tv,format=yuva444p[g${j}]`);
    graph.push(`[v${j}][g${j}]overlay=0:0:format=yuv444:eof_action=repeat:enable='gte(t,${start})'[v${j+1}]`);
  });
  graph.push(`color=c=${chapter.color.replace('#','0x')}:s=2560x4:r=${FPS},format=yuv444p[bar]`);
  graph.push(`[v${chapter.notes.length}][bar]overlay=x='-w+min(t/${frames/FPS},1)*w':y=H-4:format=yuv444:shortest=1,fade=t=in:st=0:d=0.3,fade=t=out:st=${frames/FPS}:d=0.4[out]`);
  const body = path.join(intermediate, `${chapter.id}-body.mp4`);
  args.push('-filter_complex_threads','1','-filter_complex',graph.join(';'),'-map','[out]','-frames:v',String(frames+12),'-an',
    '-c:v','libx264','-threads','2','-preset','veryfast','-crf','14','-pix_fmt','yuv444p','-r',String(FPS),'-video_track_timescale','90000',
    '-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709',body);
  ffmpeg(args);
  const concat = path.join(intermediate, `${chapter.id}-concat.txt`);
  writeFileSync(concat, `file 'Cartela-${chapter.id}.mp4'\nfile '${chapter.id}-body.mp4'\n`);
  ffmpeg(['-f','concat','-safe','0','-i',concat,'-map','0:v:0','-c:v','copy','-an','-movflags','+faststart',path.join(intermediate,`${chapter.id}.mp4`)]);
  console.log('Parte montada:', chapter.id);
}
