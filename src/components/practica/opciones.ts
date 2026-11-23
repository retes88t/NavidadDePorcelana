import type { Escena } from '../../data/types'
import type { Paso } from './pasos'

export type Opcion = {
  texto: string
  correcta: boolean
}

export type CantidadExamen = 10 | 20 | 'todas'
export type AlcanceExamen = 'todo' | 1 | 2 | 3

export const CANTIDAD_OPCIONES = 4

/** Función que devuelve un número en [0, 1); inyectable para pruebas. */
export type Azar = () => number

const normalizar = (texto: string) => texto.trim().replace(/\s+/g, ' ').toLowerCase()

/** Mezcla Fisher-Yates sobre una copia; no modifica el arreglo original. */
export function mezclar<T>(items: readonly T[], azar: Azar = Math.random): T[] {
  const copia = [...items]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/** Textos de diálogo del guion (sin acotaciones) con su personaje. */
function dialogosDelGuion(escenas: Escena[]): { personaje: string; texto: string }[] {
  const dialogos: { personaje: string; texto: string }[] = []
  for (const escena of escenas) {
    for (const linea of escena.lineas) {
      if (linea.tipo === 'dialogo') dialogos.push({ personaje: linea.personaje, texto: linea.texto })
    }
  }
  return dialogos
}

/**
 * Devuelve hasta 4 opciones mezcladas: la correcta y hasta 3 distractores.
 * Los distractores salen primero de otras líneas del mismo personaje y luego de otros,
 * sin texto repetido ni igual al de la correcta. Si no hay suficientes candidatos
 * únicos, devuelve menos de 4 opciones (siempre incluye la correcta).
 */
export function generarOpciones(paso: Paso, escenas: Escena[], azar: Azar = Math.random): Opcion[] {
  const vistos = new Set<string>([normalizar(paso.linea.texto)])
  const dialogos = dialogosDelGuion(escenas)
  const distractores: string[] = []

  const tomar = (candidatos: string[]) => {
    for (const texto of mezclar(candidatos, azar)) {
      if (distractores.length >= CANTIDAD_OPCIONES - 1) return
      const clave = normalizar(texto)
      if (!clave || vistos.has(clave)) continue
      vistos.add(clave)
      distractores.push(texto)
    }
  }

  tomar(dialogos.filter(d => d.personaje === paso.linea.personaje).map(d => d.texto))
  tomar(dialogos.filter(d => d.personaje !== paso.linea.personaje).map(d => d.texto))

  const opciones: Opcion[] = [
    { texto: paso.linea.texto, correcta: true },
    ...distractores.map(texto => ({ texto, correcta: false })),
  ]
  return mezclar(opciones, azar)
}

/** Filtra pasos por alcance (todo el guion o un acto). */
export function filtrarPorAlcance(pasos: Paso[], alcance: AlcanceExamen): Paso[] {
  return alcance === 'todo' ? pasos : pasos.filter(p => p.acto === alcance)
}

/** Selecciona y mezcla los pasos de un examen según cantidad y alcance. */
export function seleccionarPasosExamen(
  pasos: Paso[],
  cantidad: CantidadExamen,
  alcance: AlcanceExamen,
  azar: Azar = Math.random,
): Paso[] {
  const candidatos = mezclar(filtrarPorAlcance(pasos, alcance), azar)
  return cantidad === 'todas' ? candidatos : candidatos.slice(0, cantidad)
}
