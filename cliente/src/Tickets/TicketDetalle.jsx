import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  ESTADOS,
  ESTADO_TEXTO,
  PRIORIDADES,
  PRIORIDAD_TEXTO,
  ROL_TEXTO,
  TRANSICIONES,
  codigoTicket,
  formatearFecha,
  nombreCompleto,
} from '../Config'
import { api } from '../api'
import { useSesion } from '../Sesion/SesionContext'
import { usePeticion } from '../componentes/usePeticion'
import { EstadoTicket, Prioridad } from '../componentes/Insignias'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'
import './Tickets.css'

const RECORRIDO = ['ABIERTO', 'EN_CURSO', 'PENDIENTE_CLIENTE', 'RESUELTO', 'CERRADO']

function textoAccion(destino, rol) {
  if (destino === 'EN_CURSO') return rol === 'ALUMNO' ? 'Solicitar reapertura' : 'Pasar a «En curso»'
  if (destino === 'PENDIENTE_CLIENTE') return 'Pedir información al alumno'
  if (destino === 'RESUELTO') return 'Marcar como resuelto'
  if (destino === 'CERRADO') return rol === 'ALUMNO' ? 'Confirmar cierre' : 'Cerrar ticket'
  return ESTADO_TEXTO[destino]
}

function Recorrido({ estado, historial }) {
  const actual = RECORRIDO.indexOf(estado)
  const visitados = new Set(historial.map((cambio) => cambio.a))
  return (
    <ol className="recorrido" aria-label={`Estado del ticket: ${ESTADO_TEXTO[estado]}`}>
      {RECORRIDO.map((paso, indice) => {
        let clase = 'pendiente'
        if (indice === actual) clase = 'actual'
        else if (visitados.has(paso)) clase = 'hecho'
        return (
          <li key={paso} className={`recorrido-paso ${clase}`} aria-current={indice === actual ? 'step' : undefined}>
            <span>{ESTADO_TEXTO[paso]}</span>
          </li>
        )
      })}
    </ol>
  )
}

function construirHistorial(ticket, respuestas) {
  const eventos = [
    {
      id: 'origen',
      tipo: 'mensaje',
      fecha: ticket.createdAt,
      autor: ticket.cliente,
      rol: 'ALUMNO',
      contenido: ticket.descripcion,
    },
    ...respuestas.map((respuesta) => ({
      id: respuesta._id,
      tipo: 'mensaje',
      fecha: respuesta.createdAt,
      autor: respuesta.autor,
      rol: respuesta.autor?.rol,
      contenido: respuesta.contenido,
    })),
    ...ticket.historialEstados
      .filter((cambio) => cambio.de !== cambio.a)
      .map((cambio) => ({
        id: cambio._id,
        tipo: 'estado',
        fecha: cambio.fecha,
        autor: cambio.por,
        de: cambio.de,
        a: cambio.a,
      })),
  ]
  return eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
}

function Historial({ eventos, idCliente }) {
  return (
    <ol className="historial">
      {eventos.map((evento) =>
        evento.tipo === 'estado' ? (
          <li key={evento.id} className="historial-estado">
            <span>
              {nombreCompleto(evento.autor)} cambió el estado de <strong>{ESTADO_TEXTO[evento.de]}</strong> a{' '}
              <strong>{ESTADO_TEXTO[evento.a]}</strong>
            </span>
            <time dateTime={evento.fecha}>{formatearFecha(evento.fecha, true)}</time>
          </li>
        ) : (
          <li
            key={evento.id}
            className={evento.autor?._id === idCliente ? 'mensaje mensaje-alumno' : 'mensaje mensaje-equipo'}
          >
            <header>
              <strong>{nombreCompleto(evento.autor)}</strong>
              <span>{ROL_TEXTO[evento.rol] ?? ''}</span>
              <time dateTime={evento.fecha}>{formatearFecha(evento.fecha, true)}</time>
            </header>
            <p>{evento.contenido}</p>
          </li>
        ),
      )}
    </ol>
  )
}

function Gestion({ ticket, usuario, onCambio }) {
  const esAdmin = usuario.rol === 'ADMIN'
  const puedePriorizar = (esAdmin || usuario.rol === 'AGENTE') && ticket.estado !== 'CERRADO'
  const agentes = usePeticion(esAdmin && ticket.estado !== 'CERRADO' ? '/usuarios/listarAgentes' : null)
  const [prioridad, setPrioridad] = useState(ticket.prioridad)
  const [agente, setAgente] = useState(ticket.agente?._id ?? '')
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [enviando, setEnviando] = useState(false)

  const destinos = TRANSICIONES[usuario.rol]?.[ticket.estado] ?? []

  const ejecutar = async (peticion, exito) => {
    setEnviando(true)
    setMensaje({ tipo: '', texto: '' })
    try {
      await peticion()
      onCambio(exito)
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } finally {
      setEnviando(false)
    }
  }

  const cambiarEstado = (destino) => {
    if (destino === 'CERRADO' && !window.confirm('Un ticket cerrado ya no admite respuestas. ¿Cerrarlo?')) return
    ejecutar(
      () => api.put(`/tickets/${ticket._id}/estado`, { estado: destino }),
      `Estado cambiado a «${ESTADO_TEXTO[destino]}».`,
    )
  }

  const guardarPrioridad = (event) => {
    event.preventDefault()
    ejecutar(
      () => api.put(`/tickets/${ticket._id}/prioridad`, { prioridad }),
      `Prioridad cambiada a ${PRIORIDAD_TEXTO[prioridad].toLowerCase()}.`,
    )
  }

  const asignar = (event) => {
    event.preventDefault()
    if (!agente) {
      setMensaje({ tipo: 'error', texto: 'Elige un agente' })
      return
    }
    ejecutar(
      () => api.put('/tickets/asignar', { ticketID: ticket._id, agenteID: agente }),
      ticket.agente ? 'Ticket reasignado.' : 'Ticket asignado.',
    )
  }

  if (destinos.length === 0 && !puedePriorizar && !(esAdmin && ticket.estado !== 'CERRADO')) return null

  const agentesActivos = (agentes.datos?.agentes ?? []).filter((item) => item.activo)

  return (
    <section className="panel gestion" aria-labelledby="titulo-gestion">
      <h2 id="titulo-gestion">Gestionar</h2>
      <Aviso tipo={mensaje.tipo}>{mensaje.texto}</Aviso>

      {destinos.length > 0 && (
        <div className="gestion-grupo">
          <h3>Estado</h3>
          {usuario.rol === 'ALUMNO' && (
            <p className="panel-texto">El equipo ha marcado tu consulta como resuelta. ¿Está todo bien?</p>
          )}
          <div className="acciones acciones-columna">
            {destinos.map((destino) => (
              <button
                key={destino}
                type="button"
                className={destino === 'CERRADO' || destino === 'RESUELTO' ? 'boton boton-principal' : 'boton boton-secundario'}
                disabled={enviando}
                onClick={() => cambiarEstado(destino)}
              >
                {textoAccion(destino, usuario.rol)}
              </button>
            ))}
          </div>
        </div>
      )}

      {puedePriorizar && (
        <form className="gestion-grupo" onSubmit={guardarPrioridad}>
          <h3>Prioridad</h3>
          <div className="gestion-linea">
            <label className="campo">
              <span className="solo-lector">Prioridad</span>
              <select value={prioridad} onChange={(event) => setPrioridad(event.target.value)}>
                {PRIORIDADES.map((valor) => (
                  <option key={valor} value={valor}>
                    {PRIORIDAD_TEXTO[valor]}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="boton boton-secundario" disabled={enviando || prioridad === ticket.prioridad}>
              Guardar
            </button>
          </div>
        </form>
      )}

      {esAdmin && ticket.estado !== 'CERRADO' && (
        <form className="gestion-grupo" onSubmit={asignar}>
          <h3>Agente asignado</h3>
          <div className="gestion-linea">
            <label className="campo">
              <span className="solo-lector">Agente</span>
              <select value={agente} onChange={(event) => setAgente(event.target.value)} disabled={agentes.cargando}>
                <option value="">{agentes.cargando ? 'Cargando…' : 'Sin asignar'}</option>
                {agentesActivos.map((item) => (
                  <option key={item._id} value={item._id}>
                    {nombreCompleto(item)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="boton boton-secundario"
              disabled={enviando || !agente || agente === ticket.agente?._id}
            >
              {ticket.agente ? 'Reasignar' : 'Asignar'}
            </button>
          </div>
          {agentes.datos && agentesActivos.length === 0 && (
            <p className="panel-texto">No hay agentes activos. Cambia el rol de un usuario desde Administración.</p>
          )}
        </form>
      )}
    </section>
  )
}

function Responder({ ticket, usuario, onCambio }) {
  const [contenido, setContenido] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (ticket.estado === 'CERRADO') {
    return <p className="vacio">Este ticket está cerrado y ya no admite respuestas.</p>
  }

  const enviar = async (event) => {
    event.preventDefault()
    const texto = contenido.trim()
    if (!texto) {
      setError('Escribe una respuesta')
      return
    }
    setEnviando(true)
    setError('')
    try {
      await api.post(`/tickets/${ticket._id}/respuestas`, { contenido: texto })
      setContenido('')
      onCambio()
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="formulario responder">
      <Aviso tipo="error">{error}</Aviso>
      <label className="campo">
        <span>Tu respuesta</span>
        <textarea rows={4} maxLength={3000} value={contenido} onChange={(event) => setContenido(event.target.value)} />
      </label>
      {usuario.rol === 'ALUMNO' && ticket.estado === 'PENDIENTE_CLIENTE' && (
        <p className="panel-texto">Al responder, el ticket vuelve a «En curso».</p>
      )}
      <div className="acciones">
        <button type="submit" className="boton boton-principal" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar respuesta'}
        </button>
      </div>
    </form>
  )
}

export default function TicketDetalle() {
  const { id } = useParams()
  const location = useLocation()
  const { usuario } = useSesion()
  const { datos, error, recargar } = usePeticion(`/tickets/${id}`)
  const [aviso, setAviso] = useState('')

  const tras = (texto) => {
    setAviso(texto)
    recargar()
  }

  if (error && !datos) {
    return (
      <div className="pagina">
        <h1>Ticket no disponible</h1>
        <Aviso tipo="error">{error}</Aviso>
        <Link to="/tickets" className="boton boton-secundario">
          Volver a tickets
        </Link>
      </div>
    )
  }

  if (!datos) {
    return (
      <div className="pagina">
        <Cargando texto="Cargando ticket…" />
      </div>
    )
  }

  const { ticket, respuestas } = datos
  const eventos = construirHistorial(ticket, respuestas)

  return (
    <div className="pagina ticket-detalle">
      <Link to="/tickets" className="volver">
        Tickets
      </Link>

      <header className="pagina-cabecera ticket-cabecera">
        <p className="ticket-codigo">{codigoTicket(ticket._id)}</p>
        <h1>{ticket.asunto}</h1>
        <div className="ticket-insignias">
          <EstadoTicket estado={ticket.estado} />
          <Prioridad prioridad={ticket.prioridad} />
        </div>
      </header>

      {location.state?.creado && <Aviso tipo="exito">Ticket abierto. Te avisaremos aquí con cada respuesta.</Aviso>}
      <Aviso tipo="error">{error}</Aviso>

      {ESTADOS.includes(ticket.estado) && <Recorrido estado={ticket.estado} historial={ticket.historialEstados} />}

      <div className="ticket-cuerpo">
        <section className="ticket-conversacion" aria-labelledby="titulo-historial">
          <h2 id="titulo-historial">Historial</h2>
          <Historial eventos={eventos} idCliente={ticket.cliente?._id} />
          <Responder ticket={ticket} usuario={usuario} onCambio={() => tras('')} />
        </section>

        <aside className="ticket-lateral">
          <dl className="panel ticket-datos">
            <div>
              <dt>Alumno</dt>
              <dd>{nombreCompleto(ticket.cliente)}</dd>
            </div>
            <div>
              <dt>Agente</dt>
              <dd>{ticket.agente ? nombreCompleto(ticket.agente) : 'Sin asignar'}</dd>
            </div>
            <div>
              <dt>Categoría</dt>
              <dd>{ticket.categoria?.nombre ?? '—'}</dd>
            </div>
            <div>
              <dt>Creado</dt>
              <dd>{formatearFecha(ticket.createdAt, true)}</dd>
            </div>
            <div>
              <dt>Última actualización</dt>
              <dd>{formatearFecha(ticket.updatedAt, true)}</dd>
            </div>
          </dl>
          <Aviso tipo="exito">{aviso}</Aviso>
          <Gestion
            key={`${ticket.estado}-${ticket.prioridad}-${ticket.agente?._id ?? ''}`}
            ticket={ticket}
            usuario={usuario}
            onCambio={tras}
          />
        </aside>
      </div>
    </div>
  )
}
