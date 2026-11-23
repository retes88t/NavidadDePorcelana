import { NavLink } from 'react-router-dom'
import { rutas } from './rutas'
import { useTema } from '../hooks/useTema'

export default function Navbar() {
  const { tema, alternar } = useTema()
  const oscuro = tema === 'oscuro'
  return (
    <header className="navbar">
      <nav className="navbar__interior" aria-label="Navegación principal">
        <NavLink to="/" className="navbar__marca">
          Navidad de Porcelana
        </NavLink>
        <ul className="navbar__lista">
          {rutas.map((r) => (
            <li key={r.path}>
              <NavLink
                to={r.path}
                className={({ isActive }) => `navbar__link${isActive ? ' activo' : ''}`}
              >
                {r.etiqueta}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="navbar__tema"
              onClick={alternar}
              aria-pressed={oscuro}
              title={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              <span aria-hidden="true">{oscuro ? '☀' : '☾'}</span> {oscuro ? 'Claro' : 'Oscuro'}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
