import { Link } from 'react-router-dom'

export default function Pie() {
  return (
    <footer className="pie">
      <div className="pie-marca">
        <img src={`${import.meta.env.BASE_URL}logo-academia-aldea.png`} alt="" width="40" height="40" />
        <p>
          Academia Aldea
          <span>Cursos online con soporte por tickets</span>
        </p>
      </div>
      <nav className="pie-enlaces" aria-label="Pie de página">
        <Link to="/">Inicio</Link>
        <Link to="/cursos">Cursos</Link>
      </nav>
      <p className="pie-legal">Proyecto académico de DAM. Los datos y matrículas son ficticios.</p>
    </footer>
  )
}
