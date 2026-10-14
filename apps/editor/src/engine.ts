import { createAsciiEngine as createCoreEngine, type AsciiEngineOptions } from '@ascii-engine/core'
import { pomorog, POMOROG_EFFECTS } from '@ascii-engine/core/pomorog'

/** The editor chooses its appearance and example library explicitly. */
export function createAsciiEngine(canvas: HTMLCanvasElement, options: AsciiEngineOptions = {}) {
  return createCoreEngine(canvas, {
    ...options,
    style: { ...pomorog, ...options.style },
    effects: options.effects ?? POMOROG_EFFECTS,
  })
}
