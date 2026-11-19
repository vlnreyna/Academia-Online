//AQUI ES DONDE SE ENLAZAN LAS COSAS
import './Navbar.css'

export default function Navbar({ vista, setVista }) {
  return (
    <nav className='navbar'>
      <span className='navbar-brand'>Academia Online</span>
      <div className='navbar-links'>
        <button
          className={vista === 'login' ? 'navbar-link activo' : 'navbar-link'}
          onClick={() => setVista('login')}
        >
          Login
        </button>
        <button
          className={vista === 'signup' ? 'navbar-link activo' : 'navbar-link'}
          onClick={() => setVista('signup')}
        >
          Sign Up
        </button>
      </div>
    </nav>
  )
}