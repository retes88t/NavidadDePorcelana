import type { Personaje } from '../../data/types'

type Props = {
  personajes: Personaje[]
  seleccionado: string
  onCambiar: (id: string) => void
  porcentajes?: Record<string, number>
}

export default function SelectorPersonaje({ personajes, seleccionado, onCambiar, porcentajes }: Props) {
  return (
    <div className="practica__selector" role="group" aria-label="Elegir personaje">
      {personajes.map((p) => (
        <button
          key={p.id}
          type="button"
          className={'practica__chip' + (p.id === seleccionado ? ' activo' : '')}
          aria-pressed={p.id === seleccionado}
          onClick={() => onCambiar(p.id)}
        >
          {p.nombreCorto}
          {porcentajes && <span className="practica__selector-porcentaje">{porcentajes[p.id] ?? 0}%</span>}
        </button>
      ))}
    </div>
  )
}
