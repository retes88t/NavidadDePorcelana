import { useMemo, useState } from 'react'
import type { Paso } from './pasos'
import type { useProgresoPractica } from '../../hooks/useProgresoPractica'
import { ETAPA_MAXIMA, ocultarPalabras } from './borrador'
import LineaView from './LineaView'

type Props = {
  personaje: string
  pasos: Paso[]
  progreso: ReturnType<typeof useProgresoPractica>
}

const ETIQUETAS = ['0 % oculto', '33 % oculto', '66 % oculto', '100 % oculto']

export default function BorradorProgresivo({ personaje, pasos, progreso }: Props) {
  const [escenaFiltro, setEscenaFiltro] = useState<number | 'todas'>('todas')
  const [indice, setIndice] = useState(0)
  const [etapa, setEtapa] = useState(0)

  const escenas = useMemo(() => Array.from(new Set(pasos.map((p) => p.numero))), [pasos])
  const visibles = useMemo(
    () => (escenaFiltro === 'todas' ? pasos : pasos.filter((p) => p.numero === escenaFiltro)),
    [pasos, escenaFiltro],
  )

  if (visibles.length === 0) {
    return <p className="practica__acotacion">No hay líneas para practicar.</p>
  }

  const pos = Math.min(indice, visibles.length - 1)
  const paso = visibles[pos]
  const { escena, linea } = paso
  const dominada = progreso.obtenerLinea(personaje, paso.id)?.dominada ?? false
  const textoOculto = ocultarPalabras(linea.texto, etapa)

  const ir = (nuevo: number) => {
    setIndice(nuevo)
    setEtapa(0)
  }

  return (
    <article className="practica__paso practica-bp">
      <div className="practica-bp__filtro">
        <label>
          Escena:{' '}
          <select
            value={escenaFiltro}
            onChange={(e) => {
              setEscenaFiltro(e.target.value === 'todas' ? 'todas' : Number(e.target.value))
              ir(0)
            }}
          >
            <option value="todas">Todas</option>
            {escenas.map((n) => (
              <option key={n} value={n}>
                Escena {n}
              </option>
            ))}
          </select>
        </label>
        <span className="practica-bp__contador">
          Línea {pos + 1} de {visibles.length}
        </span>
      </div>

      <p className="practica__escena">
        Acto {escena.acto} · Escena {escena.numero}
        {escena.titulo ? `: ${escena.titulo}` : ''}
      </p>

      <div className="practica-bp__pie">
        {paso.pie ? <LineaView linea={paso.pie} /> : <p className="practica__acotacion">Inicio de escena</p>}
      </div>

      <div className="practica__tuya">
        <LineaView linea={{ ...linea, texto: textoOculto }} />
        <p className="practica-bp__etapa">
          Etapa {etapa + 1} de {ETAPA_MAXIMA + 1} ({ETIQUETAS[etapa]})
          {dominada && <span className="practica-bp__dominada"> · Dominada</span>}
        </p>
        <div className="practica-bp__acciones">
          <button
            type="button"
            className="practica__boton"
            disabled={etapa >= ETAPA_MAXIMA}
            onClick={() => setEtapa(etapa + 1)}
          >
            Ocultar más
          </button>
          <button
            type="button"
            className="practica__boton"
            disabled={etapa === 0}
            onClick={() => setEtapa(0)}
          >
            Mostrar todo
          </button>
        </div>
        {etapa === ETAPA_MAXIMA && (
          <div className="practica-bp__autoevaluacion">
            <p>Recítala de memoria. ¿Te la sabes?</p>
            <div className="practica-bp__acciones">
              <button
                type="button"
                className="practica__boton"
                onClick={() => progreso.marcarDominada(personaje, paso.id, true)}
              >
                La sé
              </button>
              <button
                type="button"
                className="practica__boton"
                onClick={() => progreso.marcarDominada(personaje, paso.id, false)}
              >
                Repasar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="practica-bp__nav">
        <button type="button" className="practica__boton" disabled={pos === 0} onClick={() => ir(pos - 1)}>
          Anterior
        </button>
        <button
          type="button"
          className="practica__boton"
          disabled={pos >= visibles.length - 1}
          onClick={() => ir(pos + 1)}
        >
          Siguiente
        </button>
      </div>
    </article>
  )
}
