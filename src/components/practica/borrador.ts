export const ETAPA_MAXIMA = 3;

const OCULTO = '____';
const FRACCIONES = [0, 1 / 3, 2 / 3, 1];

// Hash determinista simple (FNV-1a) para ordenar las palabras de forma estable.
function hash(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Separa en palabras y espacios; separa puntuación inicial/final de la parte ocultable.
const PALABRA = /^([^\p{L}\p{N}]*)([\p{L}\p{N}].*?)([^\p{L}\p{N}]*)$/u;

/**
 * Devuelve el texto con palabras reemplazadas por `____` según la etapa
 * (0 = 0 %, 1 = ~33 %, 2 = ~66 %, 3 = 100 % de palabras ocultas).
 * Determinista y acumulativo: lo oculto en una etapa sigue oculto en la siguiente.
 */
export function ocultarPalabras(texto: string, etapa: number): string {
  const e = Math.max(0, Math.min(ETAPA_MAXIMA, Math.floor(etapa)));
  const partes = texto.split(/(\s+)/);

  const indices: number[] = [];
  partes.forEach((parte, i) => {
    if (parte && !/^\s+$/.test(parte) && PALABRA.test(parte)) indices.push(i);
  });

  const cantidad = Math.ceil(indices.length * FRACCIONES[e]);
  if (cantidad === 0) return texto;

  // Orden fijo por hash (desempate por posición); se ocultan las primeras `cantidad`.
  const orden = indices
    .map((i) => ({ i, h: hash(`${i}:${partes[i].toLowerCase()}`) }))
    .sort((a, b) => a.h - b.h || a.i - b.i)
    .slice(0, cantidad);
  const ocultas = new Set(orden.map((o) => o.i));

  return partes
    .map((parte, i) => {
      if (!ocultas.has(i)) return parte;
      const m = PALABRA.exec(parte);
      return m ? `${m[1]}${OCULTO}${m[3]}` : parte;
    })
    .join('');
}
