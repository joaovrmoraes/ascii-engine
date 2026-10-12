import React from 'react';
import {AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CARD, Chapter, COLOR_FILTER, FPS, INTRO, OUTRO, SCENE_TITLE, SCENE_LINES, bodyFrames, chapterFrames, chapters} from './edit';

const ink = '#edf0e6';
const muted = '#a7ada6';
const base = '#0b0e0d';
const ease = Easing.bezier(0.2, 0, 0, 1);
const motion = (frame: number, start = 0, end = 18) => interpolate(frame, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const root: React.CSSProperties = {backgroundColor: base, color: ink, fontFamily: 'Arial, sans-serif', overflow: 'hidden'};
const mono: React.CSSProperties = {fontFamily: '"JetBrains Mono", monospace'};

const GlyphField: React.FC<{color: string}> = ({color}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', right: 80, top: 160, color, ...mono, fontSize: 31, lineHeight: '45px', letterSpacing: 12, whiteSpace: 'pre', opacity: 0.28, transform: `translateY(${Math.sin(f / 55) * 6}px)`}}>
    {Array.from({length: 22}, (_, y) => Array.from({length: 32}, (_, x) => {
      const wave = Math.sin(x * .27 + y * .37 + f * .016);
      return '  .:-~+=*'[Math.min(8, Math.floor((wave + 1) * 4.4))];
    }).join('')).join('\n')}
  </div>;
};

const Brand: React.FC = () => <div style={{display: 'flex', alignItems: 'center', gap: 18, ...mono, fontSize: 26, letterSpacing: 2}}><span style={{color: '#b8d591', fontSize: 35}}>{'{·}'}</span> ASCII ENGINE</div>;

const Card: React.FC<{chapter: Chapter; index: number}> = ({chapter, index}) => {
  const f = useCurrentFrame();
  const enter = motion(f, 0, 17);
  const leave = interpolate(f, [CARD - 9, CARD], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{...root, opacity: leave}}>
    <GlyphField color={chapter.color}/>
    <div style={{position: 'absolute', top: 72, left: 96}}><Brand/></div>
    <div style={{position: 'absolute', top: 400, left: 160, opacity: enter, transform: `translateY(${(1-enter)*32}px)`}}>
      <div style={{...mono, color: chapter.color, fontSize: 26, letterSpacing: 5}}>CHAPTER {String(index + 1).padStart(2, '0')} / 06</div>
      <div style={{fontSize: 100, letterSpacing: -4, fontWeight: 700, marginTop: 35}}>{chapter.title}</div>
      <div style={{fontSize: 36, color: muted, marginTop: 30}}>{chapter.subtitle}</div>
      <div style={{height: 4, width: 130 * motion(f, 6, 26), background: chapter.color, marginTop: 58}}/>
    </div>
    <div style={{position: 'absolute', bottom: 100, left: 160, ...mono, fontSize: 22, color: muted}}>{SCENE_TITLE.toUpperCase()}  /  ASCII 3D COMPOSITION</div>
  </AbsoluteFill>;
};

const Footage: React.FC<{chapter: Chapter; index: number; graphicsOnly?: boolean}> = ({chapter, index, graphicsOnly = false}) => {
  const f = useCurrentFrame();
  const length = bodyFrames(chapter);
  const sourceTime = chapter.start + f / FPS * chapter.speed;
  const note = [...chapter.notes].reverse().find(n => n.at <= sourceTime) ?? chapter.notes[0];
  const noteStart = Math.max(0, (note.at - chapter.start) * FPS / chapter.speed);
  const noteMotion = motion(f, noteStart, noteStart + 13);
  const fade = Math.min(motion(f, 0, 9), interpolate(f, [length-1, length+11], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return <AbsoluteFill style={{...root, backgroundColor: graphicsOnly ? 'transparent' : base, opacity: graphicsOnly ? 1 : fade}}>
    <div style={{position: 'absolute', top: 0, width: 2560, height: 180, background: base}}/>
    <div style={{position: 'absolute', top: 1260, width: 2560, height: 180, background: base}}/>
    <div style={{position: 'absolute', left: 72, top: 44}}><Brand/></div>
    <div style={{position: 'absolute', left: 760, top: 39, fontSize: 40, fontWeight: 600, letterSpacing: -.7}}>{chapter.title}</div>
    <div style={{position: 'absolute', top: 55, right: 72, color: chapter.color, ...mono, fontSize: 23}}>0{index+1} / 06</div>
    <div style={{position: 'absolute', top: 129, height: 2, left: 0, width: 2560, background: '#293129'}}/>
    <div style={{position: 'absolute', top: 180, width: 2560, height: 1080, overflow: 'hidden'}}>
      {!graphicsOnly && <Freeze frame={Math.min(f, length - 1)}><OffthreadVideo src={staticFile('recording.mp4')} trimBefore={Math.round(chapter.start * FPS)}
        durationInFrames={Math.round((chapter.end-chapter.start) * FPS)} playbackRate={chapter.speed} muted
        style={{width: 2560, height: 1080, filter: COLOR_FILTER}}/></Freeze>}
    </div>
    <div style={{position: 'absolute', top: 1295, left: 72, right: 72, display: 'flex', alignItems: 'center', gap: 30, opacity: graphicsOnly ? 1 : noteMotion, transform: `translateY(${graphicsOnly ? 0 : (1-noteMotion)*12}px)`}}>
      <div style={{width: 5, height: 65, background: chapter.color}}/>
      <div><div style={{fontSize: 30, color: chapter.color, fontWeight: 600}}>{note.title}</div><div style={{fontSize: 25, marginTop: 10, color: muted}}>{note.detail}</div></div>
      <div style={{marginLeft: 'auto', ...mono, color: muted, fontSize: 18}}>LIVE EDITOR · {chapter.speed.toFixed(2)}×</div>
    </div>
    {!graphicsOnly && <div style={{position: 'absolute', bottom: 0, left: 0, height: 4, background: chapter.color, width: 2560 * Math.min(1, f / length)}}/>}
  </AbsoluteFill>;
};

export const ChapterVideo: React.FC<{index: number; graphicsOnly?: boolean}> = ({index, graphicsOnly = false}) => {
  const chapter = chapters[index];
  return <AbsoluteFill style={{...root, backgroundColor: graphicsOnly ? 'transparent' : base}}>
    <Sequence durationInFrames={CARD}><Card chapter={chapter} index={index}/></Sequence>
    <Sequence from={CARD} durationInFrames={bodyFrames(chapter)+12}><Footage chapter={chapter} index={index} graphicsOnly={graphicsOnly}/></Sequence>
  </AbsoluteFill>;
};

export const ChapterCard: React.FC<{index: number}> = ({index}) => <Card chapter={chapters[index]} index={index}/>;

export const Bookend: React.FC<{outro?: boolean}> = ({outro = false}) => {
  const f = useCurrentFrame();
  const enter = motion(f, 3, 27);
  const fade = interpolate(f, [0, 10, 108, 119], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{...root, opacity: fade}}>
    <div style={{position: 'absolute', width: 1610, height: 1440, right: 0, overflow: 'hidden'}}>
      <Img src={staticFile('result.png')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '62% 50%', opacity: .64, filter: COLOR_FILTER, transform: `scale(${1 + f * .00013})`}}/>
      <div style={{position:'absolute', inset: 0, background: 'linear-gradient(90deg, #0b0e0d, #0b0e0d00 46%)'}}/>
    </div>
    <div style={{position: 'absolute', top: 72, left: 96}}><Brand/></div>
    <div style={{position: 'absolute', left: 125, top: 450, opacity: enter, transform: `translateY(${(1-enter)*28}px)`}}>
      <div style={{...mono, color:'#b8d591', fontSize:25, letterSpacing:5}}>{outro ? 'MAP SAVED · SCENE EXPORTED' : 'ONE SCENE, START TO FINISH'}</div>
      <div style={{fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 1.07, marginTop: 36}}>{SCENE_LINES[0]}<br/>{SCENE_LINES[1]}<span style={{color: '#b8d591'}}>.</span></div>
      <div style={{fontSize: 33, color: muted, marginTop: 40, maxWidth: 800, lineHeight: 1.5, whiteSpace: 'pre-line'}}>{outro ? 'Terrain, water, effects and atmosphere.\nAll in the same project.' : 'From the first brush stroke to the final frame.'}</div>
    </div>
    <div style={{position: 'absolute', left: 125, bottom: 95, ...mono, color: muted, fontSize: 21}}>3D COMPOSITION MADE OF LETTERS  /  {outro ? 'ASCII ENGINE' : '06 CHAPTERS'}</div>
  </AbsoluteFill>;
};

export const FullVideo: React.FC = () => {
  let from = INTRO;
  return <AbsoluteFill style={root}>
    <Sequence durationInFrames={INTRO}><Bookend/></Sequence>
    {chapters.map((chapter, index) => {
      const start = from;
      from += chapterFrames(chapter);
      return <Sequence key={chapter.id} from={start} durationInFrames={chapterFrames(chapter)}><ChapterVideo index={index}/></Sequence>;
    })}
    <Sequence from={from} durationInFrames={OUTRO}><Bookend outro/></Sequence>
  </AbsoluteFill>;
};
