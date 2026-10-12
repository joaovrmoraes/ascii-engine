export const FPS = 30;
export const WIDTH = 2560;
export const HEIGHT = 1440;
export const CARD = 54;
// Correção editorial moderada. Não recupera a crominância perdida no OBS.
export const SATURATION = 1.4;
export const COLOR_FILTER = `saturate(${SATURATION})`;
export const SCENE_TITLE = 'Lago das Brasas';
export const SCENE_LINES = ['Lago das', 'Brasas'];
export const MAP_FILE = 'Lago-das-Brasas.ascii.json';
export const SOURCE_DIRECTORY = '/home/jonny/Videos/ASCII-Engine-2026-10-11';
export const POSTER_SECOND = 306;
export const POSTER_CROP = '1180:610:674:134';

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
  {id: '01-Terreno', title: 'Dar forma ao terreno', subtitle: 'Um mapa vazio começa a ganhar relevo.',
    color: '#b8d591', start: 1.6, end: 43, speed: 1.25,
    notes: [
      {at: 0, title: 'Novo mapa', detail: 'Nomear a cena e preparar o espaço de trabalho.'},
      {at: 19, title: 'Esculpir', detail: 'Tamanho e força do pincel controlam o relevo.'},
      {at: 34, title: 'Suavizar', detail: 'Integrar as elevações antes de pintar a água.'},
    ]},
  {id: '02-Agua', title: 'Pintar água e caminhos', subtitle: 'O lago e a trilha organizam a cena.',
    color: '#91cbd4', start: 43, end: 79.1, speed: 1.15,
    notes: [
      {at: 43, title: 'Pincel de água', detail: 'Desenhar o contorno do lago com traços contínuos.'},
      {at: 55, title: 'Camadas do chão', detail: 'Pintar a trilha e abrir uma clareira na margem.'},
      {at: 72, title: 'Órbita 3D', detail: 'Conferir o terreno e a água por outro ângulo.'},
    ]},
  {id: '03-Objetos', title: 'Compor com objetos', subtitle: 'Árvores, pedras e ruínas dão escala ao lugar.',
    color: '#c5c895', start: 79.1, end: 136.433333, speed: 1.4,
    notes: [
      {at: 79.1, title: 'Da biblioteca para a cena', detail: 'Escolher o asset e posicionar sua prévia 3D.'},
      {at: 100, title: 'Construir a margem', detail: 'Distribuir as pedras entre as árvores e o lago.'},
      {at: 117, title: 'Transformações', detail: 'Posicionar a ruína e girar o tronco no inspetor.'},
    ]},
  {id: '04-Efeito-e-luz', title: 'Criar um efeito com luz', subtitle: 'Uma fogueira feita de letras, camada por camada.',
    color: '#eab27a', start: 136.433333, end: 191.066667, speed: 1.15,
    notes: [
      {at: 136.4, title: 'Estúdio de efeitos', detail: 'Começar pelo modelo de fogo em uma prévia isolada.'},
      {at: 148, title: 'Luz própria', detail: 'Ajustar intensidade, alcance e altura da iluminação.'},
      {at: 161, title: 'Camadas e movimento', detail: 'Regular o tamanho das letras e a emissão de fagulhas.'},
      {at: 175, title: 'Salvar nos Assets', detail: 'Reutilizar o efeito e posicioná-lo na margem do lago.'},
    ]},
  {id: '05-Atmosfera', title: 'Construir a atmosfera', subtitle: 'A mesma cena, outra hora e outra sensação.',
    color: '#b2bde4', start: 191.066667, end: 244.2, speed: 1.25,
    notes: [
      {at: 191, title: 'Estúdio de atmosfera', detail: 'Comparar o entardecer com a iluminação de luar.'},
      {at: 207, title: 'Direção da luz', detail: 'Controlar exposição, intensidade, rotação e altura.'},
      {at: 223, title: 'Profundidade e cor', detail: 'Ajustar sombras, luz ambiente e densidade da névoa.'},
      {at: 235, title: 'Uma atmosfera reutilizável', detail: 'Salvar o preset nos Assets e aplicar na cena.'},
    ]},
  {id: '06-Camera-e-exportacao', title: 'Enquadrar e exportar', subtitle: 'A composição vira uma cena pronta para reutilizar.',
    color: '#94d2b5', start: 244.2, end: 310.6, speed: 1.15,
    notes: [
      {at: 244.2, title: 'Ondas suaves', detail: 'Ajustar a água e testar uma perturbação na superfície.'},
      {at: 263, title: 'Câmera da cena', detail: 'Criar, nomear e escolher o formato do enquadramento.'},
      {at: 278, title: 'Prévia ao vivo', detail: 'A miniatura acompanha os ajustes de posição e direção.'},
      {at: 294, title: 'Salvar e exportar', detail: 'Guardar o mapa editável e gerar o arquivo para o Pomorog.'},
      {at: 302, title: 'Lago das Brasas', detail: 'Conferir o resultado pela câmera inicial da cena.'},
    ]},
];

export const bodyFrames = (chapter: Chapter) => Math.ceil((chapter.end - chapter.start) * FPS / chapter.speed);
export const chapterFrames = (chapter: Chapter) => CARD + bodyFrames(chapter) + 12;
export const INTRO = 120;
export const OUTRO = 120;
export const totalFrames = INTRO + chapters.reduce((n, c) => n + chapterFrames(c), 0) + OUTRO;
