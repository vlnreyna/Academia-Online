import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NIVELES, NIVEL_TEXTO } from '../Config'
import { api } from '../api'
import { usePeticion } from '../componentes/usePeticion'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'
import './Cursos.css'

const CURSO_VACIO = { nombre: '', descripcion: '', nivel: 'BASICO', duracionHoras: '', precio: '' }

function validar(form) {
  const nombre = form.nombre.trim()
  const descripcion = form.descripcion.trim()
  const horas = Number(form.duracionHoras)
  const precio = Number(form.precio)
  if (nombre.length < 3 || nombre.length > 50) return 'El nombre debe tener entre 3 y 50 caracteres'
  if (descripcion.length < 3 || descripcion.length > 200) return 'La descripción debe tener entre 3 y 200 caracteres'
  if (!NIVELES.includes(form.nivel)) return 'Elige un nivel'
  if (form.duracionHoras === '' || !Number.isInteger(horas) || horas < 2) return 'La duración debe ser un número entero de al menos 2 horas'
  if (form.precio === '' || Number.isNaN(precio) || precio < 0) return 'El precio debe ser un número igual o mayor que 0'
  return ''
}

function Formulario({ inicial, id }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(inicial)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiar = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const guardar = async (event) => {
    event.preventDefault()
    const mensaje = validar(form)
    setError(mensaje)
    if (mensaje) return

    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      nivel: form.nivel,
      duracionHoras: Number(form.duracionHoras),
      precio: Number(form.precio),
    }

    setEnviando(true)
    try {
      const respuesta = id
        ? await api.put(`/cursos/actualizarCurso/${id}`, datos)
        : await api.post('/cursos/insertarCurso', datos)
      navigate(`/cursos/${respuesta.result._id}`)
    } catch (fallo) {
      setError(fallo.message)
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={guardar} noValidate className="panel formulario curso-formulario">
      <Aviso tipo="error">{error}</Aviso>
      <label className="campo">
        <span>Nombre</span>
        <input name="nombre" maxLength={50} value={form.nombre} onChange={cambiar} />
      </label>
      <label className="campo">
        <span>Descripción</span>
        <textarea name="descripcion" rows={4} maxLength={200} value={form.descripcion} onChange={cambiar} />
        <small>{form.descripcion.length}/200</small>
      </label>
      <div className="formulario-fila formulario-fila-3">
        <label className="campo">
          <span>Nivel</span>
          <select name="nivel" value={form.nivel} onChange={cambiar}>
            {NIVELES.map((nivel) => (
              <option key={nivel} value={nivel}>
                {NIVEL_TEXTO[nivel]}
              </option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Duración (horas)</span>
          <input name="duracionHoras" type="number" min={2} step={1} inputMode="numeric" value={form.duracionHoras} onChange={cambiar} />
        </label>
        <label className="campo">
          <span>Precio (€)</span>
          <input name="precio" type="number" min={0} step="0.01" inputMode="decimal" value={form.precio} onChange={cambiar} />
        </label>
      </div>
      <div className="acciones">
        <button type="submit" className="boton boton-principal" disabled={enviando}>
          {enviando ? 'Guardando…' : id ? 'Guardar cambios' : 'Crear curso'}
        </button>
        <Link to={id ? `/cursos/${id}` : '/cursos'} className="boton boton-secundario">
          Cancelar
        </Link>
      </div>
    </form>
  )
}

export default function CursoFormulario() {
  const { id } = useParams()
  const { datos, error } = usePeticion(id ? `/cursos/${id}` : null)

  let contenido
  if (!id) {
    contenido = <Formulario inicial={CURSO_VACIO} />
  } else if (error && !datos) {
    contenido = <Aviso tipo="error">{error}</Aviso>
  } else if (!datos) {
    contenido = <Cargando texto="Cargando curso…" />
  } else {
    const curso = datos.result
    contenido = (
      <Formulario
        key={curso._id}
        id={curso._id}
        inicial={{
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          nivel: curso.nivel,
          duracionHoras: String(curso.duracionHoras),
          precio: String(curso.precio),
        }}
      />
    )
  }

  return (
    <div className="pagina pagina-estrecha">
      <Link to={id ? `/cursos/${id}` : '/cursos'} className="volver">
        {id ? 'Ficha del curso' : 'Cursos'}
      </Link>
      <header className="pagina-cabecera">
        <h1>{id ? 'Editar curso' : 'Nuevo curso'}</h1>
      </header>
      {contenido}
    </div>
  )
}
