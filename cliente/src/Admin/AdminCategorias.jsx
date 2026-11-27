import { useState } from 'react'
import { api } from '../api'
import { usePeticion } from '../componentes/usePeticion'
import { Activo } from '../componentes/Insignias'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'

const CATEGORIA_VACIA = { nombre: '', descripcion: '' }

export default function AdminCategorias() {
  const { datos, error, recargar } = usePeticion('/categorias')
  const [form, setForm] = useState(CATEGORIA_VACIA)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [ocupado, setOcupado] = useState('')

  const categorias = [...(datos?.result ?? [])].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  const cambiar = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const crear = async (event) => {
    event.preventDefault()
    const nombre = form.nombre.trim()
    const descripcion = form.descripcion.trim()
    if (nombre.length < 3 || nombre.length > 50) {
      setMensaje({ tipo: 'error', texto: 'El nombre debe tener entre 3 y 50 caracteres' })
      return
    }
    setOcupado('nueva')
    try {
      await api.post('/categorias/crearCategoria', descripcion ? { nombre, descripcion } : { nombre })
      setForm(CATEGORIA_VACIA)
      setMensaje({ tipo: 'exito', texto: `Categoría «${nombre}» creada.` })
      recargar()
    } catch (fallo) {
      setMensaje({ tipo: 'error', texto: fallo.message })
    } finally {
      setOcupado('')
    }
  }

  const cambiarEstado = async (categoria) => {
    setOcupado(categoria._id)
    try {
      await api.put(`/categorias/cambiarEstado/${categoria._id}`)
      setMensaje({
        tipo: 'exito',
        texto: categoria.activa
          ? `«${categoria.nombre}» desactivada: ya no aparece al abrir tickets.`
          : `«${categoria.nombre}» activada.`,
      })
      recargar()
    } catch (fallo) {
      setMensaje({ tipo: 'error', texto: fallo.message })
    } finally {
      setOcupado('')
    }
  }

  return (
    <div className="admin-dos-columnas">
      <section aria-labelledby="titulo-categorias">
        <h2 id="titulo-categorias">Categorías de tickets</h2>
        <Aviso tipo={mensaje.tipo}>{mensaje.texto}</Aviso>
        <Aviso tipo="error">{error}</Aviso>
        {!datos && !error && <Cargando texto="Cargando categorías…" />}
        {datos && categorias.length === 0 && (
          <div className="vacio">No hay categorías. Crea la primera para que los alumnos puedan abrir tickets.</div>
        )}
        {categorias.length > 0 && (
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Categoría</th>
                  <th scope="col">Estado</th>
                  <th scope="col">
                    <span className="solo-lector">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria._id}>
                    <td>
                      <strong>{categoria.nombre}</strong>
                      {categoria.descripcion && <span className="tabla-sub">{categoria.descripcion}</span>}
                    </td>
                    <td>
                      <Activo activo={categoria.activa} si="Activa" no="Desactivada" />
                    </td>
                    <td className="tabla-acciones">
                      <button
                        type="button"
                        className={categoria.activa ? 'boton boton-peligro boton-pequeno' : 'boton boton-secundario boton-pequeno'}
                        disabled={ocupado === categoria._id}
                        onClick={() => cambiarEstado(categoria)}
                      >
                        {categoria.activa ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <form onSubmit={crear} noValidate className="panel formulario" aria-labelledby="titulo-nueva-categoria">
        <h2 id="titulo-nueva-categoria">Nueva categoría</h2>
        <label className="campo">
          <span>Nombre</span>
          <input name="nombre" maxLength={50} placeholder="Ej. Acceso a cursos" value={form.nombre} onChange={cambiar} />
        </label>
        <label className="campo">
          <span>Descripción (opcional)</span>
          <textarea name="descripcion" rows={3} maxLength={200} value={form.descripcion} onChange={cambiar} />
        </label>
        <div className="acciones">
          <button type="submit" className="boton boton-principal" disabled={ocupado === 'nueva'}>
            {ocupado === 'nueva' ? 'Creando…' : 'Crear categoría'}
          </button>
        </div>
      </form>
    </div>
  )
}
