import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ESTADOS, ESTADO_TEXTO, PRIORIDADES, PRIORIDAD_TEXTO, codigoTicket, nombreCompleto } from '../Config'
import { construirQuery } from '../api'
import { useSesion } from '../Sesion/SesionContext'
import { usePeticion } from '../componentes/usePeticion'
import ListaTickets from '../componentes/ListaTickets'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'
import './Tickets.css'

const TITULOS = {
  ALUMNO: ['Mis tickets', 'Tus consultas al equipo de soporte y el estado de cada una.'],
  AGENTE: ['Tickets asignados', 'Las consultas que administración te ha asignado.'],
  ADMIN: ['Todos los tickets', 'Filtra por alumno, agente, estado o prioridad para gestionar el soporte.'],
}

export default function Tickets() {
  const { usuario } = useSesion()
  const esAdmin = usuario.rol === 'ADMIN'
  const [parametros, setParametros] = useSearchParams()
  const [texto, setTexto] = useState('')

  const filtros = {
    estado: parametros.get('estado') ?? '',
    prioridad: parametros.get('prioridad') ?? '',
    categoria: parametros.get('categoria') ?? '',
    cliente: esAdmin ? parametros.get('cliente') ?? '' : '',
    agente: esAdmin ? parametros.get('agente') ?? '' : '',
  }

  const tickets = usePeticion(`/tickets${construirQuery(filtros)}`)
  const categorias = usePeticion('/categorias')
  const alumnos = usePeticion(esAdmin ? '/usuarios/listarAlumnos' : null)
  const agentes = usePeticion(esAdmin ? '/usuarios/listarAgentes' : null)

  const cambiarFiltro = (clave, valor) => {
    const siguientes = new URLSearchParams(parametros)
    if (valor) siguientes.set(clave, valor)
    else siguientes.delete(clave)
    setParametros(siguientes, { replace: true })
  }

  const busqueda = texto.trim().toLowerCase()
  const lista = (tickets.datos?.result ?? [])
    .filter(
      (ticket) =>
        !busqueda ||
        ticket.asunto.toLowerCase().includes(busqueda) ||
        codigoTicket(ticket._id).toLowerCase().includes(busqueda),
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  const hayFiltros = Object.values(filtros).some(Boolean) || busqueda
  const [titulo, intro] = TITULOS[usuario.rol]

  return (
    <div className="pagina">
      <header className="pagina-cabecera pagina-cabecera-acciones">
        <div>
          <h1>{titulo}</h1>
          <p className="pagina-intro">{intro}</p>
        </div>
        {usuario.rol !== 'AGENTE' && (
          <Link to="/tickets/nuevo" className="boton boton-principal">
            Abrir ticket
          </Link>
        )}
      </header>

      <div className="filtros" role="search">
        <label className="campo">
          <span>Buscar</span>
          <input
            type="search"
            placeholder="Asunto o código"
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
          />
        </label>
        <label className="campo">
          <span>Estado</span>
          <select value={filtros.estado} onChange={(event) => cambiarFiltro('estado', event.target.value)}>
            <option value="">Todos</option>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_TEXTO[estado]}
              </option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Prioridad</span>
          <select value={filtros.prioridad} onChange={(event) => cambiarFiltro('prioridad', event.target.value)}>
            <option value="">Todas</option>
            {PRIORIDADES.map((prioridad) => (
              <option key={prioridad} value={prioridad}>
                {PRIORIDAD_TEXTO[prioridad]}
              </option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Categoría</span>
          <select value={filtros.categoria} onChange={(event) => cambiarFiltro('categoria', event.target.value)}>
            <option value="">Todas</option>
            {(categorias.datos?.result ?? []).map((categoria) => (
              <option key={categoria._id} value={categoria._id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </label>
        {esAdmin && (
          <>
            <label className="campo">
              <span>Alumno</span>
              <select value={filtros.cliente} onChange={(event) => cambiarFiltro('cliente', event.target.value)}>
                <option value="">Todos</option>
                {(alumnos.datos?.alumnos ?? []).map((alumno) => (
                  <option key={alumno._id} value={alumno._id}>
                    {nombreCompleto(alumno)}
                  </option>
                ))}
              </select>
            </label>
            <label className="campo">
              <span>Agente</span>
              <select value={filtros.agente} onChange={(event) => cambiarFiltro('agente', event.target.value)}>
                <option value="">Todos</option>
                {(agentes.datos?.agentes ?? []).map((agente) => (
                  <option key={agente._id} value={agente._id}>
                    {nombreCompleto(agente)}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        {hayFiltros && (
          <button
            type="button"
            className="boton-enlace"
            onClick={() => {
              setTexto('')
              setParametros({}, { replace: true })
            }}
          >
            Quitar filtros
          </button>
        )}
      </div>

      <Aviso tipo="error">{tickets.error}</Aviso>
      {tickets.cargando && !tickets.datos && <Cargando texto="Cargando tickets…" />}
      {tickets.datos && (
        <>
          <p className="recuento" aria-live="polite">
            {lista.length === 1 ? '1 ticket' : `${lista.length} tickets`}
          </p>
          <ListaTickets
            tickets={lista}
            mostrarCliente={usuario.rol !== 'ALUMNO'}
            mostrarAgente={esAdmin}
            vacio={
              hayFiltros
                ? 'Ningún ticket coincide con estos filtros.'
                : usuario.rol === 'AGENTE'
                  ? 'No tienes tickets asignados.'
                  : 'Todavía no hay tickets. Abre uno si necesitas ayuda.'
            }
          />
        </>
      )}
    </div>
  )
}
