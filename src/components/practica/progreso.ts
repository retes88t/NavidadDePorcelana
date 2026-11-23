// Almacén de progreso de la práctica (localStorage). Sin dependencia del tipo de paso:
// las líneas se identifican por id string (`${escena.numero}-${indice}`).

export const CLAVE_PROGRESO = 'navidad-practica-progreso'
export const VERSION_PROGRESO = 1
export const MAX_INTENTOS_EXAMEN = 5

export type ProgresoLinea = {
  mcAciertos: number
  mcIntentos: number
  mcUltimoCorrecto: boolean
  dominada: boolean
}

export type IntentoExamen = {
  fecha: string
  aciertos: number
  total: number
  porcentaje: number
}

export type ProgresoPersonaje = {
  lineas: Record<string, ProgresoLinea>
  mejorExamen: number // porcentaje 0-100
  intentosExamen: IntentoExamen[] // los últimos 5, el más reciente al final
}

export type ProgresoPractica = {
  version: number
  personajes: Record<string, ProgresoPersonaje>
}

export type PorcentajesProgreso = {
  opcionMultiple: number
  borrador: number
  examen: number
  total: number
}

export const lineaVacia = (): ProgresoLinea => ({
  mcAciertos: 0,
  mcIntentos: 0,
  mcUltimoCorrecto: false,
  dominada: false,
})

export const personajeVacio = (): ProgresoPersonaje => ({
  lineas: {},
  mejorExamen: 0,
  intentosExamen: [],
})

export const progresoVacio = (): ProgresoPractica => ({
  version: VERSION_PROGRESO,
  personajes: {},
})

const esObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const num = (v: unknown): number =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0

function sanearLinea(v: unknown): ProgresoLinea | null {
  if (!esObjeto(v)) return null
  return {
    mcAciertos: num(v.mcAciertos),
    mcIntentos: num(v.mcIntentos),
    mcUltimoCorrecto: v.mcUltimoCorrecto === true,
    dominada: v.dominada === true,
  }
}

function sanearIntento(v: unknown): IntentoExamen | null {
  if (!esObjeto(v)) return null
  return {
    fecha: typeof v.fecha === 'string' ? v.fecha : '',
    aciertos: num(v.aciertos),
    total: num(v.total),
    porcentaje: Math.min(100, num(v.porcentaje)),
  }
}

function sanearPersonaje(v: unknown): ProgresoPersonaje | null {
  if (!esObjeto(v)) return null
  const lineas: Record<string, ProgresoLinea> = {}
  if (esObjeto(v.lineas)) {
    for (const [id, l] of Object.entries(v.lineas)) {
      const limpia = sanearLinea(l)
      if (limpia) lineas[id] = limpia
    }
  }
  const intentos = Array.isArray(v.intentosExamen)
    ? v.intentosExamen
        .map(sanearIntento)
        .filter((i): i is IntentoExamen => i !== null)
        .slice(-MAX_INTENTOS_EXAMEN)
    : []
  return {
    lineas,
    mejorExamen: Math.min(100, num(v.mejorExamen)),
    intentosExamen: intentos,
  }
}

/** Convierte un valor desconocido en progreso válido; si es corrupto o de otra versión, devuelve vacío. */
export function sanearProgreso(v: unknown): ProgresoPractica {
  if (!esObjeto(v) || v.version !== VERSION_PROGRESO || !esObjeto(v.personajes)) {
    return progresoVacio()
  }
  const personajes: Record<string, ProgresoPersonaje> = {}
  for (const [id, p] of Object.entries(v.personajes)) {
    const limpio = sanearPersonaje(p)
    if (limpio) personajes[id] = limpio
  }
  return { version: VERSION_PROGRESO, personajes }
}

export function leerProgreso(): ProgresoPractica {
  try {
    const crudo = window.localStorage.getItem(CLAVE_PROGRESO)
    if (crudo === null) return progresoVacio()
    return sanearProgreso(JSON.parse(crudo))
  } catch {
    return progresoVacio()
  }
}

export function guardarProgreso(progreso: ProgresoPractica): void {
  try {
    window.localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(progreso))
  } catch {
    // almacenamiento no disponible: se ignora
  }
}

// ---- Transformaciones puras ----

function conPersonaje(
  p: ProgresoPractica,
  personaje: string,
  fn: (actual: ProgresoPersonaje) => ProgresoPersonaje,
): ProgresoPractica {
  const actual = p.personajes[personaje] ?? personajeVacio()
  return { ...p, personajes: { ...p.personajes, [personaje]: fn(actual) } }
}

function conLinea(
  actual: ProgresoPersonaje,
  idLinea: string,
  fn: (l: ProgresoLinea) => ProgresoLinea,
): ProgresoPersonaje {
  const l = actual.lineas[idLinea] ?? lineaVacia()
  return { ...actual, lineas: { ...actual.lineas, [idLinea]: fn(l) } }
}

export function conIntentoOpcionMultiple(
  p: ProgresoPractica,
  personaje: string,
  idLinea: string,
  acierto: boolean,
): ProgresoPractica {
  return conPersonaje(p, personaje, (a) =>
    conLinea(a, idLinea, (l) => ({
      ...l,
      mcIntentos: l.mcIntentos + 1,
      mcAciertos: l.mcAciertos + (acierto ? 1 : 0),
      mcUltimoCorrecto: acierto,
    })),
  )
}

export function conDominada(
  p: ProgresoPractica,
  personaje: string,
  idLinea: string,
  dominada: boolean,
): ProgresoPractica {
  return conPersonaje(p, personaje, (a) => conLinea(a, idLinea, (l) => ({ ...l, dominada })))
}

export function conExamen(
  p: ProgresoPractica,
  personaje: string,
  aciertos: number,
  total: number,
): ProgresoPractica {
  const porcentaje = total > 0 ? Math.round((aciertos / total) * 100) : 0
  const intento: IntentoExamen = {
    fecha: new Date().toISOString(),
    aciertos,
    total,
    porcentaje,
  }
  return conPersonaje(p, personaje, (a) => ({
    ...a,
    mejorExamen: Math.max(a.mejorExamen, porcentaje),
    intentosExamen: [...a.intentosExamen, intento].slice(-MAX_INTENTOS_EXAMEN),
  }))
}

export function sinPersonaje(p: ProgresoPractica, personaje: string): ProgresoPractica {
  const { [personaje]: _omitido, ...resto } = p.personajes
  void _omitido
  return { ...p, personajes: resto }
}

// ---- Selectores ----

const porcentaje = (parte: number, total: number): number =>
  total > 0 ? Math.min(100, Math.round((parte / total) * 100)) : 0

/**
 * Porcentajes por modo y total. `idsLineas` son los ids de las líneas practicables
 * del personaje; solo esas cuentan (ignora ids obsoletos del guion anterior).
 */
export function calcularPorcentajes(
  p: ProgresoPractica,
  personaje: string,
  idsLineas: readonly string[],
): PorcentajesProgreso {
  const datos = p.personajes[personaje]
  let aprendidas = 0
  let dominadas = 0
  if (datos) {
    for (const id of idsLineas) {
      const l = datos.lineas[id]
      if (!l) continue
      if (l.mcUltimoCorrecto) aprendidas++
      if (l.dominada) dominadas++
    }
  }
  const opcionMultiple = porcentaje(aprendidas, idsLineas.length)
  const borrador = porcentaje(dominadas, idsLineas.length)
  const examen = datos ? datos.mejorExamen : 0
  const total = Math.round((opcionMultiple + borrador + examen) / 3)
  return { opcionMultiple, borrador, examen, total }
}
