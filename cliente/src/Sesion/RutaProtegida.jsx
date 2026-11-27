import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSesion } from './SesionContext'
import Aviso from '../componentes/Aviso'

export default function RutaProtegida({ roles }) {
  const { usuario } = useSesion()
  const location = useLocation()

  if (!usuario) {
    return <Navigate to="/acceso" replace state={{ desde: location.pathname }} />
  }

  if (roles && !roles.includes(usuario.rol)) {
    return (
      <div className="pagina">
        <h1>Sin acceso</h1>
        <Aviso tipo="error">Tu cuenta no tiene permiso para ver esta sección.</Aviso>
      </div>
    )
  }

  return <Outlet />
}
