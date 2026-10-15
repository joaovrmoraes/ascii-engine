import { createAsciiEngine as createCoreEngine, type AsciiEngineOptions } from '@ascii-engine/core'
import { pomorog, POMOROG_EFFECTS } from '@ascii-engine/core/pomorog'
import { resolveWaterPolicy } from './waterPolicy'

/** The editor chooses its appearance and example library explicitly. */
export function createAsciiEngine(canvas: HTMLCanvasElement, options: AsciiEngineOptions = {}) {
  return createCoreEngine(canvas, {
    ...options,
    offscreenWater: resolveWaterPolicy(new URLSearchParams(location.search), {
      present: Object.hasOwn(options, 'offscreenWater'),
      policy: options.offscreenWater,
    }),
    style: { ...pomorog, ...options.style },
    effects: options.effects ?? POMOROG_EFFECTS,
  })
}
