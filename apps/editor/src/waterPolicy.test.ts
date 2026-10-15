import { describe, it, expect } from 'vitest'
import { resolveWaterPolicy, fullWaterSimulation } from './waterPolicy'
const params = (query = '') => new URLSearchParams(query)
describe('water scheduling in live and reproducible views', () => {
  it('defaults live editor/player views to pause and benchmarks to full simulation', () => {
    expect(resolveWaterPolicy(params())).toEqual({ mode: 'pause', margin: 4 })
    expect(resolveWaterPolicy(params('bench=water-scale'))).toBeUndefined()
  })
  it('allows an explicit full-simulation constructor or a query override', () => {
    expect(resolveWaterPolicy(params(), { present: true, policy: undefined })).toBeUndefined()
    expect(resolveWaterPolicy(params('water-policy=off'))).toBeUndefined()
    expect(resolveWaterPolicy(params('water-policy=pause'))?.mode).toBe('pause')
    expect(() => resolveWaterPolicy(params('water-policy=maybe'))).toThrow()
  })
  it.each(['offline=1', 'parity=1'])(
    'forces full simulation for %s, including explicit pause',
    query => {
      expect(fullWaterSimulation(params(query))).toBe(true)
      expect(
        resolveWaterPolicy(params(query + '&water-policy=pause'), {
          present: true,
          policy: { mode: 'pause' },
        }),
      ).toBeUndefined()
    },
  )
})
