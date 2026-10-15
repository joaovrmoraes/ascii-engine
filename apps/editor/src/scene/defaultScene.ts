import { emptyScene, createTerrainData, type SceneDoc } from '@ascii-engine/core'
export function defaultScene(): SceneDoc {
  return {
    ...emptyScene('My map'),
    terrain: createTerrainData(32, 129),
    carpet: { count: 60000, seed: 48017 },
    objects: [
      { prefab: 'fogueira', position: [0, 0, 0] },
      { prefab: 'arvore', position: [-4, 0, -3] },
      { prefab: 'pedregulho', position: [3, 0, -2] },
    ],
  }
}
