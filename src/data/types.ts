export type PersonajeId =
  | 'luis'
  | 'adriana'
  | 'ana'
  | 'luisfer'
  | 'nora'
  | 'chelo'
  | 'astrid'

export type Linea =
  | { tipo: 'dialogo'; personaje: string; texto: string; acotacion?: string }
  | { tipo: 'acotacion'; texto: string }

export type Escena = {
  numero: number
  acto: 1 | 2 | 3
  titulo: string
  lugar: string
  resumen: string
  lineas: Linea[]
}

export type Personaje = {
  id: PersonajeId
  nombre: string
  nombreCorto: string
  edad: string
  descripcion: string
  actor: string
}

export type Acto = {
  numero: 1 | 2 | 3
  titulo: string
  resumen: string
}

export type TipoRelacion =
  | 'pareja'
  | 'ex-pareja'
  | 'hermanos'
  | 'amistad'
  | 'conflicto'
  | 'parentesco'

export type NodoRelacional = {
  id: string
  nombre: string
  presente: boolean
}

export type Relacion = {
  origen: string
  destino: string
  tipo: TipoRelacion
  descripcion?: string
}
