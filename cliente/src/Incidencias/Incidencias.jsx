import { useEffect, useState } from 'react'
import { API_URL } from '../Config'
import { post } from '../api'
import '../Login/Login.css'
import './Incidencias.css'

export default function Incidencias() {
    const [form, setForm] = useState({ asunto: '', descripcion: '', categoria: '', prioridad: 'MEDIA' })
    const [categorias, setCategorias] = useState([])
    const [error, setError] = useState('')
    const [aviso, setAviso] = useState('')
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        fetch(`${CATEGORIAS_API_URL}/categorias`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then((respuesta) => respuesta.json())
            .then((datos) => setCategorias(datos.result || datos))
            .catch(() => setError('No se pudieron cargar las categorías'))
    }, [])

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const validar = () => {
        if (form.asunto.trim() === '') return 'Escribe el asunto'
        if (form.descripcion.trim() === '') return 'Describe tu incidencia'
        if (form.categoria === '') return 'Elige una categoría'
        return ''
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const mensaje = validar()
        if (mensaje) {
            setError(mensaje)
            setAviso('')
            return
        }
        setError('')
        setCargando(true)
        try {
            await post('/tickets/crearTicket', form)
            setAviso('Incidencia creada correctamente')
            setForm({ asunto: '', descripcion: '', categoria: '', prioridad: 'MEDIA' })
        } catch (error) {
            setError(error.message)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="auth-pagina">
            <div className="auth-tarjeta incidencias-tarjeta">
                <div className="auth-logo">
                    <img className="auth-logo-icono" src={`${import.meta.env.BASE_URL}logo-academia-aldea.png`} alt="" />
                    Academia Aldea
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <h1 className="auth-titulo">Nueva incidencia</h1>
                    {aviso && <p className="auth-aviso">{aviso}</p>}
                    {error && <p className="auth-error">{error}</p>}
                    <input
                        className="auth-input"
                        name="asunto"
                        placeholder="Asunto"
                        value={form.asunto}
                        onChange={handleChange}
                    />
                    <textarea
                        className="auth-input"
                        name="descripcion"
                        placeholder="Describe tu incidencia"
                        rows={4}
                        value={form.descripcion}
                        onChange={handleChange}
                    />
                    <select className="auth-input" name="categoria" value={form.categoria} onChange={handleChange}>
                        <option value="">Elige una categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria._id} value={categoria._id}>{categoria.nombre}</option>
                        ))}
                    </select>
                    <select className="auth-input" name="prioridad" value={form.prioridad} onChange={handleChange}>
                        <option value="BAJA">Baja</option>
                        <option value="MEDIA">Media</option>
                        <option value="ALTA">Alta</option>
                    </select>
                    <div className="auth-botones">
                        <button type="submit" className="auth-boton auth-boton-principal" disabled={cargando}>
                            {cargando ? 'Enviando...' : 'Crear incidencia'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}