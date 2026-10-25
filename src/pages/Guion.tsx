import './Guion.css'

const RUTA_PDF = `${import.meta.env.BASE_URL}guion/navidad-de-porcelana.pdf`

export default function Guion() {
  return (
    <section className="pagina">
      <h1>Guion</h1>
      <p>Lee el guion completo de "Navidad de Porcelana" aquí mismo o descárgalo en PDF.</p>
      <div className="guion__acciones">
        <a className="guion__boton" href={RUTA_PDF} download="navidad-de-porcelana.pdf">
          Descargar PDF
        </a>
        <a className="guion__boton guion__boton--secundario" href={RUTA_PDF} target="_blank" rel="noreferrer">
          Abrir en una pestaña nueva
        </a>
      </div>
      <object className="guion__visor" data={RUTA_PDF} type="application/pdf" aria-label="Guion en PDF">
        <div className="guion__fallback">
          <p>Tu navegador no puede mostrar el PDF dentro de la página.</p>
          <p>
            <a href={RUTA_PDF} download="navidad-de-porcelana.pdf">Descarga el guion</a> o{' '}
            <a href={RUTA_PDF} target="_blank" rel="noreferrer">ábrelo en una pestaña nueva</a>.
          </p>
        </div>
      </object>
    </section>
  )
}
