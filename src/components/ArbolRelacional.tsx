import { useMemo, useState } from 'react'
import { nodos, relaciones } from '../data'
import type { TipoRelacion } from '../data'
import '../styles/arbol.css'

const ANCHO = 900
const ALTO = 720
const RADIO = 36

const posiciones: Record<string, { x: number; y: number }> = {
  abuelos: { x: 450, y: 60 },
  jenny: { x: 80, y: 200 },
  luis: { x: 270, y: 200 },
  ana: { x: 680, y: 200 },
  adriana: { x: 270, y: 370 },
  nora: { x: 80, y: 560 },
  luisfer: { x: 290, y: 560 },
  chelo: { x: 530, y: 560 },
  astrid: { x: 790, y: 560 },
}

const estilos: Record<
  TipoRelacion,
  { nombre: string; color: string; dash?: string; ancho: number }
> = {
  pareja: { nombre: 'Pareja', color: '#9b1c2e', ancho: 4 },
  'ex-pareja': { nombre: 'Ex pareja', color: '#9b1c2e', dash: '10 6', ancho: 3 },
  hermanos: { nombre: 'Hermanos', color: '#2f6b4f', ancho: 3 },
  amistad: { nombre: 'Amistad', color: '#c19a4b', dash: '2 6', ancho: 4 },
  conflicto: { nombre: 'Conflicto', color: '#e07a1f', dash: '3 3', ancho: 3 },
  parentesco: { nombre: 'Parentesco', color: '#8a7b74', ancho: 2 },
}

// Curvatura extra para evitar que una arista atraviese otro nodo.
const curvaExtra: Record<string, number> = {
  'astrid|luisfer': 110,
}

const clavePar = (a: string, b: string) => [a, b].sort().join('|')

function nombreNodo(id: string) {
  return nodos.find((n) => n.id === id)?.nombre ?? id
}

export default function ArbolRelacional() {
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const base = import.meta.env.BASE_URL

  const aristas = useMemo(() => {
    const grupos = new Map<string, number[]>()
    relaciones.forEach((r, i) => {
      const k = clavePar(r.origen, r.destino)
      grupos.set(k, [...(grupos.get(k) ?? []), i])
    })
    return relaciones.map((r, i) => {
      const k = clavePar(r.origen, r.destino)
      const grupo = grupos.get(k)!
      const pos = grupo.indexOf(i)
      const desplazamiento =
        (pos - (grupo.length - 1) / 2) * 50 + (curvaExtra[k] ?? 0)
      const [a, b] = [posiciones[r.origen], posiciones[r.destino]]
      // Se orienta siempre desde el id menor para que el desplazamiento sea consistente.
      const invertir = r.origen > r.destino
      const p1 = invertir ? b : a
      const p2 = invertir ? a : b
      const mx = (p1.x + p2.x) / 2
      const my = (p1.y + p2.y) / 2
      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const largo = Math.hypot(dx, dy) || 1
      const cx = mx + (-dy / largo) * desplazamiento * 2
      const cy = my + (dx / largo) * desplazamiento * 2
      return {
        relacion: r,
        d: `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`,
      }
    })
  }, [])

  const activa = (origen: string, destino: string) =>
    seleccion === null || seleccion === origen || seleccion === destino

  const relacionesVisibles = relaciones.filter((r) => activa(r.origen, r.destino))

  return (
    <div className="arbol">
      <div className="arbol-leyenda" aria-label="Leyenda">
        {(Object.keys(estilos) as TipoRelacion[]).map((tipo) => {
          const e = estilos[tipo]
          return (
            <span className="arbol-leyenda-item" key={tipo}>
              <svg width="42" height="12" aria-hidden="true">
                <line
                  x1="2"
                  y1="6"
                  x2="40"
                  y2="6"
                  stroke={e.color}
                  strokeWidth={e.ancho}
                  strokeDasharray={e.dash}
                  strokeLinecap="round"
                />
              </svg>
              {e.nombre}
            </span>
          )
        })}
        <span className="arbol-leyenda-item">
          <span className="arbol-leyenda-ausente" aria-hidden="true" />
          No presente en escena
        </span>
      </div>

      <p className="arbol-ayuda">
        Toca un personaje para resaltar sus relaciones. En pantallas chicas puedes
        desplazar el diagrama horizontalmente.
      </p>

      <div className="arbol-scroll">
        <svg
          className="arbol-svg"
          viewBox={`0 0 ${ANCHO} ${ALTO}`}
          role="img"
          aria-label="Diagrama de relaciones entre los personajes"
        >
          <defs>
            {nodos.map((n) => (
              <clipPath id={`clip-${n.id}`} key={n.id}>
                <circle cx={posiciones[n.id].x} cy={posiciones[n.id].y} r={RADIO} />
              </clipPath>
            ))}
          </defs>

          <g>
            {aristas.map(({ relacion: r, d }, i) => {
              const e = estilos[r.tipo]
              const on = activa(r.origen, r.destino)
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={e.color}
                  strokeWidth={e.ancho}
                  strokeDasharray={e.dash}
                  strokeLinecap="round"
                  opacity={on ? 0.9 : 0.1}
                >
                  <title>{`${nombreNodo(r.origen)} y ${nombreNodo(r.destino)}: ${e.nombre}${r.descripcion ? ' — ' + r.descripcion : ''}`}</title>
                </path>
              )
            })}
          </g>

          <g>
            {nodos.map((n) => {
              const { x, y } = posiciones[n.id]
              const on = seleccion === null || seleccion === n.id
              const sel = seleccion === n.id
              return (
                <g
                  key={n.id}
                  className={`arbol-nodo${n.presente ? '' : ' ausente'}${sel ? ' sel' : ''}`}
                  opacity={on || !n.presente ? (on ? 1 : 0.5) : 0.5}
                  tabIndex={0}
                  role="button"
                  aria-pressed={sel}
                  aria-label={`${n.nombre}${n.presente ? '' : ' (no presente)'}`}
                  onClick={() => setSeleccion(sel ? null : n.id)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      setSeleccion(sel ? null : n.id)
                    }
                  }}
                >
                  <circle cx={x} cy={y} r={RADIO + 4} fill="#fff" />
                  <image
                    href={`${base}avatares/${n.id}.svg`}
                    x={x - RADIO}
                    y={y - RADIO}
                    width={RADIO * 2}
                    height={RADIO * 2}
                    clipPath={`url(#clip-${n.id})`}
                    opacity={n.presente ? 1 : 0.55}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={RADIO}
                    fill="none"
                    className="arbol-borde"
                    strokeDasharray={n.presente ? undefined : '6 4'}
                  />
                  <text x={x} y={y + RADIO + 22} textAnchor="middle" className="arbol-etiqueta">
                    {n.id === 'abuelos' ? 'Abuelos' : n.nombre}
                  </text>
                  {!n.presente && (
                    <text x={x} y={y + RADIO + 38} textAnchor="middle" className="arbol-subetiqueta">
                      (no presente)
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <h2 className="arbol-subtitulo">
        {seleccion ? `Relaciones de ${nombreNodo(seleccion)}` : 'Todas las relaciones'}
      </h2>
      <ul className="arbol-lista">
        {relacionesVisibles.map((r, i) => {
          const e = estilos[r.tipo]
          return (
            <li key={i}>
              <span className="arbol-chip" style={{ background: e.color }}>
                {e.nombre}
              </span>{' '}
              <strong>
                {nombreNodo(r.origen)} y {nombreNodo(r.destino)}
              </strong>
              {r.descripcion ? ` — ${r.descripcion}` : ''}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
