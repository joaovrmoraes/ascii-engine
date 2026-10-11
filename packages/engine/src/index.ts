/**
 * @ascii-engine/core — 3D convertido em ASCII, com as letras presas às coisas.
 * Núcleo extraído do Pomorog (reference/pomorog/src-visual). Não importa jogo,
 * UI nem Tauri; efeitos de bioma entram por ganchos (`AsciiPassHook`) ou presets.
 */
export const ENGINE_VERSION = '0.1.0'

export { createAsciiEngine, type AsciiEngine, type AsciiEngineOptions, type AddOptions } from './engine'
export { mergeGlyphStyles, nodeGlyphStyle, resolveGlyphStyle, type GlyphKind, type GlyphStyle, type ObjectTypeStyle, type StyleLayers } from './style'
export { SURFACE_ALPHA, SURFACE_TOLERANCE, surfaceAlpha, tagSurface, type SurfaceKind } from './surface'
export { createAsciiPass, type AsciiPassHook } from './ascii'
export { createIllumination, illuminationGLSL, illuminationUniforms, type IlluminationOptions } from './illumination'
export { createExploration, type LightObstacle, type LightSource } from './exploration'
export { surfaceMaterial, surfaceAtlas, SURFACE_ALPHABETS, SURFACE_CELL, SURFACE_INK, SURFACE_RANGES } from './techniques/surface'
export { glyphBody, removeGlyphBody, updateGlyphBodies, bodyUniforms, BODY_RAMPS, type BodyRamp, type BodyUniforms } from './techniques/body'
export { createCarpet, CARPET_GLYPHS, type Carpet, type GroundCover } from './techniques/carpet'
export { createGlyphCloud, PARTICLE_GLYPHS, type GlyphCloud } from './techniques/particle'
export { markScreen } from './techniques/screen'
export { pomorog, pomorogInterior, pomorogSpan, forestMeadowCover, forestFloorMaterial, campClearing, type AsciiStyle } from './presets/pomorog'
export { createCampfire, POMOROG_FIRE, type HeatGridSpec } from './presets/campfire'
export { createWater, createWaterReflection, updateReflectionCamera, waterEdge, waterEdgeGLSL, waterLettersGLSL, waterVec4, FOREST_WATER, type Water, type WaterLook, type WaterOptions, type WaterShape } from './techniques/water'
export { createCircuit, circuitGLSL, type Circuit } from './world/circuit'
export { createChunkStreamer, type ChunkStreamerOptions } from './world/chunks'
export { pushFireflies, pushLanternMotes, createDustTrail } from './presets/ambient'
