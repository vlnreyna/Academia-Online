import { useState } from 'react'
import { EMAIL_REGEX } from '../Config'
import { post } from '../api'
import './Acesso.css'

const REGISTRO_VACIO = { nombre: '', apellido: '', email: '', password: '', confirmar: '', privacidad: false }

export default function Acceso({ onLogin, irA }) {
    const [login, setLogin] = useState({ email: '', password: '' })
    const [errorLogin, setErrorLogin] = useState('')
    const [cargandoLogin, setCargandoLogin] = useState(false)
    const [aviso, setAviso] = useState('')

    const [registro, setRegistro] = useState(REGISTRO_VACIO)
    const [errorRegistro, setErrorRegistro] = useState('')
    const [cargandoRegistro, setCargandoRegistro] = useState(false)

    const cambiarLogin = (event) => {
        setLogin({ ...login, [event.target.name]: event.target.value })
    }

    const cambiarRegistro = (event) => {
        const { name, value, type, checked } = event.target
        setRegistro({ ...registro, [name]: type === 'checkbox' ? checked : value })
    }

    const validarLogin = () => {
        if (!EMAIL_REGEX.test(login.email.trim())) return 'Escribe un correo electrónico válido'
        if (login.password === '') return 'Escribe tu contraseña'
        return ''
    }

    const validarRegistro = () => {
        if (registro.nombre.trim().length < 2) return 'Escribe tu nombre'
        if (registro.apellido.trim().length < 2) return 'Escribe tu apellido'
        if (!EMAIL_REGEX.test(registro.email.trim())) return 'Escribe un correo electrónico válido'
        if (registro.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
        if (!/[A-Z]/.test(registro.password)) return 'La contraseña debe tener al menos una mayúscula'
        if (!/[0-9]/.test(registro.password)) return 'La contraseña debe tener al menos un número'
        if (registro.password !== registro.confirmar) return 'Las contraseñas no coinciden'
        if (!registro.privacidad) return 'Debes aceptar la política de privacidad'
        return ''
    }

    const enviarLogin = async (event) => {
        event.preventDefault()
        const mensaje = validarLogin()
        if (mensaje) {
            setErrorLogin(mensaje)
            return
        }
        setErrorLogin('')
        setCargandoLogin(true)
        try {
            const datos = await post('/usuarios/login', {
                email: login.email.trim(),
                password: login.password
            })
            localStorage.setItem('token', datos.token)
            if (onLogin) onLogin(datos.usuario)
        } catch (error) {
            setErrorLogin(error.message)
        } finally {
            setCargandoLogin(false)
        }
    }

    const enviarRegistro = async (event) => {
        event.preventDefault()
        const mensaje = validarRegistro()
        if (mensaje) {
            setErrorRegistro(mensaje)
            return
        }
        setErrorRegistro('')
        setCargandoRegistro(true)
        try {
            await post('/usuarios/register', {
                nombre: registro.nombre.trim(),
                apellidos: registro.apellido.trim(),
                email: registro.email.trim(),
                password: registro.password
            })
            setLogin({ email: registro.email.trim(), password: '' })
            setRegistro(REGISTRO_VACIO)
            setErrorLogin('')
            setAviso('Cuenta creada. Ya puedes iniciar sesión.')
        } catch (error) {
            setErrorRegistro(error.message)
        } finally {
            setCargandoRegistro(false)
        }
    }

    return (
        <div className="acceso">
            <header className="acceso-cabecera">
                <nav className="acceso-migas" aria-label="Ruta">
                    <button type="button" onClick={() => irA('home')}>Inicio</button>
                    <span>/</span>
                    <span className="acceso-migas-actual">Mi cuenta</span>
                </nav>
                <p className="acceso-antetitulo">Tu espacio</p>
                <h1 className="acceso-titulo">Mi cuenta</h1>
                <p className="acceso-subtitulo">
                    Entra para ver tus cursos y tus tickets, o crea una cuenta en un minuto.
                </p>
            </header>

            <div className="acceso-paneles">
                <section className="acceso-panel" aria-labelledby="titulo-login">
                    <h2 id="titulo-login" className="acceso-panel-titulo">Iniciar sesión</h2>
                    <p className="acceso-panel-texto">¿Ya tienes cuenta? Entra con tu correo electrónico.</p>

                    {aviso && <p className="acceso-aviso">{aviso}</p>}
                    {errorLogin && <p className="acceso-error">{errorLogin}</p>}

                    <form onSubmit={enviarLogin} noValidate>
                        <label className="acceso-campo">
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
                        <label className="acceso-campo">
                            <span>Contraseña</span>
                            <input
                                type="password"
                                name="password"
                                placeholder="Tu contraseña"
                                autoComplete="current-password"
                                value={login.password}
                                onChange={cambiarLogin}
                            />
                        </label>
                        <button type="submit" className="acceso-boton acceso-boton-relleno" disabled={cargandoLogin}>
                            {cargandoLogin ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </section>

                <section className="acceso-panel" aria-labelledby="titulo-registro">
                    <h2 id="titulo-registro" className="acceso-panel-titulo">Crear cuenta</h2>
                    <p className="acceso-panel-texto">
                        Matricúlate en cursos, abre tickets y sigue cada consulta en tiempo real.
                    </p>

                    {errorRegistro && <p className="acceso-error">{errorRegistro}</p>}

                    <form onSubmit={enviarRegistro} noValidate>
                        <div className="acceso-fila">
                            <label className="acceso-campo">
                                <span>Nombre</span>
                                <input
                                    name="nombre"
                                    placeholder="Tu nombre"
                                    autoComplete="given-name"
                                    value={registro.nombre}
                                    onChange={cambiarRegistro}
                                />
                            </label>
                            <label className="acceso-campo">
                                <span>Apellido</span>
                                <input
                                    name="apellido"
                                    placeholder="Tu apellido"
                                    autoComplete="family-name"
                                    value={registro.apellido}
                                    onChange={cambiarRegistro}
                                />
                            </label>
                        </div>
                        <label className="acceso-campo">
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
                        <label className="acceso-campo">
                            <span>Contraseña</span>
                            <input
                                type="password"
                                name="password"
                                placeholder="Mín. 8, una mayúscula y un número"
                                autoComplete="new-password"
                                value={registro.password}
                                onChange={cambiarRegistro}
                            />
                        </label>
                        <label className="acceso-campo">
                            <span>Repetir contraseña</span>
                            <input
                                type="password"
                                name="confirmar"
                                placeholder="Repite la contraseña"
                                autoComplete="new-password"
                                value={registro.confirmar}
                                onChange={cambiarRegistro}
                            />
                        </label>
                        <label className="acceso-check">
                            <input
                                type="checkbox"
                                name="privacidad"
                                checked={registro.privacidad}
                                onChange={cambiarRegistro}
                            />
                            <span>Acepto la política de privacidad.</span>
                        </label>
                        <button type="submit" className="acceso-boton acceso-boton-borde" disabled={cargandoRegistro}>
                            {cargandoRegistro ? 'Creando...' : 'Crear cuenta'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}
