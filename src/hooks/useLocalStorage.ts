import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(clave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const crudo = window.localStorage.getItem(clave)
      return crudo !== null ? (JSON.parse(crudo) as T) : inicial
    } catch {
      return inicial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor))
    } catch {
      // almacenamiento no disponible: se ignora
    }
  }, [clave, valor])

  const actualizar = useCallback((nuevo: T | ((previo: T) => T)) => setValor(nuevo), [])
  return [valor, actualizar] as const
}
