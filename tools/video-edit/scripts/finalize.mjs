import {spawnSync} from 'node:child_process';
import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {SOURCE_DIRECTORY, SCENE_TITLE, MAP_FILE} from '../src/edit.ts';

const output = path.resolve(process.env.ASCII_VIDEO_OUTPUT ?? path.join(SOURCE_DIRECTORY, 'edicao'));
const run = (command, args) => {
  const result = spawnSync(command, args, {encoding: 'utf8', maxBuffer: 8 * 1024 * 1024});
  if (result.status !== 0) throw new Error(`${command}: ${result.stderr}`);
  return result.stdout;
};
const ffmpeg = args => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-threads', '2', ...args]);
const compositions = JSON.parse(readFileSync(path.join(output, 'composicoes.json'), 'utf8'));
const parts = compositions.filter(c => /^0[1-6]-/.test(c.id));
const list = [compositions.find(c => c.id === 'Abertura'), ...parts, compositions.find(c => c.id === 'Encerramento')];
let start = 0;
let metadata = `;FFMETADATA1\ntitle=${SCENE_TITLE} — full composition\n`;
const chapters = list.map(c => {
  const chapter = {id: c.id, startFrame: start, endFrame: start + c.durationInFrames, seconds: c.durationInFrames/c.fps};
  metadata += `\n[CHAPTER]\nTIMEBASE=1/${c.fps}\nSTART=${chapter.startFrame}\nEND=${chapter.endFrame}\ntitle=${c.id.replaceAll('-', ' ')}\n`;
  start = chapter.endFrame;
  return chapter;
});
const meta = path.join(output, 'capitulos.ffmeta');
writeFileSync(meta, metadata);
writeFileSync(path.join(output, 'capitulos-editados.json'), JSON.stringify(chapters, null, 2));
// Relative paths use internal IDs, without user text in concat syntax.
const concat = path.join(output, 'masters/concat.txt');
writeFileSync(concat, list.map(c => `file '${c.id}.mp4'`).join('\n'));
const master = path.join(output, 'ASCII-Engine-editado-master-444.mp4');
ffmpeg(['-f','concat','-safe','0','-i',concat,'-i',meta,'-map','0:v:0','-map_metadata','1','-map_chapters','1','-c:v','copy','-an','-movflags','+faststart', master]);
console.log('Full master assembled without re-encoding.');
mkdirSync(path.join(output, 'partes'), {recursive: true});
// Encode the compatible output once, with exact chapter keyframes.
const compatibleDir = path.join(output, 'masters/compat');
mkdirSync(compatibleDir, {recursive: true});
const cuts = chapters.slice(1).map(c => (c.startFrame/30).toFixed(9)).join(',');
ffmpeg(['-i',master,'-map','0:v:0','-map_metadata','-1','-map_chapters','-1',
  '-vf','scale=iw:ih:in_color_matrix=bt709:out_color_matrix=bt709:in_range=tv:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int',
  '-c:v','libx264','-preset','fast','-crf','16','-threads','4','-filter_threads','1','-bf','0','-pix_fmt','yuv420p',
  '-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-an','-force_key_frames',cuts,
  '-f','segment','-segment_times',cuts,'-segment_time_delta','0.016667','-reset_timestamps','1',
  '-segment_format','mp4','-segment_format_options','movflags=+faststart',path.join(compatibleDir,'%02d.mp4')]);
const compatibleConcat = path.join(compatibleDir, 'concat.txt');
writeFileSync(compatibleConcat, list.map((_,i) => `file '${String(i).padStart(2,'0')}.mp4'`).join('\n'));
ffmpeg(['-f','concat','-safe','0','-i',compatibleConcat,'-i',meta,'-map','0:v:0','-map_metadata','1','-map_chapters','1','-c:v','copy','-an','-movflags','+faststart',path.join(output,'ASCII-Engine-editado.mp4')]);
parts.forEach((c,i) => copyFileSync(path.join(compatibleDir,`${String(i+1).padStart(2,'0')}.mp4`),path.join(output,'partes',`${c.id}.mp4`)));
const deliveries = [{file: 'ASCII-Engine-editado.mp4', expectedFrames: start}, ...parts.map(c => ({file: `partes/${c.id}.mp4`, expectedFrames: c.durationInFrames}))];
const validation = [];
for (const delivery of deliveries) {
  const file = path.join(output, delivery.file);
  const probe = JSON.parse(run('ffprobe', ['-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=codec_name,width,height,pix_fmt,color_space,color_range,r_frame_rate,nb_read_frames:format=duration,size','-of','json',file]));
  if (Number(probe.streams[0].nb_read_frames) !== delivery.expectedFrames) throw new Error(`Unexpected frame count: ${delivery.file}`);
  // Fully decode with fatal errors enabled, in addition to counting frames.
  ffmpeg(['-xerror','-i',file,'-map','0:v:0','-f','null','-']);
  validation.push({file: delivery.file, expectedFrames: delivery.expectedFrames, ...probe, fullDecode: 'passed'});
  writeFileSync(path.join(output, 'validacao-edicao.json'), JSON.stringify(validation, null, 2));
  console.log('Validated:', delivery.file);
}
ffmpeg(['-xerror','-i',master,'-map','0:v:0','-f','null','-']);
writeFileSync(path.join(output, 'validacao-master.txt'), '4:4:4 master: full decoding passed.\n');
const names = ['Terrain', 'Water and paths', 'Objects', 'Effects and lighting', 'Atmosphere', 'Cameras and export'];
const playlist = [{file: 'ASCII-Engine-editado.mp4', title: 'Full film', length: Math.round(start/30)}, ...parts.map((c,i) => ({file:`partes/${c.id}.mp4`,title:`0${i+1} · ${names[i]}`,length:Math.round(c.durationInFrames/30)}))];
writeFileSync(path.join(output, 'index.html'), `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${SCENE_TITLE} — ASCII Engine</title>
<style>*{box-sizing:border-box}body{margin:0;background:#0b0e0d;color:#edf0e6;font:16px system-ui}main{max-width:1440px;margin:auto;padding:36px}h1{font-size:clamp(32px,5vw,60px);letter-spacing:-2px;margin:16px 0}header span{font-family:monospace;color:#b8d591;letter-spacing:3px}p{color:#a7ada6;line-height:1.6}video{width:100%;background:#000;border:1px solid #293129}nav{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}button,a{color:#edf0e6;background:#151d17;border:1px solid #344336;border-radius:6px;padding:12px 16px;cursor:pointer;text-decoration:none;font:inherit}button.active{background:#b8d591;color:#0b0e0d}footer{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.note{font-size:14px;max-width:900px}</style>
<main><header><span>{·} ASCII ENGINE / 06 CHAPTERS</span><h1>${SCENE_TITLE}.</h1><p>From the first brush stroke to the final frame. Close-up source footage edited with Remotion; grass, water and fire move in real time. The historical captured interface is Portuguese.</p></header>
<video id="player" controls preload="metadata" src="ASCII-Engine-editado.mp4"></video><nav id="chapters"></nav>
<p id="label">Full film · ${Math.floor(start/30/60)}min${String(Math.round(start/30)%60).padStart(2,'0')}</p>
<footer><a href="ASCII-Engine-editado.mp4" download>Download film</a><a href="ASCII-Engine-editado-master-444.mp4" download>Master 4:4:4</a><a href="../${MAP_FILE}" download>Editable map</a></footer>
<p class="note">2560×1440 · 30 fps · no audio. Compatible MP4s use 4:2:0. The 4:4:4 master preserves fine-glyph color better and requires a compatible player. Original capture is 4:4:4 without saturation compensation.</p></main>
<script>const items=${JSON.stringify(playlist)};const player=document.getElementById('player');items.forEach((item,i)=>{const b=document.createElement('button');b.textContent=item.title;b.className=i===0?'active':'';b.onclick=()=>{document.querySelectorAll('button').forEach(n=>n.classList.remove('active'));b.classList.add('active');player.src=item.file;player.play().catch(()=>{});document.getElementById('label').textContent=item.title+' · '+Math.floor(item.length/60)+'min'+String(item.length%60).padStart(2,'0');};document.getElementById('chapters').append(b);});</script></html>`);
console.log('Local gallery and deliveries ready:', output);
