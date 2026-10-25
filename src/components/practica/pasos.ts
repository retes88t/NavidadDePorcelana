import type { Escena, Linea } from '../../data/types'

export type Paso = {
  escena: Escena
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
    for (const linea of escena.lineas) {
      if (linea.tipo === 'dialogo' && esPropia(linea, id)) {
        pasos.push({ escena, contexto, linea })
        contexto = []
      } else {
        contexto.push(linea)
      }
    }
  }
  return pasos
}
