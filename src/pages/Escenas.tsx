import { useState } from 'react'
import { actos, escenas } from '../data'
import '../styles/actos-escenas.css'

type Filtro = 'todos' | 1 | 2 | 3

export default function Escenas() {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const visibles = actos.filter((a) => filtro === 'todos' || a.numero === filtro)

  return (
    <section className="pagina">
      <h1>Escenas</h1>
      <div className="filtro-actos" role="group" aria-label="Filtrar por acto">
        <button type="button" aria-pressed={filtro === 'todos'} onClick={() => setFiltro('todos')}>
          Todas
        </button>
        {actos.map((a) => (
          <button
            key={a.numero}
            type="button"
            aria-pressed={filtro === a.numero}
            onClick={() => setFiltro(a.numero)}
          >
            {a.titulo}
          </button>
        ))}
      </div>
      {visibles.map((acto) => (
        <div key={acto.numero} className="escenas-grupo">
          <h2>{acto.titulo}</h2>
          <div className="escenas-grid">
            {escenas
              .filter((e) => e.acto === acto.numero)
              .map((e) => (
                <article key={e.numero} className="escena-card">
                  <span className="escena-card__num">Escena {e.numero}</span>
                  <span className="escena-card__acto">{acto.titulo}</span>
                  <h3>{e.titulo || 'Sin título'}</h3>
                  <p className="escena-card__lugar">{e.lugar}</p>
                  <p>{e.resumen}</p>
                </article>
              ))}
          </div>
        </div>
      ))}
    </section>
  )
}
