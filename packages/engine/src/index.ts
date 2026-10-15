/** Generic ASCII renderer. Optional appearance libraries live in ./presets and ./pomorog. */
export const ENGINE_VERSION = '0.1.0'

export {
  createAsciiEngine,
  type AsciiEngine,
  type AsciiEngineOptions,
  type AddOptions,
} from './engine'
export type { WaterSource } from './engine'
export { CPU_SUBSYSTEMS } from './profiling'
export type { EngineStats, RenderSample, CpuTimings, CpuSubsystem, GpuSample } from './profiling'
export { DEFAULT_ASCII_STYLE, engineStyle, type AsciiStyle } from './config'
export { SCREEN_ALPHABETS } from './ascii'
export * from './techniques/index'
export * from './world/index'
export * from './fx/index'
