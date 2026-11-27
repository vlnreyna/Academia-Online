import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { EMAIL_REGEX } from '../Config'
import { api } from '../api'
import { rutaInicial, useSesion } from '../Sesion/SesionContext'
import Aviso from '../componentes/Aviso'
import './Acceso.css'

const LOGIN_VACIO = { email: '', password: '' }
const REGISTRO_VACIO = { nombre: '', apellidos: '', email: '', password: '', confirmar: '', privacidad: false }

function validarLogin(login) {
  if (!EMAIL_REGEX.test(login.email.trim())) return 'Escribe un correo electrónico válido'
  if (login.password === '') return 'Escribe tu contraseña'
  return ''
}

function validarRegistro(registro) {
  if (registro.nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
  if (registro.apellidos.trim().length < 2) return 'Los apellidos deben tener al menos 2 caracteres'
  if (!EMAIL_REGEX.test(registro.email.trim())) return 'Escribe un correo electrónico válido'
  if (registro.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
  if (!/[A-Z]/.test(registro.password)) return 'La contraseña debe tener al menos una mayúscula'
  if (!/[0-9]/.test(registro.password)) return 'La contraseña debe tener al menos un número'
  if (registro.password !== registro.confirmar) return 'Las contraseñas no coinciden'
  if (!registro.privacidad) return 'Debes aceptar la política de privacidad'
  return ''
}

export default function Acceso() {
  const { usuario, iniciarSesion, avisoSesion } = useSesion()
  const location = useLocation()

  const [login, setLogin] = useState(LOGIN_VACIO)
  const [errorLogin, setErrorLogin] = useState('')
  const [cargandoLogin, setCargandoLogin] = useState(false)
  const [aviso, setAviso] = useState('')

  const [registro, setRegistro] = useState(REGISTRO_VACIO)
  const [errorRegistro, setErrorRegistro] = useState('')
  const [cargandoRegistro, setCargandoRegistro] = useState(false)

  if (usuario) return <Navigate to={location.state?.desde ?? rutaInicial(usuario.rol)} replace />

  const cambiarLogin = (event) => {
    setLogin({ ...login, [event.target.name]: event.target.value })
  }

  const cambiarRegistro = (event) => {
    const { name, value, type, checked } = event.target
    setRegistro({ ...registro, [name]: type === 'checkbox' ? checked : value })
  }

  const enviarLogin = async (event) => {
    event.preventDefault()
    const mensaje = validarLogin(login)
    setErrorLogin(mensaje)
    if (mensaje) return

    setCargandoLogin(true)
    try {
      const datos = await api.post('/usuarios/login', {
        email: login.email.trim(),
        password: login.password,
      })
      iniciarSesion(datos.token, datos.usuario)
    } catch (error) {
      setErrorLogin(error.message)
      setCargandoLogin(false)
    }
  }

  const enviarRegistro = async (event) => {
    event.preventDefault()
    const mensaje = validarRegistro(registro)
    setErrorRegistro(mensaje)
    if (mensaje) return

    setCargandoRegistro(true)
    try {
      await api.post('/usuarios/register', {
        nombre: registro.nombre.trim(),
        apellidos: registro.apellidos.trim(),
        email: registro.email.trim(),
        password: registro.password,
      })
      setLogin({ email: registro.email.trim(), password: '' })
      setRegistro(REGISTRO_VACIO)
      setErrorLogin('')
      setAviso('Cuenta creada. Escribe tu contraseña para entrar.')
      document.getElementById('login-password')?.focus()
    } catch (error) {
      setErrorRegistro(error.message)
    } finally {
      setCargandoRegistro(false)
    }
  }

  return (
    <div className="pagina acceso">
      <header className="pagina-cabecera">
        <h1>Mi cuenta</h1>
        <p className="pagina-intro">Entra para ver tus cursos y tus tickets, o crea una cuenta de alumno en un minuto.</p>
      </header>

      <div className="acceso-paneles">
        <section className="panel acceso-panel" aria-labelledby="titulo-login">
          <h2 id="titulo-login">Iniciar sesión</h2>
          <p className="panel-texto">¿Ya tienes cuenta? Entra con tu correo electrónico.</p>

          <Aviso tipo="info">{avisoSesion}</Aviso>
          <Aviso tipo="exito">{aviso}</Aviso>
          <Aviso tipo="error">{errorLogin}</Aviso>

          <form onSubmit={enviarLogin} noValidate className="formulario">
            <label className="campo">
              <span>Correo electrónico</span>
              <input
                type="email"
                name="email"
                placeholder="nombre@dominio.com"
                autoComplete="email"
                value={login.email}
                onChange={cambiarLogin}
              />
            </label>
            <label className="campo">
              <span>Contraseña</span>
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={login.password}
                onChange={cambiarLogin}
              />
            </label>
            <button type="submit" className="boton boton-principal" disabled={cargandoLogin}>
              {cargandoLogin ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </section>

        <section className="panel acceso-panel" aria-labelledby="titulo-registro">
          <h2 id="titulo-registro">Crear cuenta</h2>
          <p className="panel-texto">Matricúlate en cursos, abre tickets y sigue cada consulta.</p>

          <Aviso tipo="error">{errorRegistro}</Aviso>

          <form onSubmit={enviarRegistro} noValidate className="formulario">
            <div className="formulario-fila">
              <label className="campo">
                <span>Nombre</span>
                <input
                  name="nombre"
                  autoComplete="given-name"
                  maxLength={50}
                  value={registro.nombre}
                  onChange={cambiarRegistro}
                />
              </label>
              <label className="campo">
                <span>Apellidos</span>
                <input
                  name="apellidos"
                  autoComplete="family-name"
                  maxLength={50}
                  value={registro.apellidos}
                  onChange={cambiarRegistro}
                />
              </label>
            </div>
            <label className="campo">
              <span>Correo electrónico</span>
              <input
                type="email"
                name="email"
                placeholder="nombre@dominio.com"
                autoComplete="email"
                value={registro.email}
                onChange={cambiarRegistro}
              />
            </label>
            <label className="campo">
              <span>Contraseña</span>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                aria-describedby="ayuda-password"
                value={registro.password}
                onChange={cambiarRegistro}
              />
              <small id="ayuda-password">Mínimo 8 caracteres, con una mayúscula y un número.</small>
            </label>
            <label className="campo">
              <span>Repetir contraseña</span>
              <input
                type="password"
                name="confirmar"
                autoComplete="new-password"
                value={registro.confirmar}
                onChange={cambiarRegistro}
              />
            </label>
            <label className="casilla">
              <input type="checkbox" name="privacidad" checked={registro.privacidad} onChange={cambiarRegistro} />
              <span>Acepto la política de privacidad.</span>
            </label>
            <button type="submit" className="boton boton-secundario" disabled={cargandoRegistro}>
              {cargandoRegistro ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
