import { NavLink } from 'react-router-dom'
import { rutas } from './rutas'

export default function Navbar() {
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
        </ul>
      </nav>
    </header>
  )
}
