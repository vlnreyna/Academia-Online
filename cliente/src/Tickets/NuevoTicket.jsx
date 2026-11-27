import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PRIORIDADES, PRIORIDAD_TEXTO } from '../Config'
import { api } from '../api'
import { usePeticion } from '../componentes/usePeticion'
import Aviso from '../componentes/Aviso'
import './Tickets.css'

const TICKET_VACIO = { asunto: '', descripcion: '', categoria: '', prioridad: 'MEDIA' }

function validar(form) {
  const asunto = form.asunto.trim()
  const descripcion = form.descripcion.trim()
  if (asunto.length < 3 || asunto.length > 100) return 'El asunto debe tener entre 3 y 100 caracteres'
  if (descripcion.length < 10) return 'Describe el problema con al menos 10 caracteres'
  if (descripcion.length > 3000) return 'La descripción no puede superar los 3000 caracteres'
  if (!form.categoria) return 'Elige una categoría'
  return ''
}

export default function NuevoTicket() {
  const navigate = useNavigate()
  const categorias = usePeticion('/categorias')
  const [form, setForm] = useState(TICKET_VACIO)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const opciones = (categorias.datos?.result ?? []).filter((categoria) => categoria.activa)

  const cambiar = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const enviar = async (event) => {
    event.preventDefault()
    const mensaje = validar(form)
    setError(mensaje)
    if (mensaje) return

    setEnviando(true)
    try {
      const datos = await api.post('/tickets/crearTicket', {
        asunto: form.asunto.trim(),
        descripcion: form.descripcion.trim(),
        categoria: form.categoria,
        prioridad: form.prioridad,
      })
      navigate(`/tickets/${datos.ticket._id}`, { state: { creado: true } })
    } catch (fallo) {
      setError(fallo.message)
      setEnviando(false)
    }
  }

  return (
    <div className="pagina pagina-estrecha">
      <Link to="/tickets" className="volver">
        Tickets
      </Link>
      <header className="pagina-cabecera">
        <h1>Abrir ticket</h1>
        <p className="pagina-intro">
          Cuéntanos qué ocurre. Cuanto más concreto seas (curso, pantalla, mensaje de error), antes podremos ayudarte.
        </p>
      </header>

      <form onSubmit={enviar} noValidate className="panel formulario">
        <Aviso tipo="error">{error || categorias.error}</Aviso>
        <label className="campo">
          <span>Asunto</span>
          <input name="asunto" maxLength={100} placeholder="Ej. No puedo acceder al curso de Python" value={form.asunto} onChange={cambiar} />
        </label>
        <div className="formulario-fila">
          <label className="campo">
            <span>Categoría</span>
            <select name="categoria" value={form.categoria} onChange={cambiar} disabled={categorias.cargando}>
              <option value="">{categorias.cargando ? 'Cargando…' : 'Elige una categoría'}</option>
              {opciones.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="campo">
            <span>Prioridad</span>
            <select name="prioridad" value={form.prioridad} onChange={cambiar}>
              {PRIORIDADES.map((prioridad) => (
                <option key={prioridad} value={prioridad}>
                  {PRIORIDAD_TEXTO[prioridad]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="campo">
          <span>Descripción</span>
          <textarea name="descripcion" rows={7} maxLength={3000} value={form.descripcion} onChange={cambiar} />
          <small>{form.descripcion.length}/3000</small>
        </label>
        <div className="acciones">
          <button type="submit" className="boton boton-principal" disabled={enviando}>
            {enviando ? 'Enviando…' : 'Abrir ticket'}
          </button>
          <Link to="/tickets" className="boton boton-secundario">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
