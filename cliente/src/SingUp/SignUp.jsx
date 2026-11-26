import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EMAIL_REGEX } from '../Config'
import { post } from '../api'
import './SingUp.css'

export default function SignUp({ irA }) {
    const navigate = useNavigate()
    const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', confirmar: '' })
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const validar = () => {
        if (form.nombre.trim() === '') return 'Escribe tu nombre'
        if (form.apellido.trim() === '') return 'Escribe tu apellido'
        if (!EMAIL_REGEX.test(form.email.trim())) return 'Escribe un correo electrónico válido'
        if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
        if (form.password !== form.confirmar) return 'Las contraseñas no coinciden'
        return ''
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const mensaje = validar()
        if (mensaje) {
            setError(mensaje)
            return
        }
        setError('')
        setCargando(true)
        try {
            await post('/usuarios/register', {
                nombre: form.nombre.trim(),
                apellidos: form.apellido.trim(),
                email: form.email.trim(),
                password: form.password
            })
            navigate('/login', { state: { email: form.email.trim(), registrado: true } })
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
                    <span className="auth-logo-icono"></span>
                    Academia Online
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <h1 className="auth-titulo">Crear cuenta</h1>
                    {error && <p className="auth-error">{error}</p>}
                    <input
                        className="auth-input"
                        name="nombre"
                        placeholder="Nombre"
                        aria-label="Nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        autoFocus
                    />
                    <input
                        className="auth-input"
                        name="apellido"
                        placeholder="Apellido"
                        aria-label="Apellido"
                        value={form.apellido}
                        onChange={handleChange}
                    />
                    <input
                        className="auth-input"
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        aria-label="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <input
                        className="auth-input"
                        name="password"
                        type="password"
                        placeholder="Contraseña (mínimo 8 caracteres)"
                        aria-label="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <input
                        className="auth-input"
                        name="confirmar"
                        type="password"
                        placeholder="Repetir contraseña"
                        aria-label="Repetir contraseña"
                        value={form.confirmar}
                        onChange={handleChange}
                    />
                    <p className="auth-texto">
                        ¿Ya tienes una cuenta? <Link to="/login" onClick={() => irA('login')}>Inicia sesión.</Link>
                    </p>
                    <div className="auth-botones">
                        <button type="button" className="auth-boton auth-boton-secundario" onClick={() => irA('login')}>
                            Atrás
                        </button>
                        <button type="submit" className="auth-boton auth-boton-principal" disabled={cargando}>
                            {cargando ? 'Creando...' : 'Crear cuenta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}