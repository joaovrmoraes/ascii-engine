import * as THREE from 'three'
import { tagSurface, type SurfaceKind } from '../surface'

/**
 * Technique `screen` (Pomorog `actorInk.ts`): the material keeps its 3D look in
 * the offscreen target and the screen pass turns it into a fixed screen grid
 * with the alphabet of its ID. The hero uses `actor`.
 */
export function markScreen(material: THREE.Material, kind: SurfaceKind = 'actor') {
  return tagSurface(material, kind)
}
