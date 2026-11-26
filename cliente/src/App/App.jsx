import { useState } from 'react'
import './App.css'
import Navbar from '../ConectoresDePaginas/Navbar'
import Home from '../Home/Home'
import Login from '../Login/Login'
import SignUp from '../SingUp/SignUp'
import Contenido from '../Contenido/Contenido'
import Incidencias from '../Incidencias/Incidencias'

function App() {
  const [vista, setVista] = useState('home')

  return (
    <div className='App'>
      {vista === 'home' && <Home irA={setVista} />}
      {vista === 'login' && <Login onLogin={() => setVista('contenido')} irA={setVista} />}
      {vista === 'signup' && <SignUp irA={setVista} />}
      {vista === 'contenido' && <Contenido irA={setVista} />}
      {vista === 'incidencias' && <Incidencias />}
    </div>
  )
}

export default App