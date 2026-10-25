import { useEffect, useMemo, useState } from 'react'
import { escenas, personajes } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import SelectorPersonaje from '../components/practica/SelectorPersonaje'
import EnsayoPaso from '../components/practica/EnsayoPaso'
import { construirPasos } from '../components/practica/pasos'
import '../styles/practica.css'

type Progreso = { personaje: string; posiciones: Record<string, number> }

export default function Practica() {
  const [progreso, setProgreso] = useLocalStorage<Progreso>('navidad-practica', {
    personaje: personajes[0].id,
    posiciones: {},
  })
  const [revelada, setRevelada] = useState(false)

  const personaje = personajes.find((p) => p.id === progreso.personaje) ?? personajes[0]
  const pasos = useMemo(() => construirPasos(escenas, personaje.id), [personaje.id])
  const posicion = Math.min(Math.max(progreso.posiciones[personaje.id] ?? 0, 0), Math.max(pasos.length - 1, 0))

  useEffect(() => setRevelada(false), [personaje.id, posicion])

  const irA = (n: number) =>
    setProgreso((p) => ({ ...p, posiciones: { ...p.posiciones, [personaje.id]: n } }))

  const paso = pasos[posicion]

  return (
    <section className="pagina practica">
      <h1>Práctica de líneas</h1>
      <p>
        Elige un personaje. Las líneas de los demás se muestran; las tuyas están ocultas para que las ensayes y las
        reveles cuando quieras. Tu progreso se guarda en este navegador.
      </p>
      <SelectorPersonaje
        personajes={personajes}
        seleccionado={personaje.id}
        onCambiar={(id) => setProgreso((p) => ({ ...p, personaje: id }))}
      />
      {paso ? (
        <>
          <p className="practica__progreso">
            Ensayando a {personaje.nombreCorto} · línea {posicion + 1} de {pasos.length}
          </p>
          <EnsayoPaso paso={paso} revelada={revelada} onRevelar={setRevelada} />
          <div className="practica__nav">
            <button type="button" className="practica__boton" disabled={posicion === 0} onClick={() => irA(posicion - 1)}>
              Anterior
            </button>
            <button type="button" className="practica__boton" disabled={posicion === 0} onClick={() => irA(0)}>
              Volver al inicio
            </button>
            <button
              type="button"
              className="practica__boton"
              disabled={posicion >= pasos.length - 1}
              onClick={() => irA(posicion + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p>Este personaje no tiene líneas en el guion.</p>
      )}
    </section>
  )
}
