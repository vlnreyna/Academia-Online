import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '../componentes/Navbar'
import Pie from '../componentes/Pie'
import RutaProtegida from '../Sesion/RutaProtegida'
import Home from '../Home/Home'
import Acceso from '../Acceso/Acceso'
import Cursos from '../Cursos/Cursos'
import CursoDetalle from '../Cursos/CursoDetalle'
import CursoFormulario from '../Cursos/CursoFormulario'
import Perfil from '../Perfil/Perfil'
import Tickets from '../Tickets/Tickets'
import NuevoTicket from '../Tickets/NuevoTicket'
import TicketDetalle from '../Tickets/TicketDetalle'
import PanelSoporte from '../Agente/PanelSoporte'
import Admin from '../Admin/Admin'

function NoEncontrada() {
  return (
    <div className="pagina">
      <h1>Página no encontrada</h1>
      <p className="pagina-intro">La dirección que has abierto no existe o ha cambiado.</p>
      <Link to="/" className="boton boton-principal">
        Ir al inicio
      </Link>
    </div>
  )
}

function useDesplazamiento() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
}

export default function App() {
  useDesplazamiento()

  return (
    <>
      <a href="#contenido" className="saltar">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className="principal">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/acceso" element={<Acceso />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:id" element={<CursoDetalle />} />

          <Route element={<RutaProtegida />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/:id" element={<TicketDetalle />} />
          </Route>

          <Route element={<RutaProtegida roles={['ALUMNO', 'ADMIN']} />}>
            <Route path="/tickets/nuevo" element={<NuevoTicket />} />
          </Route>

          <Route element={<RutaProtegida roles={['AGENTE']} />}>
            <Route path="/soporte" element={<PanelSoporte />} />
          </Route>

          <Route element={<RutaProtegida roles={['ADMIN']} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/cursos/nuevo" element={<CursoFormulario />} />
            <Route path="/cursos/:id/editar" element={<CursoFormulario />} />
          </Route>

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Pie />
    </>
  )
}
