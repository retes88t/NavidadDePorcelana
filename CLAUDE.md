# Navidad de Porcelana

Sitio web de presentación del guion "Navidad de Porcelana": personajes, actos, escenas, árbol relacional, sinopsis, visor del guion y módulo de práctica de líneas. Todo el contenido visible va en español.

## Stack
- Vite + React 18 + TypeScript (estricto)
- `react-router-dom` con `HashRouter` (compatible con GitHub Pages)
- Sin backend ni servicios externos; el progreso se guarda en `localStorage`

## Scripts
- `npm install` — instala dependencias
- `npm run dev` — servidor de desarrollo
- `npm run build` — `tsc -b` + build de producción en `dist/`
- `npm run preview` — previsualiza el build

## Estructura
- `src/data/` — datos estáticos y tipos (`types.ts`, `personajes.ts`, `actos.ts`, `escenas-meta.ts`, `relaciones.ts`, `sinopsis.ts`, `index.ts`)
- `src/data/guion/` — transcripción por acto (`acto1.ts`, `acto2.ts`, `acto3.ts`)
- `src/pages/` — una página por ruta
- `src/components/` — componentes reutilizables
- `src/hooks/` — hooks (p. ej. `useLocalStorage`)
- `src/styles/` — CSS global y variables
- `public/guion/` — PDF del guion; `public/avatares/` — SVG de personajes

## Despliegue
- GitHub Pages vía `.github/workflows/deploy.yml` (push a `main`: `npm ci`, `npm run build`, publica `dist/`). Requiere `Settings > Pages > Source: GitHub Actions`. Detalle en `README.md`.

## Convenciones
- `base` de Vite: `/NavidadDePorcelana/`. Para assets en `public/` usar `import.meta.env.BASE_URL`.
- Componentes en PascalCase, hooks `useXxx`, archivos de datos en minúsculas con guiones.
- Los ids de personaje son canónicos: `luis`, `adriana`, `ana`, `luisfer`, `nora`, `chelo`, `astrid`.
- El guion se transcribe tal cual, sin corregir sus inconsistencias.
- Cambios mínimos; no agregar dependencias pesadas sin necesidad.
