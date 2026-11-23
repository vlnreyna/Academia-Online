import { useState } from 'react'
import './Tickets.css'

const CLAVE = 'aldea_tickets'
const CATEGORIAS = ['Matrícula', 'Acceso a cursos', 'Contenido del curso', 'Facturación', 'Otros']
const ESTADOS = ['Abierto', 'En curso', 'Pendiente del cliente', 'Resuelto', 'Cerrado']
const FORM_VACIO = { cliente: '', email: '', asunto: '', categoria: CATEGORIAS[0], descripcion: '' }

function cargar() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || []
  } catch {
    return []
  }
}

function guardar(lista) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista))
  } catch {
    /* sin almacenamiento: los tickets viven solo en esta sesión */
  }
}

function fecha(iso) {
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function FormularioRespuesta({ onEnviar }) {
  const [texto, setTexto] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    onEnviar(texto)
    setTexto('')
  }

  return (
    <form className="respuesta-form" onSubmit={enviar}>
      <textarea
        className="campo"
        rows={3}
        placeholder="Escribe una respuesta para el cliente"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">Responder</button>
    </form>
  )
}

export default function Tickets() {
  const [tickets, setTickets] = useState(cargar)
  const [form, setForm] = useState(FORM_VACIO)
  const [filtro, setFiltro] = useState('Todos')
  const [abierto, setAbierto] = useState(null)

  const actualizar = (lista) => {
    setTickets(lista)
    guardar(lista)
  }

  const crear = (e) => {
    e.preventDefault()
    const nuevo = {
      id: Date.now().toString(),
      ...form,
      estado: 'Abierto',
      creado: new Date().toISOString(),
      respuestas: [],
    }
    actualizar([nuevo, ...tickets])
    setForm(FORM_VACIO)
  }

  const cambiarEstado = (id, estado) =>
    actualizar(tickets.map((t) => (t.id === id ? { ...t, estado } : t)))

  const responder = (id, texto) =>
    actualizar(
      tickets.map((t) =>
        t.id === id
          ? { ...t, respuestas: [...t.respuestas, { texto: texto.trim(), fecha: new Date().toISOString() }] }
          : t,
      ),
    )

  const eliminar = (id) => {
    if (!window.confirm('¿Eliminar este ticket?')) return
    actualizar(tickets.filter((t) => t.id !== id))
    setAbierto(null)
  }

  const visibles = filtro === 'Todos' ? tickets : tickets.filter((t) => t.estado === filtro)
  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  return (
    <section className="tickets">
      <div className="tickets-bloque">
        <h2>Nuevo ticket</h2>
        <form className="ticket-form" onSubmit={crear}>
          <div className="fila">
            <label>
              Nombre del cliente
              <input className="campo" required value={form.cliente} onChange={cambiar('cliente')} />
            </label>
            <label>
              Email
              <input className="campo" type="email" required value={form.email} onChange={cambiar('email')} />
            </label>
          </div>
          <div className="fila">
            <label>
              Asunto
              <input className="campo" maxLength={120} required value={form.asunto} onChange={cambiar('asunto')} />
            </label>
            <label>
              Categoría
              <select className="campo" value={form.categoria} onChange={cambiar('categoria')}>
                {CATEGORIAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Descripción
            <textarea className="campo" rows={4} maxLength={3000} required value={form.descripcion} onChange={cambiar('descripcion')} />
          </label>
          <button type="submit" className="btn btn-primary">Crear ticket</button>
        </form>
      </div>

      <div className="tickets-bloque">
        <div className="cabecera-lista">
          <h2>Gestión de tickets <span className="contador">({tickets.length})</span></h2>
          <label>
            Estado{' '}
            <select className="campo corto" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option>Todos</option>
              {ESTADOS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>

        {visibles.length === 0 && <p className="vacio">No hay tickets en esta vista.</p>}

        <ul className="lista">
          {visibles.map((t) => (
            <li key={t.id} className="ticket">
              <div className="ticket-cabecera">
                <div>
                  <strong>{t.asunto}</strong>
                  <p className="meta">
                    {t.cliente} · {t.email} · {t.categoria} · {fecha(t.creado)}
                  </p>
                </div>
                <select
                  className="campo corto"
                  value={t.estado}
                  aria-label="Cambiar estado"
                  onChange={(e) => cambiarEstado(t.id, e.target.value)}
                >
                  {ESTADOS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="enlace"
                onClick={() => setAbierto(abierto === t.id ? null : t.id)}
              >
                {abierto === t.id ? 'Ocultar' : 'Ver detalle y responder'}
              </button>

              {abierto === t.id && (
                <div className="detalle">
                  <p>{t.descripcion}</p>
                  {t.respuestas.map((r, i) => (
                    <div key={i} className="respuesta">
                      <span className="meta">Equipo · {fecha(r.fecha)}</span>
                      <p>{r.texto}</p>
                    </div>
                  ))}
                  <FormularioRespuesta onEnviar={(texto) => responder(t.id, texto)} />
                  <button type="button" className="enlace peligro" onClick={() => eliminar(t.id)}>
                    Eliminar ticket
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
