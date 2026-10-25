import { Link } from 'react-router-dom'
import { rutas } from '../components/rutas'

export default function Inicio() {
  return (
    <section className="pagina">
      <div className="portada">
        <div className="portada__adorno" aria-hidden="true">❄ ✦ ❄</div>
        <h1 className="portada__titulo">Navidad de Porcelana</h1>
        <p className="portada__sub">
          Una cena de Navidad en la que una familia se reúne y todo lo que estaba guardado sale a la
          luz. Explora los personajes, los actos, las escenas y ensaya tus líneas.
        </p>
      </div>
      <div className="portada__grid">
        {rutas.map((r) => (
          <Link key={r.path} to={r.path} className="tarjeta-nav">
            <strong>{r.etiqueta}</strong>
            <span>{r.descripcion}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
