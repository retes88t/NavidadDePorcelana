import { useMemo, useState } from 'react'
import type { Escena } from '../../data/types'
import type { useProgresoPractica } from '../../hooks/useProgresoPractica'
import type { Paso } from './pasos'
import { generarOpciones } from './opciones'
import LineaView from './LineaView'

type Props = {
  progreso: ReturnType<typeof useProgresoPractica>
  personaje: string
  pasos: Paso[]
  escenas: Escena[]
}

export default function OpcionMultiple({ progreso, personaje, pasos, escenas }: Props) {
  const [filtroEscena, setFiltroEscena] = useState<number | 'todas'>('todas')
  const [indice, setIndice] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)

  const numerosEscena = useMemo(() => Array.from(new Set(pasos.map((p) => p.numero))), [pasos])
  const visibles = useMemo(
    () => (filtroEscena === 'todas' ? pasos : pasos.filter((p) => p.numero === filtroEscena)),
    [pasos, filtroEscena],
  )

  const posicion = Math.min(indice, Math.max(visibles.length - 1, 0))
  const paso: Paso | undefined = visibles[posicion]

  const opciones = useMemo(
    () => (paso ? generarOpciones(paso, escenas) : []),
    // Las opciones se generan una vez por paso para que no cambien al re-renderizar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paso?.id, escenas],
  )

  const cambiarFiltro = (valor: string) => {
    setFiltroEscena(valor === 'todas' ? 'todas' : Number(valor))
    setIndice(0)
    setElegida(null)
  }

  const ir = (nuevo: number) => {
    setIndice(nuevo)
    setElegida(null)
  }

  const elegir = (i: number) => {
    if (!paso || elegida !== null) return
    setElegida(i)
    progreso.registrarIntentoOpcionMultiple(personaje, paso.id, opciones[i].correcta)
  }

  const filtro = (
    <div className="practica-om__filtro">
      <label htmlFor="practica-om-escena">Escena: </label>
      <select
        id="practica-om-escena"
        value={filtroEscena}
        onChange={(e) => cambiarFiltro(e.target.value)}
      >
        <option value="todas">Todas las escenas</option>
        {numerosEscena.map((n) => (
          <option key={n} value={n}>
            Escena {n}
          </option>
        ))}
      </select>
    </div>
  )

  if (!paso) {
    return (
      <section className="practica-om">
        {filtro}
        <p className="practica__acotacion">No hay líneas para practicar con este filtro.</p>
      </section>
    )
  }

  const { escena } = paso
  const respondida = elegida !== null
  const acerto = respondida && opciones[elegida].correcta
  const esUltima = posicion >= visibles.length - 1

  return (
    <section className="practica-om">
      {filtro}
      <article className="practica__paso">
        <p className="practica__escena">
          Acto {escena.acto} · Escena {escena.numero}
          {escena.titulo ? `: ${escena.titulo}` : ''}
        </p>
        <p className="practica-om__progreso">
          Línea {posicion + 1} de {visibles.length}
        </p>
        <div className="practica__contexto">
          {paso.pie ? (
            <LineaView linea={paso.pie} />
          ) : (
            <p className="practica__acotacion">Inicio de escena</p>
          )}
        </div>
        <p className="practica-om__pregunta">¿Cuál es tu línea?</p>
        <ul className="practica-om__opciones">
          {opciones.map((op, i) => {
            const clases = ['practica-om__opcion']
            if (respondida && op.correcta) clases.push('practica-om__opcion--correcta')
            if (respondida && elegida === i && !op.correcta) clases.push('practica-om__opcion--incorrecta')
            return (
              <li key={i}>
                <button
                  type="button"
                  className={clases.join(' ')}
                  disabled={respondida}
                  onClick={() => elegir(i)}
                >
                  {op.texto}
                </button>
              </li>
            )
          })}
        </ul>
        {respondida && (
          <div
            className={`practica-om__resultado ${
              acerto ? 'practica-om__resultado--ok' : 'practica-om__resultado--error'
            }`}
            role="status"
          >
            <p>{acerto ? '¡Correcto!' : 'Incorrecto. La línea correcta era:'}</p>
            {!acerto && (
              <div className="practica__tuya">
                <LineaView linea={paso.linea} />
              </div>
            )}
          </div>
        )}
        <div className="practica-om__nav">
          <button
            type="button"
            className="practica__boton"
            disabled={posicion === 0}
            onClick={() => ir(posicion - 1)}
          >
            Anterior
          </button>
          <button
            type="button"
            className="practica__boton"
            disabled={!respondida || esUltima}
            onClick={() => ir(posicion + 1)}
          >
            Siguiente
          </button>
        </div>
      </article>
    </section>
  )
}
