/** Small editor symbols, independent of the ASCII art in the scene. */
const paths: Record<string, string> = {
  cursor: '<path d="m5 3 13 9-6 1-3 6z"/>',
  move: '<path d="M12 3v18M3 12h18m-12-6 3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3m12-6 3 3-3 3"/>',
  rotate: '<path d="M19 8a8 8 0 1 0 1 7M19 3v6h-6"/>',
  scale: '<path d="M4 14v6h6M20 10V4h-6M4 20l6-6m10-10-6 6"/><path d="M4 4h6v6H4z"/>',
  hand: '<path d="M8 12V6a2 2 0 0 1 3 0V4a2 2 0 0 1 3 0v2a2 2 0 0 1 3 0v3a2 2 0 0 1 3 0v5c0 5-3 7-7 7-3 0-5-2-7-5l-3-4c-1-2 1-3 2-2l3 2Z"/>',
  cube: '<path d="m12 3 9 5v9l-9 5-9-5V8zM3 8l9 5 9-5M12 13v9M7 5l10 6"/>',
  tree: '<path d="m12 2 7 9h-4l6 7H3l6-7H5zM12 18v4"/>',
  rock: '<path d="m3 16 4-10 9-3 6 12-5 6H8zM7 6l7 6 2-9M14 12l3 9M14 12 3 16"/>',
  fire: '<path d="M12 2c4 7-2 6 2 10 2-1 3-3 3-5 7 9 2 14-4 14-8 0-10-8-5-13 0 3 1 4 2 4 2-3-2-5 2-10Z"/>',
  bridge: '<path d="M2 10h20M2 14h20M4 6v13M20 6v13M8 10v4M12 10v4M16 10v4M4 7c5 4 11 4 16 0"/>',
  ruin: '<path d="M3 21V8h5V3h5v5h7v13M8 21v-7h7v7M3 12h5M13 8v3h7M8 3v5"/>',
  cylinder: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5"/><path d="M4 18c0 4 16 4 16 0"/>',
  spark: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>',
  terrain: '<path d="m2 20 7-15 5 8 3-5 5 12zM6 12l3 2 3-4"/>',
  water: '<path d="M2 7c4-5 5 5 10 0s6 4 10 0M2 13c4-5 5 5 10 0s6 4 10 0M2 19c4-5 5 5 10 0s6 4 10 0"/>',
  folder: '<path d="M2 5h8l2 3h10v12H2z"/>',
  import: '<path d="M12 2v13m-5-5 5 5 5-5M4 15v6h16v-6"/>',
  grid: '<path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  focus: '<path d="M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6"/><circle cx="12" cy="12" r="3"/>',
  save: '<path d="M4 3h13l4 4v14H3V3zM7 3v6h10V3M7 21v-8h10v8"/>',
  play: '<path d="m7 3 14 9-14 9z"/>',
  pause: '<path d="M7 4v16M17 4v16"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
}
export function icon(name: string) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.cube}</svg>` }
export function assetInfo(key: string) {
  if (key.startsWith('asset-')) return { category: 'Importados', icon: 'cube', color: '#a899dd' }
  if (key.startsWith('fx:')) return { category: 'Efeitos', icon: 'spark', color: '#d5ad62' }
  if (['bloco', 'cilindro', 'esfera'].includes(key)) return { category: 'Formas', icon: key === 'cilindro' ? 'cylinder' : key === 'esfera' ? 'rock' : 'cube', color: '#89accc' }
  if (['arvore', 'pedregulho', 'tronco-caido', 'pedras-em-pe'].includes(key)) return { category: 'Natureza', icon: key === 'arvore' ? 'tree' : key === 'tronco-caido' ? 'cylinder' : 'rock', color: key === 'arvore' ? '#8bb68d' : '#a6b1a0' }
  return { category: 'Construções', icon: key === 'ponte' ? 'bridge' : key === 'ruina' ? 'ruin' : key === 'fogueira' ? 'fire' : 'cube', color: '#c9aa81' }
}
