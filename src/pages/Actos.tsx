import { actos, escenas } from '../data'
import '../styles/actos-escenas.css'

export default function Actos() {
  return (
    <section className="pagina">
      <h1>Actos</h1>
      <div className="actos-lista">
        {actos.map((acto) => {
          const delActo = escenas.filter((e) => e.acto === acto.numero)
          const rango = delActo.length
            ? `Escenas ${delActo[0].numero} a ${delActo[delActo.length - 1].numero}`
            : ''
          return (
            <article key={acto.numero} className="acto-card">
              <h2>{acto.titulo}</h2>
              <p>{acto.resumen}</p>
              {rango && <p className="acto-card__meta">{rango}</p>}
            </article>
          )
        })}
      </div>
    </section>
  )
}
