import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { GlyphKind, GlyphStyle } from '../style'
import type { SurfaceKind } from '../surface'

/**
 * GLTF/GLB import (phase 3). Blender custom properties arrive as `extras` →
 * `userData`. A node may carry:
 *   glyph = "body" | "surface" | "screen" | …   (technique)
 *   glyph_surface = "stone" | "foliage" | …     (letter family)
 *   glyph_size = 0.19                           (body letter size, m)
 *   glyphStyle = '{"surface":"bark"}'           (JSON, any style field)
 * Every named node is a part (§3.1): `engine.add(model.scene, { parts })`
 * can restyle it by name. Nodes without a technique get a reasonable default
 * from their names and geometry (never from colour).
 */
const KINDS: GlyphKind[] = ['screen', 'surface', 'body', 'carpet', 'particle', 'water']
const SURFACES: SurfaceKind[] = [
  'reflection',
  'snow',
  'bark',
  'wetgrass',
  'wood',
  'actor',
  'stone',
  'foliage',
  'water',
  'earth',
  'glyph',
]

/** Folds Blender-style properties into `userData.glyph` / `userData.glyphStyle`. */
export function normalizeGlyphData(userData: Record<string, unknown>) {
  let style: GlyphStyle = {}
  const raw = userData.glyphStyle ?? userData.glyph_style
  if (typeof raw === 'string') {
    try {
      style = JSON.parse(raw) as GlyphStyle
    } catch {
      /* keep empty */
    }
  } else if (raw && typeof raw === 'object') style = { ...(raw as GlyphStyle) }
  const surface = userData.glyph_surface ?? userData.glyphSurface
  if (typeof surface === 'string' && SURFACES.includes(surface as SurfaceKind))
    style.surface = surface as SurfaceKind
  const size = Number(userData.glyph_size ?? userData.glyphSize)
  if (Number.isFinite(size) && size > 0) style.size = size
  const glyph = typeof userData.glyph === 'string' ? userData.glyph.toLowerCase() : undefined
  if (glyph && KINDS.includes(glyph as GlyphKind)) userData.glyph = glyph
  else delete userData.glyph
  if (Object.keys(style).length) userData.glyphStyle = style
  else delete userData.glyphStyle
  return userData
}

const WORDS: [RegExp, SurfaceKind][] = [
  [
    /leaf|leaves|foliage|crown|copa|folha|bush|arbusto|moss|musgo|grass|grama|reed|junco/i,
    'foliage',
  ],
  [/bark|trunk|tronco|branch|galho|casca/i, 'bark'],
  [/wood|plank|tabua|tábua|madeira|crate|caixa|fence|cerca|bridge|ponte|beam|viga/i, 'wood'],
  [/rock|stone|pedra|rocha|boulder|wall|muro|brick|tijolo|crystal|cristal/i, 'stone'],
  [/ground|floor|terrain|chao|chão|terra|soil|dirt/i, 'earth'],
  [/snow|neve|ice|gelo/i, 'snow'],
]

/**
 * The default when a node declares nothing: skinned meshes and faceted or
 * organic names become letter clouds; the rest letters on the face. The
 * letter family comes from node/material names.
 */
export function defaultGlyphStyle(mesh: THREE.Mesh): GlyphStyle {
  const names = [
    mesh.name,
    mesh.parent?.name ?? '',
    ...[mesh.material].flat().map(m => m.name),
  ].join(' ')
  const surface = WORDS.find(([pattern]) => pattern.test(names))?.[1]
  if (mesh instanceof THREE.SkinnedMesh)
    return { glyph: 'body', surface: surface ?? 'actor', size: 0.155 }
  const g = mesh.geometry
  const faceted =
    g instanceof THREE.DodecahedronGeometry ||
    g instanceof THREE.IcosahedronGeometry ||
    g instanceof THREE.OctahedronGeometry
  if (surface === 'foliage' || surface === 'snow' || faceted)
    return { glyph: 'body', surface: surface ?? 'stone', size: 0.19 }
  return { glyph: 'surface', surface }
}

/** Marks every mesh that has no technique on itself or an ancestor. */
export function applyDefaultGlyphs(root: THREE.Object3D) {
  const visit = (node: THREE.Object3D, inherited: boolean) => {
    normalizeGlyphData(node.userData)
    const marked = inherited || !!node.userData.glyph
    if (!marked && node instanceof THREE.Mesh) {
      const style = defaultGlyphStyle(node)
      node.userData.glyph = style.glyph
      const { glyph: _glyph, ...rest } = style
      node.userData.glyphStyle = {
        ...rest,
        ...(node.userData.glyphStyle as GlyphStyle | undefined),
      }
      node.userData.glyphDefault = true
    }
    for (const child of node.children) visit(child, marked)
  }
  visit(root, false)
  return root
}

export interface GlyphModel {
  scene: THREE.Group
  animations: THREE.AnimationClip[]
  mixer: THREE.AnimationMixer
  /** Named nodes: the parts that can be restyled one by one. */
  parts: string[]
  /** Advances the animations. */
  update(dt: number): void
}

/** Wraps a loaded GLTF scene: defaults, parts and an animation mixer playing every clip. */
export function prepareGlyphModel(
  scene: THREE.Group,
  animations: THREE.AnimationClip[] = [],
): GlyphModel {
  applyDefaultGlyphs(scene)
  scene.traverse(node => {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true
      node.receiveShadow = true
    }
  })
  const parts: string[] = []
  scene.traverse(node => {
    if (node !== scene && node.name && !(node instanceof THREE.Bone)) parts.push(node.name)
  })
  const mixer = new THREE.AnimationMixer(scene)
  for (const clip of animations) mixer.clipAction(clip).play()
  return { scene, animations, mixer, parts, update: dt => mixer.update(dt) }
}

/** Loads a .gltf/.glb from a URL or an ArrayBuffer. */
export async function loadGlyphModel(source: string | ArrayBuffer): Promise<GlyphModel> {
  const loader = new GLTFLoader()
  const gltf =
    typeof source === 'string'
      ? await loader.loadAsync(source)
      : await loader.parseAsync(source, '')
  return prepareGlyphModel(gltf.scene, gltf.animations)
}
