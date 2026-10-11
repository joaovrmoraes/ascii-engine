import { describe, expect, it } from 'vitest'
import { createTerrainData, parseScene, waterEdge } from '@ascii-engine/core'
import { applyCommands } from './commands'

const initial = () => parseScene({ version: 1, name: 'Original', terrain: createTerrainData(16, 33), objects: [{ id: 'rock', prefab: 'pedregulho', position: [0,0,0] }] })
describe('autoria atômica', () => {
  it('preserva origem inteira quando uma operação posterior falha', () => {
    const doc = initial(), before = JSON.stringify(doc)
    expect(() => applyCommands(doc, [{ op: 'object.update', id: 'rock', patch: { position: [1,2,3] } }, { op: 'object.remove', ids: ['missing'] }])).toThrow('inexistente')
    expect(JSON.stringify(doc)).toBe(before)
  })
  it('pinta encosta sem achatá-la e atualiza água ao esculpir', () => {
    let doc = applyCommands(initial(), [{ op: 'terrain.stroke', strokes: [{ brush: 'raise', x: 0,z: 0,radius: 3,strength: 4 }] }, { op: 'water.paint', points: [{x: -3,z: 0},{x: 3,z: 0}],radius: .8 }])
    const middle = 16*33+16, height = doc.terrain!.heights[middle]
    expect(height).toBe(4)
    expect(waterEdge(doc.waters![0].shape, 0, 0)).toBeGreaterThan(0)
    expect(doc.waters![0].shape.mask!.heights![middle]).toBeCloseTo(height+.045)
    doc = applyCommands(doc, [{ op: 'terrain.stroke', strokes: [{brush:'lower',x:0,z:0,radius:2,strength:1}] }])
    expect(doc.waters![0].shape.mask!.heights![middle]).toBeCloseTo(3.045)
  })
  it('mantém lago plano, escava o leito e apaga só água', () => {
    const doc = applyCommands(initial(), [{ op:'water.paint',points:[{x:0,z:0}],radius:2,mode:'level',level:-.2 }])
    expect(doc.terrain!.heights[16*33+16]).toBeCloseTo(-.38)
    const erased = applyCommands(doc, [{op:'water.paint',index:0,points:[{x:0,z:0}],radius:1,erase:true}])
    expect(waterEdge(erased.waters![0].shape,0,0)).toBeLessThan(0)
    expect(erased.terrain).toEqual(doc.terrain)
  })
  it('mescla controles parciais de reflexo com o preset de água', () => {
    const doc=applyCommands(initial(),[{op:'water.paint',points:[{x:0,z:0}],radius:2,look:{reflection:{enabled:false}}}])
    expect(doc.waters![0].look?.reflection?.enabled).toBe(false)
    const updated=applyCommands(doc,[{op:'water.update',index:0,patch:{look:{reflection:{enabled:true}}}}])
    expect(updated.waters![0].look?.reflection?.enabled).toBe(true)
    expect(updated.waters![0].look?.reflection?.rows).toBeGreaterThan(0)
  })
  it('dispersa de forma reprodutível sobre o chão e conserva estilos por parte', () => {
    const command = {op:'object.scatter',prefab:'arvore',count:10,seed:42,bounds:{minX:-3,maxX:3,minZ:-2,maxZ:2},scale:[.8,1.2]}
    const a=applyCommands(initial(),[command]), b=applyCommands(initial(),[command])
    expect(a.objects.map(o=>[o.position,o.seed,o.scale])).toEqual(b.objects.map(o=>[o.position,o.seed,o.scale]))
    const styled=applyCommands(a,[{op:'object.update',id:'rock',patch:{options:{parts:{stone:{glyph:'body',size:.12}}}}}])
    expect(styled.objects[0].options?.parts?.stone.glyph).toBe('body')
  })
  it('define receitas e impede remoção de recurso em uso', () => {
    const doc=applyCommands(initial(),[{op:'effect.define',id:'fx:custom-blue',effect:{name:'Azul',duration:2,loop:true,emitters:[{rate:10,glyphs:'*'}],light:{color:255,intensity:4}}},{op:'object.add',object:{id:'fire',prefab:'fx:custom-blue',position:[0,0,0]}}])
    expect(()=>applyCommands(doc,[{op:'resource.remove',kind:'effects',id:'fx:custom-blue'}])).toThrow('instâncias')
    expect(applyCommands(doc,[{op:'object.remove',ids:['fire']},{op:'resource.remove',kind:'effects',id:'fx:custom-blue'}]).effects).toEqual({})
  })
  it('mescla atmosfera parcial e permite todos os campos do documento', () => {
    const doc=applyCommands(initial(),[{op:'atmosphere.set',style:{moon:{intensity:3},inkTint:[1,.7,.5]}},{op:'scene.patch',patch:{carpet:{count:5000,seed:2}},unset:['waters']}])
    expect(doc.style?.moon?.intensity).toBe(3)
    expect(doc.style?.moon?.position).toHaveLength(3)
    expect(doc.style?.bodySceneLighting).toBe(true)
    expect(doc.carpet?.count).toBe(5000)
  })
  it('rejeita chaves reservadas e dimensões inválidas antes de alocar', () => {
    expect(()=>applyCommands(initial(),JSON.parse('[{"op":"scene.patch","patch":{"__proto__":{"polluted":true}}}]'))).toThrow('reservada')
    expect(()=>applyCommands(initial(),[{op:'terrain.create',resolution:100000}])).toThrow()
    expect(()=>applyCommands(initial(),[{op:'scene.patch',patch:{terrain:{resolution:99999}}},{op:'terrain.stroke',strokes:[]}])).toThrow()
    expect(({} as Record<string,unknown>).polluted).toBeUndefined()
  })
})
