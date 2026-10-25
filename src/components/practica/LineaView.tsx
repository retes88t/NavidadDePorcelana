import type { Linea } from '../../data/types'
import { personajes } from '../../data'

function nombre(id: string): string {
  if (id === 'todos') return 'Todos'
  return personajes.find((p) => p.id === id)?.nombreCorto ?? id
}

export default function LineaView({ linea }: { linea: Linea }) {
  if (linea.tipo === 'acotacion') {
    return <p className="practica__acotacion">{linea.texto}</p>
  }
  return (
    <p className="practica__dialogo">
      <strong>{nombre(linea.personaje)}</strong>
      {linea.acotacion && <em> ({linea.acotacion})</em>}: {linea.texto}
    </p>
  )
}
