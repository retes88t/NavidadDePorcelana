import PersonajeCard from '../components/PersonajeCard'
import { personajes } from '../data'

export default function Personajes() {
  return (
    <section className="pagina">
      <h1>Personajes</h1>
      <div className="personajes-grid">
        {personajes.map((p) => (
          <PersonajeCard key={p.id} personaje={p} />
        ))}
      </div>
    </section>
  )
}
