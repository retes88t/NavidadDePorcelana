import type { Personaje } from '../data/types'

type Props = { personaje: Personaje }

export default function PersonajeCard({ personaje }: Props) {
  const avatar = `${import.meta.env.BASE_URL}avatares/${personaje.id}.svg`
  return (
    <article className="personaje-card">
      <img
        className="personaje-card__avatar"
        src={avatar}
        alt={`Avatar de ${personaje.nombreCorto}`}
        width={120}
        height={120}
      />
      <div className="personaje-card__cuerpo">
        <h2 className="personaje-card__nombre">{personaje.nombre}</h2>
        <p className="personaje-card__meta">
          <span>{personaje.edad}</span>
          <span className="personaje-card__actor">Interpretado por {personaje.actor}</span>
        </p>
        <p className="personaje-card__desc">{personaje.descripcion}</p>
      </div>
    </article>
  )
}
