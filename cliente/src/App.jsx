import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import Login from './Login';
import SingUp from './SingUp';
import Navbar from './Navbar';

function App() {

  const [vista, setVista] = useState('login')

  return (
      <div className='App'>
        <Navbar vista={vista} setVista={setVista} />
        <main className='App-main'>
          <div className='card'>
            <img src={reactLogo} className='App-logo' alt="logo"/>
            <h1 className='card-title'>
              {vista === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </h1>
            {vista === 'login' ? <Login/> : <SingUp/>}
          </div>
        </main>
      </div>
  );
}

export default App;