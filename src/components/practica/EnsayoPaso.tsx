import type { Paso } from './pasos'
import LineaView from './LineaView'

type Props = {
  paso: Paso
  revelada: boolean
  onRevelar: (valor: boolean) => void
}

export default function EnsayoPaso({ paso, revelada, onRevelar }: Props) {
  const { escena, contexto, linea } = paso
  return (
    <article className="practica__paso">
      <p className="practica__escena">
        Acto {escena.acto} · Escena {escena.numero}
        {escena.titulo ? `: ${escena.titulo}` : ''}
      </p>
      <div className="practica__contexto">
        {contexto.length === 0 && <p className="practica__acotacion">(Inicio de tu intervención en la escena)</p>}
        {contexto.map((l, i) => (
          <LineaView key={i} linea={l} />
        ))}
      </div>
      <div className="practica__tuya">
        {revelada ? (
          <LineaView linea={linea} />
        ) : (
          <p className="practica__oculta">Tu línea está oculta. Ensáyala y después revélala.</p>
        )}
        <button type="button" className="practica__boton" onClick={() => onRevelar(!revelada)}>
          {revelada ? 'Ocultar línea' : 'Revelar línea'}
        </button>
      </div>
    </article>
  )
}
