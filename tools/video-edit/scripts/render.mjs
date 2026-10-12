import {bundle} from '@remotion/bundler';
import {getCompositions, openBrowser, renderMedia, renderStill} from '@remotion/renderer';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chapters, bodyFrames, CARD, FPS, SOURCE_DIRECTORY} from '../src/edit.ts';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(process.env.ASCII_VIDEO_OUTPUT ?? path.join(SOURCE_DIRECTORY, 'edicao'));
const cache = path.join(project, '.cache');
await mkdir(cache, {recursive: true});
// Não usar o tmpfs do desktop para a sequência de quadros do Remotion.
process.env.TMPDIR = cache;
await mkdir(path.join(output, 'previas'), {recursive: true});
await mkdir(path.join(output, 'masters'), {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(project, 'src/index.tsx'), publicDir: path.join(project, 'public'), outDir: path.join(cache, process.argv.includes('--overlays') ? 'bundle-overlays' : 'bundle')});
const browser = await openBrowser('chrome', {browserExecutable: process.env.REMOTION_BROWSER ?? '/usr/bin/chromium', chromiumOptions: {headless: true}});
try {
  const compositions = await getCompositions(serveUrl, {puppeteerInstance: browser});
  await writeFile(path.join(output, 'composicoes.json'), JSON.stringify(compositions.map(({id, durationInFrames, fps, width, height}) => ({id, durationInFrames, fps, width, height})), null, 2));
  if (process.argv.includes('--stills')) {
    for (const [id, frame, name] of [['Abertura', 70, 'abertura'], ['01-Terreno', 30, 'cartela'], ['04-Efeito-e-luz', 500, 'efeito'], ['05-Atmosfera', 700, 'atmosfera'], ['06-Camera-e-exportacao', 1100, 'camera']]) {
      const composition = compositions.find(c => c.id === id);
      await renderStill({serveUrl, composition, puppeteerInstance: browser, frame, imageFormat: 'png', output: path.join(output, 'previas', `${name}.png`), offthreadVideoCacheSizeInBytes: 128 * 1024 * 1024});
      console.log('Prévia:', name);
    }
  } else if (process.argv.includes('--graphics') || process.argv.includes('--overlays')) {
    for (const [index, chapter] of chapters.entries()) {
      const composition = compositions.find(c => c.id === chapter.id);
      for (const [j, note] of chapter.notes.entries()) {
        const localFrame = Math.max(0, (note.at - chapter.start) * FPS / chapter.speed) + 18;
        await renderStill({serveUrl, composition: {...composition, props: {...composition.props, index, graphicsOnly: true}}, puppeteerInstance: browser, inputProps: {index, graphicsOnly: true},
          frame: CARD + Math.min(bodyFrames(chapter) - 1, Math.round(localFrame)), imageFormat: 'png',
          output: path.join(output, 'previas', `${chapter.id}-faixa-${j}.png`)});
      }
      console.log('Faixas:', chapter.id);
    }
    for (const composition of compositions.filter(c => !process.argv.includes('--overlays') && (c.id.startsWith('Cartela-') || ['Abertura', 'Encerramento'].includes(c.id)))) {
      await renderMedia({serveUrl, composition, puppeteerInstance: browser, codec: 'h264', pixelFormat: 'yuv444p', colorSpace: 'bt709', imageFormat: 'png',
        crf: 14, x264Preset: 'veryfast', concurrency: 1, ffmpegOverride: ({args}) => [...args.slice(0, -1), '-threads', '2', '-filter_threads', '1', args.at(-1)],
        muted: true, outputLocation: path.join(output, 'masters', `${composition.id}.mp4`)});
      console.log('Motion:', composition.id);
    }
  } else {
    const only = process.argv.find(a => a.startsWith('--only='))?.slice(7);
    const selected = compositions.filter(c => c.id !== 'Completo' && !c.id.startsWith('Cartela-') && (!only || c.id === only));
    for (const composition of selected) {
      let printed = -1;
      console.log('Renderizando:', composition.id, composition.durationInFrames, 'quadros');
      await renderMedia({serveUrl, composition, puppeteerInstance: browser,
        codec: 'h264', pixelFormat: 'yuv444p', colorSpace: 'bt709', imageFormat: 'png', crf: 14, x264Preset: 'veryfast',
        concurrency: 1, offthreadVideoCacheSizeInBytes: 64 * 1024 * 1024, offthreadVideoThreads: 1,
        ffmpegOverride: ({args}) => [...args.slice(0, -1), '-threads', '2', '-filter_threads', '1', args.at(-1)],
        muted: true, outputLocation: path.join(output, 'masters', `${composition.id}.mp4`),
        onProgress: ({progress}) => {const step = Math.floor(progress * 10); if (step !== printed) {printed = step; console.log(composition.id, `${step * 10}%`);}},
      });
    }
  }
} finally {await browser.close({silent: true});}
