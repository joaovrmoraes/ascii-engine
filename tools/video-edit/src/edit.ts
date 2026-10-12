export const FPS = 30;
export const WIDTH = 2560;
export const HEIGHT = 1440;
export const CARD = 54;
// A nova captura é I444 desde o OBS: manter as cores, sem compensar saturação.
export const SATURATION = 1;
export const COLOR_FILTER = `saturate(${SATURATION})`;
export const SCENE_TITLE = 'Margem Viva';
export const SCENE_LINES = ['Margem', 'Viva'];
export const MAP_FILE = 'Margem-Viva.ascii.json';
export const SOURCE_DIRECTORY = '/home/jonny/Videos/ASCII-Engine-Closeup-2026-10-11';
export const POSTER_SECOND = 445;
export const POSTER_CROP = '1180:610:646:134';


export type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  start: number;
  end: number;
  speed: number;
  notes: {at: number; title: string; detail: string}[];
};

export const chapters: Chapter[] = [
  {id: '01-Terreno', title: 'Dar forma ao terreno', subtitle: 'A câmera acompanha a área de trabalho.',
    color: '#b8d591', start: 0, end: 44.366667, speed: 1.2,
    notes: [
      {at: 0, title: 'Margem Viva', detail: 'Criar um mapa e preparar a composição.'},
      {at: 25.366, title: 'Relevo de perto', detail: 'Esculpir e suavizar a encosta com o pincel.'},
    ]},
  {id: '02-Agua', title: 'Água, caminho e vento', subtitle: 'Tempo para enxergar a cena se movendo.',
    color: '#91cbd4', start: 44.366667, end: 126.833333, speed: 1,
    notes: [
      {at: 44.366, title: 'Pincel de água', detail: 'Desenhar o lago e conferir a margem de perto.'},
      {at: 71.699, title: 'Abrir um caminho', detail: 'Pintar a trilha e a clareira junto à água.'},
      {at: 101.633, title: 'Grama ao vento', detail: 'Plano baixo e próximo · movimento em velocidade normal.'},
    ]},
  {id: '03-Objetos', title: 'Compor com objetos', subtitle: 'Construir a margem com árvores, pedras e ruínas.',
    color: '#c5c895', start: 126.833333, end: 209.533333, speed: 1.3,
    notes: [
      {at: 126.833, title: 'Biblioteca de objetos', detail: 'Escolher o asset, ver a prévia 3D e posicionar na cena.'},
      {at: 162, title: 'Pedras na margem', detail: 'Usar os objetos para dar escala ao terreno e ao lago.'},
      {at: 181, title: 'Ruína e tronco', detail: 'Completar a composição e ajustar a rotação pelo inspetor.'},
    ]},
  {id: '04-Efeito-e-luz', title: 'Criar um efeito com luz', subtitle: 'Uma fogueira feita de letras, camada por camada.',
    color: '#eab27a', start: 209.533333, end: 284.233333, speed: 1,
    notes: [
      {at: 209.533, title: 'Estúdio de efeitos', detail: 'Começar pelo fogo em uma prévia isolada e próxima.'},
      {at: 222.633, title: 'Luz própria', detail: 'Regular intensidade, alcance e altura da iluminação.'},
      {at: 235.733, title: 'Fagulhas ascendentes', detail: 'Editar as camadas, a origem e a quantidade de partículas.'},
      {at: 250.199, title: 'Salvar nos Assets', detail: 'Reutilizar o efeito e posicionar na margem.'},
      {at: 274.699, title: 'Fogo em movimento', detail: 'Câmera parada · chama, fagulhas e luz em tempo real.'},
    ]},
  {id: '05-Atmosfera', title: 'Construir a atmosfera', subtitle: 'Direção da luz, cor e profundidade.',
    color: '#b2bde4', start: 284.233333, end: 355.766667, speed: 1.15,
    notes: [
      {at: 284.233, title: 'Estúdio de atmosfera', detail: 'Comparar o entardecer e o luar sobre a mesma cena.'},
      {at: 311.499, title: 'Direção e intensidade', detail: 'Ajustar exposição, rotação e altura da luz.'},
      {at: 324.399, title: 'Sombras e névoa', detail: 'Equilibrar luz ambiente e profundidade.'},
      {at: 336.799, title: 'Atmosfera nos Assets', detail: 'Salvar Luar da Margem Viva e aplicar no mapa.'},
    ]},
  {id: '06-Camera-e-exportacao', title: 'Enquadrar de perto', subtitle: 'A cena ganha uma câmera própria.',
    color: '#94d2b5', start: 355.766667, end: 452.8, speed: 1,
    notes: [
      {at: 355.766, title: 'Ondulação suave', detail: 'Aproximar a vista e ajustar a água pelo inspetor.'},
      {at: 379.199, title: 'Água em tempo real', detail: 'Observar as ondas e o reflexo com a câmera parada.'},
      {at: 396.533, title: 'Câmera da cena', detail: 'Prévia ao vivo · enquadramento de 6,5 metros em 16:9.'},
      {at: 428.899, title: 'Salvar e exportar', detail: 'Guardar o mapa editável e gerar a cena para o Pomorog.'},
      {at: 438.433, title: 'Margem Viva', detail: 'Grama, água, reflexos e fogo · resultado em velocidade normal.'},
    ]},
];

export const bodyFrames = (chapter: Chapter) => Math.ceil((chapter.end - chapter.start) * FPS / chapter.speed);
export const chapterFrames = (chapter: Chapter) => CARD + bodyFrames(chapter) + 12;
export const INTRO = 120;
export const OUTRO = 120;
export const totalFrames = INTRO + chapters.reduce((n, c) => n + chapterFrames(c), 0) + OUTRO;
