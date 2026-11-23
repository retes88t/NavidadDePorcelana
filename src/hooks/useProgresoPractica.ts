import { useCallback, useEffect, useState } from 'react'
import {
  CLAVE_PROGRESO,
  calcularPorcentajes,
  conDominada,
  conExamen,
  conIntentoOpcionMultiple,
  guardarProgreso,
  leerProgreso,
  sinPersonaje,
  type IntentoExamen,
  type PorcentajesProgreso,
  type ProgresoLinea,
  type ProgresoPractica,
} from '../components/practica/progreso'

export function useProgresoPractica() {
  const [progreso, setProgreso] = useState<ProgresoPractica>(leerProgreso)

  // Sincroniza entre pestañas
  useEffect(() => {
    const alCambiar = (e: StorageEvent) => {
      if (e.key === CLAVE_PROGRESO) setProgreso(leerProgreso())
    }
    window.addEventListener('storage', alCambiar)
    return () => window.removeEventListener('storage', alCambiar)
  }, [])

  const actualizar = useCallback((fn: (p: ProgresoPractica) => ProgresoPractica) => {
    setProgreso((previo) => {
      const nuevo = fn(previo)
      guardarProgreso(nuevo)
      return nuevo
    })
  }, [])

  const registrarIntentoOpcionMultiple = useCallback(
    (personaje: string, idLinea: string, acierto: boolean) =>
      actualizar((p) => conIntentoOpcionMultiple(p, personaje, idLinea, acierto)),
    [actualizar],
  )

  const marcarDominada = useCallback(
    (personaje: string, idLinea: string, dominada: boolean) =>
      actualizar((p) => conDominada(p, personaje, idLinea, dominada)),
    [actualizar],
  )

  const registrarExamen = useCallback(
    (personaje: string, aciertos: number, total: number) =>
      actualizar((p) => conExamen(p, personaje, aciertos, total)),
    [actualizar],
  )

  const reiniciarPersonaje = useCallback(
    (personaje: string) => actualizar((p) => sinPersonaje(p, personaje)),
    [actualizar],
  )

  const obtenerLinea = useCallback(
    (personaje: string, idLinea: string): ProgresoLinea | undefined =>
      progreso.personajes[personaje]?.lineas[idLinea],
    [progreso],
  )

  const porcentajes = useCallback(
    (personaje: string, idsLineas: readonly string[]): PorcentajesProgreso =>
      calcularPorcentajes(progreso, personaje, idsLineas),
    [progreso],
  )

  const intentosExamen = useCallback(
    (personaje: string): IntentoExamen[] => progreso.personajes[personaje]?.intentosExamen ?? [],
    [progreso],
  )

  const mejorExamen = useCallback(
    (personaje: string): number => progreso.personajes[personaje]?.mejorExamen ?? 0,
    [progreso],
  )

  return {
    progreso,
    registrarIntentoOpcionMultiple,
    marcarDominada,
    registrarExamen,
    reiniciarPersonaje,
    obtenerLinea,
    porcentajes,
    intentosExamen,
    mejorExamen,
  }
}
