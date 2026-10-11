/**
 * @ascii-engine/core — 3D convertido em ASCII, com as letras presas às coisas.
 *
 * Ponto de partida vazio. A fase 1 do START.md extrai para cá o núcleo do
 * Pomorog (reference/pomorog/src-visual): IDs de material, passe de tela,
 * letras na superfície, corpos de letras, tapete, partículas e água.
 */

/** Técnica de letras de um objeto. Explícita: a engine não adivinha pela cor. */
export type GlyphKind =
  | 'screen' // passe de tela (herói, criaturas articuladas)
  | 'surface' // letras na superfície local (construção, ponte, chão)
  | 'body' // nuvem de letras (copas, pedras, criaturas como corpo)
  | 'carpet' // tapete de letras de pé (grama, cobertura do chão)
  | 'particle' // partículas de glifos (fogo, faíscas, chuva, neve)
  | 'water' // água em letras com reflexo

export const ENGINE_VERSION = '0.0.0'

export { SURFACE_ALPHA, SURFACE_TOLERANCE, surfaceAlpha, tagSurface, type SurfaceKind } from './surface'
