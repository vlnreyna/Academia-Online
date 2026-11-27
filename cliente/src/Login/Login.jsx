import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { EMAIL_REGEX } from '../Config'
import { post } from '../api'
import './Login.css'

export default function Login({ onLogin, irA }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [paso, setPaso] = useState(1)
    const [email, setEmail] = useState(location.state?.email ?? '')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)
    const aviso = location.state?.registrado ? 'Cuenta creada. Ya puedes iniciar sesión.' : ''

    const handleSiguiente = (event) => {
        event.preventDefault()
        if (!EMAIL_REGEX.test(email.trim())) {
            setError('Escribe un correo electrónico válido')
            return
        }
        setError('')
        setPaso(2)
    }

    const handleAtras = () => {
        setPaso(1)
        setPassword('')
        setError('')
    }

    const handleIniciarSesion = async (event) => {
        event.preventDefault()
        if (password === '') {
            setError('Escribe tu contraseña')
            return
        }
        setError('')
        setCargando(true)
        try {
            const datos = await post('/usuarios/login', {
                email: email.trim(),
                password
            })
            localStorage.setItem('token', datos.token)
            onLogin(datos.usuario)
            navigate('/')
        } catch (error) {
            setError(error.message)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="auth-pagina">
            <div className="auth-tarjeta">
                <div className="auth-logo">
                    <img className="auth-logo-icono" src={`${import.meta.env.BASE_URL}logo-academia-aldea.png`} alt="" />
                    Academia Aldea
                </div>

                {paso === 1 ? (
                    <form onSubmit={handleSiguiente} noValidate>
                        <h1 className="auth-titulo">Iniciar sesión</h1>
                        {aviso && <p className="auth-aviso">{aviso}</p>}
                        {error && <p className="auth-error">{error}</p>}
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="Correo electrónico"
                            aria-label="Correo electrónico"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoFocus
                        />
                        <p className="auth-texto">
                            ¿No tienes una cuenta? <Link to="/registro" onClick={() => irA('signup')}>Crea una Cuenta.</Link>
                        </p>
                        <div className="auth-botones">
                            <button type="submit" className="auth-boton auth-boton-principal">
                                Siguiente
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleIniciarSesion}>
                        <p className="auth-identidad">{email.trim()}</p>
                        <h1 className="auth-titulo">Escribir contraseña</h1>
                        {error && <p className="auth-error">{error}</p>}
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Contraseña"
                            aria-label="Contraseña"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoFocus
                        />
                        <div className="auth-botones">
                            <button type="button" className="auth-boton auth-boton-secundario" onClick={handleAtras}>
                                Atrás
                            </button>
                            <button type="submit" className="auth-boton auth-boton-principal" disabled={cargando}>
                                {cargando ? 'Entrando...' : 'Iniciar sesión'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
