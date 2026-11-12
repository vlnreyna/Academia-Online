import { useState } from 'react'

const API = import.meta.env.VITE_API_URL

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mensaje, setMensaje] = useState('')

    const enviar = async (e) => {
        e.preventDefault()

        const rpta = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        
        const datos = await rpta.json()

        if (rpta.ok) {
            setMensaje('Bienvenido ' + datos.usuario.nombre)
        } else {
            setMensaje(datos.mensaje)
        }
    }

    return (
        <form onSubmit={enviar}>
            <h1>Login</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Entrar</button>

            <p>{mensaje}</p>
        </form>
  )
}

export default Login