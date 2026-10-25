import type { Escena } from './types'
import { escenasMeta } from './escenas-meta'
import { acto1 } from './guion/acto1'
import { acto2 } from './guion/acto2'
import { acto3 } from './guion/acto3'

const lineasPorEscena = new Map<number, Escena['lineas']>(
  [...acto1, ...acto2, ...acto3].map((e) => [e.numero, e.lineas]),
)

export const escenas: Escena[] = escenasMeta.map((meta) => ({
  ...meta,
  lineas: lineasPorEscena.get(meta.numero) ?? [],
}))

export { personajes } from './personajes'
export { actos } from './actos'
export { nodos, relaciones } from './relaciones'
export { sinopsisGuion, resumenPropio, conclusiones } from './sinopsis'
export type * from './types'
