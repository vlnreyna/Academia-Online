import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import SignUp from './SingUp'
import Home from './Home'

export default function App() {
    const [usuario, setUsuario] = useState(null)

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home usuario={usuario} />} />
                <Route path="/login" element={<Login onLogin={setUsuario} />} />
                <Route path="/registro" element={<SignUp />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}