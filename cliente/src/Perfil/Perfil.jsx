import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EMAIL_REGEX, NIVEL_TEXTO, ROL_TEXTO, formatearFecha } from '../Config'
import { api } from '../api'
import { useSesion } from '../Sesion/SesionContext'
import { usePeticion } from '../componentes/usePeticion'
import { Activo } from '../componentes/Insignias'
import ListaTickets from '../componentes/ListaTickets'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'
import './Perfil.css'

const CLAVES_VACIAS = { passwordActual: '', passwordNueva: '', confirmar: '' }

function DatosPersonales() {
  const { usuario, actualizarUsuario } = useSesion()
  const [form, setForm] = useState({ nombre: usuario.nombre, apellidos: usuario.apellidos, email: usuario.email })
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [enviando, setEnviando] = useState(false)

  const cambiar = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const sinCambios =
    form.nombre.trim() === usuario.nombre &&
    form.apellidos.trim() === usuario.apellidos &&
    form.email.trim().toLowerCase() === usuario.email

  const guardar = async (event) => {
    event.preventDefault()
    let error = ''
    if (form.nombre.trim().length < 2) error = 'El nombre debe tener al menos 2 caracteres'
    else if (form.apellidos.trim().length < 2) error = 'Los apellidos deben tener al menos 2 caracteres'
    else if (!EMAIL_REGEX.test(form.email.trim())) error = 'Escribe un correo electrónico válido'
    if (error) {
      setMensaje({ tipo: 'error', texto: error })
      return
    }

    setEnviando(true)
    try {
      const datos = await api.put('/usuarios/editarPerfil', {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        email: form.email.trim(),
      })
      actualizarUsuario(datos.usuario)
      setForm({ nombre: datos.usuario.nombre, apellidos: datos.usuario.apellidos, email: datos.usuario.email })
      setMensaje({ tipo: 'exito', texto: 'Datos guardados.' })
    } catch (fallo) {
      setMensaje({ tipo: 'error', texto: fallo.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="panel" aria-labelledby="titulo-datos">
      <h2 id="titulo-datos">Datos personales</h2>
      <form onSubmit={guardar} noValidate className="formulario">
        <Aviso tipo={mensaje.tipo}>{mensaje.texto}</Aviso>
        <div className="formulario-fila">
          <label className="campo">
            <span>Nombre</span>
            <input name="nombre" maxLength={50} autoComplete="given-name" value={form.nombre} onChange={cambiar} />
          </label>
          <label className="campo">
            <span>Apellidos</span>
            <input name="apellidos" maxLength={50} autoComplete="family-name" value={form.apellidos} onChange={cambiar} />
          </label>
        </div>
        <label className="campo">
          <span>Correo electrónico</span>
          <input name="email" type="email" autoComplete="email" value={form.email} onChange={cambiar} />
        </label>
        <div className="acciones">
          <button type="submit" className="boton boton-principal" disabled={enviando || sinCambios}>
            {enviando ? 'Guardando…' : 'Guardar datos'}
          </button>
        </div>
      </form>
    </section>
  )
}

function CambiarPassword() {
  const [form, setForm] = useState(CLAVES_VACIAS)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [enviando, setEnviando] = useState(false)

  const cambiar = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const guardar = async (event) => {
    event.preventDefault()
    let error = ''
    if (!form.passwordActual) error = 'Escribe tu contraseña actual'
    else if (form.passwordNueva.length < 8) error = 'La contraseña nueva debe tener al menos 8 caracteres'
    else if (!/[A-Z]/.test(form.passwordNueva)) error = 'La contraseña nueva debe tener al menos una mayúscula'
    else if (!/[0-9]/.test(form.passwordNueva)) error = 'La contraseña nueva debe tener al menos un número'
    else if (form.passwordNueva === form.passwordActual) error = 'La contraseña nueva debe ser distinta de la actual'
    else if (form.passwordNueva !== form.confirmar) error = 'Las contraseñas nuevas no coinciden'
    if (error) {
      setMensaje({ tipo: 'error', texto: error })
      return
    }

    setEnviando(true)
    try {
      await api.put('/usuarios/cambiarContrasenia', {
        passwordActual: form.passwordActual,
        passwordNueva: form.passwordNueva,
      })
      setForm(CLAVES_VACIAS)
      setMensaje({ tipo: 'exito', texto: 'Contraseña cambiada.' })
    } catch (fallo) {
      setMensaje({ tipo: 'error', texto: fallo.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="panel" aria-labelledby="titulo-password">
      <h2 id="titulo-password">Contraseña</h2>
      <form onSubmit={guardar} noValidate className="formulario">
        <Aviso tipo={mensaje.tipo}>{mensaje.texto}</Aviso>
        <label className="campo">
          <span>Contraseña actual</span>
          <input name="passwordActual" type="password" autoComplete="current-password" value={form.passwordActual} onChange={cambiar} />
        </label>
        <label className="campo">
          <span>Contraseña nueva</span>
          <input name="passwordNueva" type="password" autoComplete="new-password" value={form.passwordNueva} onChange={cambiar} />
          <small>Mínimo 8 caracteres, con una mayúscula y un número.</small>
        </label>
        <label className="campo">
          <span>Repetir contraseña nueva</span>
          <input name="confirmar" type="password" autoComplete="new-password" value={form.confirmar} onChange={cambiar} />
        </label>
        <div className="acciones">
          <button type="submit" className="boton boton-secundario" disabled={enviando}>
            {enviando ? 'Cambiando…' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </section>
  )
}

function MisMatriculas() {
  const { datos, error } = usePeticion('/matriculas/misMatriculas')
  const matriculas = datos?.result ?? []

  return (
    <section aria-labelledby="titulo-matriculas">
      <h2 id="titulo-matriculas">Mis cursos</h2>
      <Aviso tipo="error">{error}</Aviso>
      {!datos && !error && <Cargando texto="Cargando matrículas…" />}
      {datos && matriculas.length === 0 && (
        <div className="vacio">
          <p>Todavía no estás matriculado en ningún curso.</p>
          <Link to="/cursos" className="boton boton-principal">
            Ver cursos
          </Link>
        </div>
      )}
      {matriculas.length > 0 && (
        <ul className="perfil-matriculas">
          {matriculas.map((matricula) => (
            <li key={matricula._id}>
              {matricula.curso ? (
                <Link to={`/cursos/${matricula.curso._id}`}>{matricula.curso.nombre}</Link>
              ) : (
                <span>Curso eliminado</span>
              )}
              <span className="perfil-matricula-meta">
                {matricula.curso && NIVEL_TEXTO[matricula.curso.nivel]} · desde {formatearFecha(matricula.createdAt)}
              </span>
              <Activo activo={matricula.activa} si="Activa" no="Desactivada" />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function MisTickets() {
  const { datos, error } = usePeticion('/tickets')
  const tickets = [...(datos?.result ?? [])].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  return (
    <section aria-labelledby="titulo-mis-tickets">
      <div className="perfil-seccion-cabecera">
        <h2 id="titulo-mis-tickets">Mis tickets</h2>
        <Link to="/tickets" className="boton-enlace">
          Ver todos y filtrar
        </Link>
      </div>
      <Aviso tipo="error">{error}</Aviso>
      {!datos && !error && <Cargando texto="Cargando tickets…" />}
      {datos && (
        <ListaTickets
          tickets={tickets.slice(0, 5)}
          vacio={
            <>
              <p>No has abierto ningún ticket.</p>
              <Link to="/tickets/nuevo" className="boton boton-secundario">
                Abrir ticket
              </Link>
            </>
          }
        />
      )}
    </section>
  )
}

export default function Perfil() {
  const { usuario } = useSesion()
  const esAlumno = usuario.rol === 'ALUMNO'

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <h1>Hola, {usuario.nombre}</h1>
        <p className="pagina-intro">
          {ROL_TEXTO[usuario.rol]} · {usuario.email}
        </p>
      </header>

      {esAlumno && (
        <div className="perfil-actividad">
          <MisTickets />
          <MisMatriculas />
        </div>
      )}

      <div className="perfil-ajustes">
        <DatosPersonales />
        <CambiarPassword />
      </div>
    </div>
  )
}
