export type ModoPractica = 'ensayo' | 'opcion-multiple' | 'examen' | 'borrador'

type Props = {
  modo: ModoPractica
  onCambiar: (modo: ModoPractica) => void
}

const MODOS: { id: ModoPractica; titulo: string; descripcion: string }[] = [
  { id: 'ensayo', titulo: 'Ensayo', descripcion: 'Recorré tus líneas con su pie' },
  { id: 'opcion-multiple', titulo: 'Opción múltiple', descripcion: 'Elegí la línea correcta' },
  { id: 'examen', titulo: 'Examen', descripcion: 'Poné a prueba tu memoria' },
  { id: 'borrador', titulo: 'Borrador progresivo', descripcion: 'Ocultá palabras de a poco' },
]

export default function SelectorModo({ modo, onCambiar }: Props) {
  return (
    <div className="practica-modos" role="group" aria-label="Modo de práctica">
      {MODOS.map((m) => (
        <button
          key={m.id}
          type="button"
          className={`practica__boton practica-modos__boton${
            modo === m.id ? ' practica-modos__boton--activo' : ''
          }`}
          aria-pressed={modo === m.id}
          onClick={() => onCambiar(m.id)}
        >
          <span className="practica-modos__titulo">{m.titulo}</span>
          <span className="practica-modos__descripcion">{m.descripcion}</span>
        </button>
      ))}
    </div>
  )
}
