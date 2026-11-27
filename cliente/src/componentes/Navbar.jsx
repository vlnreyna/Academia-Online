import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSesion } from '../Sesion/SesionContext'
import './Navbar.css'

const ENLACES = {
  VISITANTE: [
    { a: '/', texto: 'Inicio' },
    { a: '/cursos', texto: 'Cursos' },
  ],
  ALUMNO: [
    { a: '/cursos', texto: 'Cursos' },
    { a: '/tickets', texto: 'Mis tickets' },
    { a: '/perfil', texto: 'Mi cuenta' },
  ],
  AGENTE: [
    { a: '/soporte', texto: 'Panel de soporte' },
    { a: '/tickets', texto: 'Tickets asignados' },
    { a: '/cursos', texto: 'Cursos' },
    { a: '/perfil', texto: 'Mi cuenta' },
  ],
  ADMIN: [
    { a: '/admin', texto: 'Administración' },
    { a: '/tickets', texto: 'Tickets' },
    { a: '/cursos', texto: 'Cursos' },
    { a: '/perfil', texto: 'Mi cuenta' },
  ],
}

export default function Navbar() {
  const { usuario, cerrarSesion } = useSesion()
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)
  const enlaces = ENLACES[usuario?.rol ?? 'VISITANTE'] ?? ENLACES.VISITANTE

  const cerrar = () => setAbierto(false)

  const salir = () => {
    cerrar()
    cerrarSesion()
    navigate('/')
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-marca" onClick={cerrar}>
        <img src="/logo-academia-aldea.svg" alt="" width="32" height="32" />
        <span>Academia Aldea</span>
      </Link>

      <button
        type="button"
        className="navbar-menu"
        aria-expanded={abierto}
        aria-controls="navbar-enlaces"
        onClick={() => setAbierto(!abierto)}
      >
        {abierto ? 'Cerrar' : 'Menú'}
      </button>

      <nav id="navbar-enlaces" className={abierto ? 'navbar-enlaces abierto' : 'navbar-enlaces'} aria-label="Principal">
        {enlaces.map((enlace) => (
          <NavLink key={enlace.a} to={enlace.a} end={enlace.a === '/'} className="navbar-enlace" onClick={cerrar}>
            {enlace.texto}
          </NavLink>
        ))}
        {usuario ? (
          <button type="button" className="navbar-salir" onClick={salir}>
            Cerrar sesión
          </button>
        ) : (
          <Link to="/acceso" className="boton boton-principal navbar-entrar" onClick={cerrar}>
            Entrar
          </Link>
        )}
      </nav>
    </header>
  )
}
