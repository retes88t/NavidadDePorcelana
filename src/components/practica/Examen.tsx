import { useState } from 'react'
import type { Escena } from '../../data/types'
import type { useProgresoPractica } from '../../hooks/useProgresoPractica'
import LineaView from './LineaView'
import type { Paso } from './pasos'
import {
  filtrarPorAlcance,
  generarOpciones,
  seleccionarPasosExamen,
  type AlcanceExamen,
  type CantidadExamen,
  type Opcion,
} from './opciones'

type Props = {
  progreso: ReturnType<typeof useProgresoPractica>
  personaje: string
  pasos: Paso[]
  escenas: Escena[]
}

type Pregunta = { paso: Paso; opciones: Opcion[] }

const CANTIDADES: { valor: CantidadExamen; etiqueta: string }[] = [
  { valor: 10, etiqueta: '10 preguntas' },
  { valor: 20, etiqueta: '20 preguntas' },
  { valor: 'todas', etiqueta: 'Todas' },
]

const ALCANCES: { valor: AlcanceExamen; etiqueta: string }[] = [
  { valor: 'todo', etiqueta: 'Todo el guion' },
  { valor: 1, etiqueta: 'Acto I' },
  { valor: 2, etiqueta: 'Acto II' },
  { valor: 3, etiqueta: 'Acto III' },
]

const formatearFecha = (iso: string) => {
  const f = new Date(iso)
  return Number.isNaN(f.getTime()) ? 'Fecha desconocida' : f.toLocaleString('es')
}

export default function Examen({ progreso, personaje, pasos, escenas }: Props) {
  const [cantidad, setCantidad] = useState<CantidadExamen>(10)
  const [alcance, setAlcance] = useState<AlcanceExamen>('todo')
  const [preguntas, setPreguntas] = useState<Pregunta[] | null>(null)
  const [indice, setIndice] = useState(0)
  const [respuestas, setRespuestas] = useState<(number | null)[]>([])
  const [terminado, setTerminado] = useState(false)

  const disponibles = filtrarPorAlcance(pasos, alcance).length
  const intentos = progreso.intentosExamen(personaje)
  const mejor = progreso.mejorExamen(personaje)

  const iniciar = () => {
    const seleccion = seleccionarPasosExamen(pasos, cantidad, alcance)
    setPreguntas(seleccion.map((paso) => ({ paso, opciones: generarOpciones(paso, escenas) })))
    setRespuestas(seleccion.map(() => null))
    setIndice(0)
    setTerminado(false)
  }

  const salir = () => {
    setPreguntas(null)
    setTerminado(false)
  }

  // Configuración
  if (!preguntas) {
    return (
      <div className="practica-ex practica-ex__config">
        <h2>Examen</h2>
        <p>Responde preguntas de opción múltiple sin ver si acertaste hasta el final.</p>
        <fieldset className="practica-ex__grupo">
          <legend>Cantidad</legend>
          {CANTIDADES.map((c) => (
            <button
              key={String(c.valor)}
              type="button"
              className={`practica__boton practica-ex__chip${cantidad === c.valor ? ' practica-ex__chip--activo' : ''}`}
              aria-pressed={cantidad === c.valor}
              onClick={() => setCantidad(c.valor)}
            >
              {c.etiqueta}
            </button>
          ))}
        </fieldset>
        <fieldset className="practica-ex__grupo">
          <legend>Alcance</legend>
          {ALCANCES.map((a) => (
            <button
              key={String(a.valor)}
              type="button"
              className={`practica__boton practica-ex__chip${alcance === a.valor ? ' practica-ex__chip--activo' : ''}`}
              aria-pressed={alcance === a.valor}
              onClick={() => setAlcance(a.valor)}
            >
              {a.etiqueta}
            </button>
          ))}
        </fieldset>
        <p className="practica-ex__disponibles">
          Líneas disponibles en este alcance: {disponibles}
        </p>
        <button type="button" className="practica__boton" disabled={disponibles === 0} onClick={iniciar}>
          Comenzar examen
        </button>

        <div className="practica-ex__historial">
          <p>
            <strong>Mejor puntaje:</strong> {intentos.length > 0 || mejor > 0 ? `${mejor} %` : 'aún sin intentos'}
          </p>
          {intentos.length > 0 && (
            <>
              <h3>Últimos intentos</h3>
              <ul className="practica-ex__intentos">
                {[...intentos].reverse().map((i, n) => (
                  <li key={`${i.fecha}-${n}`}>
                    {formatearFecha(i.fecha)} — {i.aciertos}/{i.total} ({i.porcentaje} %)
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    )
  }

  const total = preguntas.length

  // Resultado
  if (terminado) {
    const aciertos = preguntas.filter((p, n) => {
      const r = respuestas[n]
      return r !== null && p.opciones[r]?.correcta
    }).length
    const porcentaje = total > 0 ? Math.round((aciertos / total) * 100) : 0
    const errores = preguntas
      .map((p, n) => ({ p, n, r: respuestas[n] }))
      .filter(({ p, r }) => r === null || !p.opciones[r]?.correcta)

    return (
      <div className="practica-ex practica-ex__resultado">
        <h2>Resultado del examen</h2>
        <p className="practica-ex__puntaje">
          {aciertos} de {total} correctas ({porcentaje} %)
        </p>
        {errores.length === 0 ? (
          <p>¡Sin errores! Excelente.</p>
        ) : (
          <>
            <h3>Repaso de errores</h3>
            <ul className="practica-ex__errores">
              {errores.map(({ p, n, r }) => (
                <li key={p.paso.id} className="practica-ex__error">
                  <p className="practica__escena">
                    Pregunta {n + 1} · Escena {p.paso.numero}
                  </p>
                  {p.paso.pie ? <LineaView linea={p.paso.pie} /> : <p className="practica__acotacion">Inicio de escena</p>}
                  <p className="practica-ex__tu-respuesta">
                    Tu respuesta: {r === null ? 'sin responder' : p.opciones[r].texto}
                  </p>
                  <p className="practica__tuya">Correcta: {p.paso.linea.texto}</p>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="practica__nav">
          <button type="button" className="practica__boton" onClick={iniciar}>
            Repetir examen
          </button>
          <button type="button" className="practica__boton" onClick={salir}>
            Volver a la configuración
          </button>
        </div>
      </div>
    )
  }

  // Pregunta
  const pregunta = preguntas[indice]
  const elegida = respuestas[indice]
  const esUltima = indice === total - 1

  const elegir = (n: number) =>
    setRespuestas((prev) => prev.map((r, i) => (i === indice ? n : r)))

  const terminar = () => {
    const aciertos = preguntas.filter((p, n) => {
      const r = respuestas[n]
      return r !== null && p.opciones[r]?.correcta
    }).length
    progreso.registrarExamen(personaje, aciertos, total)
    setTerminado(true)
  }

  return (
    <div className="practica-ex practica-ex__pregunta">
      <p className="practica__progreso">
        Pregunta {indice + 1} de {total}
      </p>
      <p className="practica__escena">
        Escena {pregunta.paso.numero}
        {pregunta.paso.escena.titulo ? ` · ${pregunta.paso.escena.titulo}` : ''}
      </p>
      {pregunta.paso.pie ? (
        <LineaView linea={pregunta.paso.pie} />
      ) : (
        <p className="practica__acotacion">Inicio de escena</p>
      )}
      <p>¿Cuál es tu línea?</p>
      <ul className="practica-ex__opciones">
        {pregunta.opciones.map((o, n) => (
          <li key={n}>
            <button
              type="button"
              className={`practica__boton practica-ex__opcion${elegida === n ? ' practica-ex__opcion--elegida' : ''}`}
              aria-pressed={elegida === n}
              onClick={() => elegir(n)}
            >
              {o.texto}
            </button>
          </li>
        ))}
      </ul>
      <div className="practica__nav">
        <button type="button" className="practica__boton" disabled={indice === 0} onClick={() => setIndice(indice - 1)}>
          Anterior
        </button>
        {esUltima ? (
          <button type="button" className="practica__boton" disabled={elegida === null} onClick={terminar}>
            Terminar examen
          </button>
        ) : (
          <button type="button" className="practica__boton" disabled={elegida === null} onClick={() => setIndice(indice + 1)}>
            Siguiente
          </button>
        )}
        <button type="button" className="practica__boton" onClick={salir}>
          Abandonar
        </button>
      </div>
    </div>
  )
}
