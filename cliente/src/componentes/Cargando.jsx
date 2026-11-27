export default function Cargando({ texto = 'Cargando…' }) {
  return (
    <p className="cargando" role="status">
      <span className="cargando-barra" aria-hidden="true" />
      {texto}
    </p>
  )
}
