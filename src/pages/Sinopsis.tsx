import { sinopsisGuion, resumenPropio, conclusiones } from '../data/sinopsis'
import '../styles/sinopsis.css'

export default function Sinopsis() {
  return (
    <section className="pagina sinopsis">
      <h1>Sinopsis</h1>

      <article className="sinopsis-bloque sinopsis-guion">
        <h2>Sinopsis del guion</h2>
        <p className="sinopsis-cita">{sinopsisGuion}</p>
      </article>

      <article className="sinopsis-bloque">
        <h2>Resumen</h2>
        {resumenPropio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <article className="sinopsis-bloque">
        <h2>Conclusiones</h2>
        <ul className="sinopsis-conclusiones">
          {conclusiones.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}
