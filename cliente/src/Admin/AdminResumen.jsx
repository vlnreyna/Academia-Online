import { Link } from 'react-router-dom'
import { nombreCompleto } from '../Config'
import { usePeticion } from '../componentes/usePeticion'
import ListaTickets from '../componentes/ListaTickets'
import Metricas from '../componentes/Metricas'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'
import '../Tickets/Tickets.css'

function cargaPorAgente(tickets) {
  const agentes = new Map()
  tickets.forEach((ticket) => {
    if (!ticket.agente) return
    const entrada = agentes.get(ticket.agente._id) ?? { agente: ticket.agente, activos: 0, resueltos: 0 }
    if (['RESUELTO', 'CERRADO'].includes(ticket.estado)) entrada.resueltos += 1
    else entrada.activos += 1
    agentes.set(ticket.agente._id, entrada)
  })
  return [...agentes.values()].sort((a, b) => b.activos - a.activos)
}

export default function AdminResumen() {
  const { datos, error } = usePeticion('/tickets')
  const tickets = datos?.result ?? []

  const sinAsignar = tickets
    .filter((ticket) => !ticket.agente && ticket.estado !== 'CERRADO')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const porAgente = cargaPorAgente(tickets)

  if (error) return <Aviso tipo="error">{error}</Aviso>
  if (!datos) return <Cargando texto="Calculando indicadores…" />

  return (
    <>
      <Metricas tickets={tickets} />

      <section className="seccion" aria-labelledby="titulo-sin-asignar">
        <div className="seccion-cabecera">
          <h2 id="titulo-sin-asignar">Pendientes de asignar</h2>
          <Link to="/tickets" className="boton-enlace">
            Ver todos los tickets
          </Link>
        </div>
        <p className="panel-texto">Abre un ticket para asignarlo a un agente. Los más antiguos aparecen primero.</p>
        <ListaTickets tickets={sinAsignar} mostrarCliente vacio="Todos los tickets abiertos tienen agente asignado." />
      </section>

      <section className="seccion" aria-labelledby="titulo-agentes">
        <h2 id="titulo-agentes">Carga por agente</h2>
        {porAgente.length === 0 ? (
          <div className="vacio">Todavía no hay tickets asignados.</div>
        ) : (
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Agente</th>
                  <th scope="col" className="numero">En gestión</th>
                  <th scope="col" className="numero">Resueltos o cerrados</th>
                </tr>
              </thead>
              <tbody>
                {porAgente.map((fila) => (
                  <tr key={fila.agente._id}>
                    <td>
                      <Link to={`/tickets?agente=${fila.agente._id}`}>{nombreCompleto(fila.agente)}</Link>
                    </td>
                    <td className="numero">{fila.activos}</td>
                    <td className="numero">{fila.resueltos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
