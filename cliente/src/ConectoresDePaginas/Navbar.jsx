//AQUI ES DONDE SE ENLAZAN LAS COSAS
export default function Navbar({ vista, setVista }) {
  return (
    <nav className='navbar'>
      <span className='navbar-brand' onClick={() => setVista('home')}>Academia Online</span>
      <div className='navbar-links'>
        {vista === 'contenido' ? (
          <button className='navbar-link' onClick={() => setVista('home')}>
            Cerrar sesión
          </button>
        ) : (
          <>
            <button
              className={vista === 'home' ? 'navbar-link activo' : 'navbar-link'}
              onClick={() => setVista('home')}
            >
              Inicio
            </button>
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
          </>
        )}
      </div>
    </nav>
  )
}
