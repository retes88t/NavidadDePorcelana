# Navidad de Porcelana

Sitio de presentación del guion "Navidad de Porcelana": personajes, actos, escenas, árbol relacional, sinopsis, visor del guion y práctica de líneas.

## Desarrollo
```
npm install
npm run dev
npm run build
npm run preview
```

## Despliegue en GitHub Pages
- El workflow `.github/workflows/deploy.yml` hace build y publica `dist/` al hacer push a `main`.
- Configuración única: en el repositorio, `Settings > Pages > Source: GitHub Actions`.
- `vite.config.ts` usa `base: '/NavidadDePorcelana/'`; el sitio queda en `https://<usuario>.github.io/NavidadDePorcelana/`.
- Se usa `HashRouter`, por lo que las rutas funcionan sin configuración del servidor.
- Los assets de `public/` (PDF, avatares) se referencian con `import.meta.env.BASE_URL`.
