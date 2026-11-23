import { useCallback, useEffect, useState } from 'react'

export type Tema = 'claro' | 'oscuro'

export const CLAVE_TEMA = 'navidad-tema'

/** Tema inicial: el aplicado por el script de index.html, o la preferencia del sistema. */
function temaInicial(): Tema {
  const actual = document.documentElement.dataset.tema
  if (actual === 'claro' || actual === 'oscuro') return actual
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.tema = tema
  }, [tema])

  const alternar = useCallback(() => {
    setTema((previo) => {
      const nuevo: Tema = previo === 'oscuro' ? 'claro' : 'oscuro'
      try {
        window.localStorage.setItem(CLAVE_TEMA, nuevo)
      } catch {
        // almacenamiento no disponible: se ignora
      }
      return nuevo
    })
  }, [])

  return { tema, alternar }
}
