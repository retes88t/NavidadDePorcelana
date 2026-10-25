import type { NodoRelacional, Relacion } from './types'

export const nodos: NodoRelacional[] = [
  { id: 'abuelos', nombre: 'Abuelos (padres de Luis y Ana)', presente: false },
  { id: 'luis', nombre: 'Luis', presente: true },
  { id: 'ana', nombre: 'Ana', presente: true },
  { id: 'adriana', nombre: 'Adriana', presente: true },
  { id: 'jenny', nombre: 'Jenny', presente: false },
  { id: 'luisfer', nombre: 'LuisFer', presente: true },
  { id: 'chelo', nombre: 'Chelo', presente: true },
  { id: 'nora', nombre: 'Nora', presente: true },
  { id: 'astrid', nombre: 'Astrid', presente: true },
]

export const relaciones: Relacion[] = [
  { origen: 'abuelos', destino: 'luis', tipo: 'parentesco', descripcion: 'Padres de Luis' },
  { origen: 'abuelos', destino: 'ana', tipo: 'parentesco', descripcion: 'Padres de Ana' },
  { origen: 'luis', destino: 'ana', tipo: 'hermanos', descripcion: 'Ana es la hermana mayor de Luis' },
  { origen: 'luis', destino: 'adriana', tipo: 'ex-pareja', descripcion: 'Ex esposos tras casi 30 años de matrimonio' },
  { origen: 'luis', destino: 'jenny', tipo: 'ex-pareja', descripcion: 'Novia de 23 años; terminaron hace un mes' },
  { origen: 'luis', destino: 'luisfer', tipo: 'parentesco', descripcion: 'Padre e hijo' },
  { origen: 'luis', destino: 'chelo', tipo: 'parentesco', descripcion: 'Padre e hijo' },
  { origen: 'adriana', destino: 'luisfer', tipo: 'parentesco', descripcion: 'Madre e hijo' },
  { origen: 'adriana', destino: 'chelo', tipo: 'parentesco', descripcion: 'Madre e hijo' },
  { origen: 'ana', destino: 'luisfer', tipo: 'parentesco', descripcion: 'Tía y sobrino' },
  { origen: 'ana', destino: 'chelo', tipo: 'parentesco', descripcion: 'Tía y sobrino' },
  { origen: 'ana', destino: 'adriana', tipo: 'amistad', descripcion: 'Mejores amigas desde la primaria' },
  { origen: 'luisfer', destino: 'chelo', tipo: 'hermanos', descripcion: 'Hermanos' },
  { origen: 'luisfer', destino: 'nora', tipo: 'pareja', descripcion: 'Prometidos tras 7 años de novios; Nora termina con él en la Escena 8' },
  { origen: 'chelo', destino: 'astrid', tipo: 'pareja', descripcion: 'Salen desde hace aproximadamente un mes' },
  { origen: 'luisfer', destino: 'astrid', tipo: 'ex-pareja', descripcion: 'Fueron novios en la universidad' },
  { origen: 'luisfer', destino: 'jenny', tipo: 'conflicto', descripcion: 'Antiguo episodio de infidelidad que Nora le reclama' },
  { origen: 'luis', destino: 'adriana', tipo: 'conflicto', descripcion: 'Tensión por la casa, el dinero y su ausencia como padre' },
  { origen: 'luisfer', destino: 'chelo', tipo: 'conflicto', descripcion: 'Rivalidad entre hermanos; se pelean en la Escena 5' },
  { origen: 'luisfer', destino: 'nora', tipo: 'conflicto', descripcion: 'Triángulo con Astrid; Nora cuestiona su compromiso' },
  { origen: 'luisfer', destino: 'luis', tipo: 'conflicto', descripcion: 'Chelo los compara: LuisFer es igual a su papá' },
]
