import React from 'react';
import {Composition, Folder, registerRoot} from 'remotion';
import {Bookend, ChapterCard, ChapterVideo, FullVideo} from './Video';
import {CARD, FPS, HEIGHT, INTRO, OUTRO, WIDTH, chapterFrames, chapters, totalFrames} from './edit';

const Root = () => <>
  <Composition id="Completo" component={FullVideo} durationInFrames={totalFrames} fps={FPS} width={WIDTH} height={HEIGHT}/>
  <Folder name="Partes">{chapters.map((chapter, index) => <Composition key={chapter.id} id={chapter.id}
    component={ChapterVideo} defaultProps={{index}} durationInFrames={chapterFrames(chapter)} fps={FPS} width={WIDTH} height={HEIGHT}/>)}</Folder>
  <Folder name="Abertura-e-encerramento">
    <Composition id="Abertura" component={Bookend} durationInFrames={INTRO} fps={FPS} width={WIDTH} height={HEIGHT}/>
    <Composition id="Encerramento" component={Bookend} defaultProps={{outro: true}} durationInFrames={OUTRO} fps={FPS} width={WIDTH} height={HEIGHT}/>
  </Folder>
  <Folder name="Cartelas">{chapters.map((chapter, index) => <Composition key={chapter.id} id={`Cartela-${chapter.id}`} component={ChapterCard} defaultProps={{index}} durationInFrames={CARD} fps={FPS} width={WIDTH} height={HEIGHT}/>)}</Folder>
</>;
registerRoot(Root);
