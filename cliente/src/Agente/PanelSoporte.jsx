import { Link } from 'react-router-dom'
import { useSesion } from '../Sesion/SesionContext'
import { usePeticion } from '../componentes/usePeticion'
import ListaTickets from '../componentes/ListaTickets'
import Metricas from '../componentes/Metricas'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'
import '../Tickets/Tickets.css'

const PESO_PRIORIDAD = { ALTA: 0, MEDIA: 1, BAJA: 2 }

function ordenarPorUrgencia(a, b) {
  const prioridad = PESO_PRIORIDAD[a.prioridad] - PESO_PRIORIDAD[b.prioridad]
  if (prioridad !== 0) return prioridad
  return new Date(a.updatedAt) - new Date(b.updatedAt)
}

export default function PanelSoporte() {
  const { usuario } = useSesion()
  const { datos, error } = usePeticion('/tickets')
  const tickets = datos?.result ?? []

  const atender = tickets.filter((ticket) => ['ABIERTO', 'EN_CURSO'].includes(ticket.estado)).sort(ordenarPorUrgencia)
  const esperando = tickets.filter((ticket) => ticket.estado === 'PENDIENTE_CLIENTE').sort(ordenarPorUrgencia)

  return (
    <div className="pagina">
      <header className="pagina-cabecera pagina-cabecera-acciones">
        <div>
          <h1>Panel de soporte</h1>
          <p className="pagina-intro">Hola, {usuario.nombre}. Estos son los tickets que tienes asignados.</p>
        </div>
        <Link to="/tickets" className="boton boton-secundario">
          Ver todos con filtros
        </Link>
      </header>

      <Aviso tipo="error">{error}</Aviso>
      {!datos && !error && <Cargando texto="Cargando tus tickets…" />}

      {datos && (
        <>
          <Metricas tickets={tickets} />

          <section className="seccion" aria-labelledby="titulo-atender">
            <h2 id="titulo-atender">Por atender</h2>
            <p className="panel-texto">Abiertos y en curso, de mayor a menor prioridad y del más antiguo al más reciente.</p>
            <ListaTickets tickets={atender} mostrarCliente vacio="No tienes tickets pendientes de respuesta." />
          </section>

          <section className="seccion" aria-labelledby="titulo-esperando">
            <h2 id="titulo-esperando">Esperando al alumno</h2>
            <ListaTickets tickets={esperando} mostrarCliente vacio="Ningún ticket está esperando respuesta del alumno." />
          </section>
        </>
      )}
    </div>
  )
}
