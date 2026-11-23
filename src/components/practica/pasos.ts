import type { Escena, Linea } from '../../data/types'

export type Paso = {
  /** Id estable: `${escena.numero}-${indice}` (índice de la línea dentro de la escena). */
  id: string
  escena: Escena
  numero: number
  acto: 1 | 2 | 3
  /** Última línea previa de la escena (diálogo o acotación); `null` si es la primera. */
  pie: Linea | null
  contexto: Linea[]
  linea: Extract<Linea, { tipo: 'dialogo' }>
}

/** La línea `todos` (todo el elenco) cuenta como propia de cualquier personaje. */
export function esPropia(linea: Linea, id: string): boolean {
  return linea.tipo === 'dialogo' && (linea.personaje === id || linea.personaje === 'todos')
}

/** Un paso por cada línea del personaje; el contexto son las líneas previas desde su última intervención. */
export function construirPasos(escenas: Escena[], id: string): Paso[] {
  const pasos: Paso[] = []
  for (const escena of escenas) {
    let contexto: Linea[] = []
    for (let indice = 0; indice < escena.lineas.length; indice++) {
      const linea = escena.lineas[indice]
      if (linea.tipo === 'dialogo' && esPropia(linea, id)) {
        pasos.push({
          id: `${escena.numero}-${indice}`,
          escena,
          numero: escena.numero,
          acto: escena.acto,
          pie: indice > 0 ? escena.lineas[indice - 1] : null,
          contexto,
          linea,
        })
        contexto = []
      } else {
        contexto.push(linea)
      }
    }
  }
  return pasos
}
