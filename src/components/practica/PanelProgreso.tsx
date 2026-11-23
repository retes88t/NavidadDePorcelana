import { useState } from 'react'
import type { useProgresoPractica } from '../../hooks/useProgresoPractica'

type Props = {
  progreso: ReturnType<typeof useProgresoPractica>
  personaje: string
  idsLineas: string[]
}

function Barra({ etiqueta, valor, destacada }: { etiqueta: string; valor: number; destacada?: boolean }) {
  return (
    <div className={`practica-panel__fila${destacada ? ' practica-panel__fila--total' : ''}`}>
      <div className="practica-panel__etiqueta">
        <span>{etiqueta}</span>
        <span>{valor}%</span>
      </div>
      <div className="practica-panel__barra">
        <div
          className="practica-panel__relleno"
          style={{ width: `${valor}%` }}
          role="progressbar"
          aria-valuenow={valor}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={etiqueta}
        />
      </div>
    </div>
  )
}

export default function PanelProgreso({ progreso, personaje, idsLineas }: Props) {
  const [confirmando, setConfirmando] = useState(false)
  const p = progreso.porcentajes(personaje, idsLineas)

  return (
    <section className="practica-panel" aria-label="Progreso">
      <h3 className="practica-panel__titulo">Tu progreso</h3>
      <Barra etiqueta="Total" valor={p.total} destacada />
      <Barra etiqueta="Opción múltiple" valor={p.opcionMultiple} />
      <Barra etiqueta="Borrador progresivo" valor={p.borrador} />
      <Barra etiqueta="Mejor examen" valor={progreso.mejorExamen(personaje)} />

      <div className="practica-panel__acciones">
        {confirmando ? (
          <>
            <span className="practica-panel__aviso">¿Seguro?</span>
            <button
              type="button"
              className="practica__boton practica-panel__confirmar"
              onClick={() => {
                progreso.reiniciarPersonaje(personaje)
                setConfirmando(false)
              }}
            >
              Sí, reiniciar
            </button>
            <button
              type="button"
              className="practica__boton"
              onClick={() => setConfirmando(false)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            type="button"
            className="practica__boton practica-panel__reiniciar"
            onClick={() => setConfirmando(true)}
          >
            Reiniciar progreso
          </button>
        )}
      </div>
    </section>
  )
}
