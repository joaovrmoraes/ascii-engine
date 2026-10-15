import { describe, expect, it } from 'vitest'
import { insertSceneItem, readImportedResource } from './files'
import type { SceneDoc } from '@ascii-engine/core'

describe('portable resource import', () => {
  it('recognizes standalone recipes and validates their contents', () => {
    expect(readImportedResource({version:1,name:'Ink',texture:{alphabet:'XZ',open:true}},'ink.json'))
      .toEqual({kind:'texture',asset:{name:'Ink',style:{alphabet:'XZ',open:true}}})
    expect(readImportedResource({version:1,atmosphere:{brightness:1.2}},'light.json').kind).toBe('atmosphere')
    expect(() => readImportedResource({version:1,texture:{alphabet:'\n'}},'bad.json')).toThrow()
    expect(() => readImportedResource({brightness:1},'old.json')).toThrow(/Load style preset/)
  })
  it('keeps map replacement distinct from insertion', () => {
    expect(readImportedResource({version:1,objects:[]},'item.json').kind).toBe('item')
    expect(() => readImportedResource({version:1,objects:[],waters:[{shape:{kind:'pond',x:0,z:0,size:2,angle:0}}]},'map.json')).toThrow(/Open map/)
  })
  it('remaps repeated item instances and links without mutating either input', () => {
    const source: SceneDoc={version:1,name:'Map',objects:[],textures:{ink:{name:'Existing',style:{alphabet:'O'}}}}
    const item: SceneDoc={version:1,objects:[{id:'old',prefab:'caixa',position:[1,2,3],options:{texture:'ink',parts:{lid:{texture:'ink'}}}}],
      textures:{ink:{name:'Imported',style:{alphabet:'XZ'}}},style:{glyphs:{size:.23},types:{caixa:{style:{color:0x557799}}}},
      cameras:{front:{name:'Front',projection:'orthographic',position:[4,5,6],rotation:[0,0,0],span:5,aspect:1}}}
    const before=structuredClone({source,item})
    const once=insertSceneItem(source,item,[10,20,30]), twice=insertSceneItem(once,item,[0,0,0])
    expect({source,item}).toEqual(before)
    expect(twice.objects[0].position).toEqual([11,22,33])
    expect(new Set(twice.objects.map(object=>object.id)).size).toBe(2)
    const [a,b]=twice.objects.map(object=>object.options!)
    expect(a.texture).not.toBe(b.texture); expect(a.texture).not.toBe('ink')
    expect(a.parts!.lid.texture).toBe(a.texture)
    expect(twice.textures![a.texture!].style.alphabet).toBe('XZ')
    expect(twice.textures!.ink.style.alphabet).toBe('O')
    expect(a.alphabet).toBeUndefined()
    expect(twice.style!.types![a.type!].style).toEqual({size:.23,color:0x557799})
    expect(Object.values(twice.cameras!)[0].position).toEqual([14,25,36])
  })
})
