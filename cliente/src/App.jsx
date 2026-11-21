import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import SignUp from './SignUp'

export default function App() {
    const [usuario, setUsuario] = useState(null)

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login onLogin={setUsuario} />} />
                <Route path="/registro" element={<SignUp />} />
                <Route path="/" element={usuario ? <h1>Hola, {usuario.nombre}</h1> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}