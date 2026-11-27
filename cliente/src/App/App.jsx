import { useState } from 'react'
import './App.css'
import Navbar from '../ConectoresDePaginas/Navbar'
import Home from '../Home/Home'
import Acceso from '../Acceso/Acceso'
import Contenido from '../Contenido/Contenido'
import Incidencias from '../Incidencias/Incidencias'

function App() {
  const [vista, setVista] = useState('home')

  return (
    <div className='App'>
      {vista === 'home' && <Home irA={setVista} />}
      {vista === 'acceso' && <Acceso onLogin={() => setVista('contenido')} irA={setVista} />}
      {vista === 'contenido' && <Contenido irA={setVista} />}
      {vista === 'incidencias' && <Incidencias />}
    </div>
  )
}

export default App