import { Link } from 'react-router-dom'
import { codigoTicket, formatearFecha, nombreCompleto } from '../Config'
import { EstadoTicket, Prioridad } from './Insignias'

export default function ListaTickets({ tickets, mostrarCliente = false, mostrarAgente = false, vacio }) {
  if (tickets.length === 0) {
    return <div className="vacio">{vacio ?? 'No hay tickets que coincidan con estos filtros.'}</div>
  }

  return (
    <ul className="lista-tickets">
      {tickets.map((ticket) => (
        <li key={ticket._id}>
          <Link to={`/tickets/${ticket._id}`} className="fila-ticket">
            <span className="fila-ticket-codigo">{codigoTicket(ticket._id)}</span>
            <span className="fila-ticket-asunto">
              <strong>{ticket.asunto}</strong>
              <span className="fila-ticket-meta">
                {ticket.categoria?.nombre ?? 'Sin categoría'}
                {mostrarCliente && <> · {nombreCompleto(ticket.cliente)}</>}
                {mostrarAgente && <> · {ticket.agente ? nombreCompleto(ticket.agente) : 'Sin asignar'}</>}
              </span>
            </span>
            <span className="fila-ticket-estado">
              <EstadoTicket estado={ticket.estado} />
              <Prioridad prioridad={ticket.prioridad} />
            </span>
            <span className="fila-ticket-fecha">{formatearFecha(ticket.updatedAt)}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
