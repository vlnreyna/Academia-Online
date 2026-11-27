import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { NIVELES, NIVEL_TEXTO, formatearPrecio } from '../Config'
import { construirQuery } from '../api'
import { useSesion } from '../Sesion/SesionContext'
import { usePeticion } from '../componentes/usePeticion'
import { Activo } from '../componentes/Insignias'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'
import './Cursos.css'

export default function Cursos() {
  const { usuario } = useSesion()
  const esAdmin = usuario?.rol === 'ADMIN'
  const [parametros, setParametros] = useSearchParams()
  const nombre = parametros.get('nombre') ?? ''
  const nivel = parametros.get('nivel') ?? ''
  const activo = esAdmin ? parametros.get('activo') ?? '' : ''
  const [busqueda, setBusqueda] = useState(nombre)

  const { datos, error, cargando } = usePeticion(`/cursos${construirQuery({ nombre, nivel, activo })}`)
  const cursos = datos?.result ?? []

  const cambiarFiltro = (clave, valor) => {
    const siguientes = new URLSearchParams(parametros)
    if (valor) siguientes.set(clave, valor)
    else siguientes.delete(clave)
    setParametros(siguientes, { replace: true })
  }

  const buscar = (event) => {
    event.preventDefault()
    cambiarFiltro('nombre', busqueda.trim())
  }

  const limpiar = () => {
    setBusqueda('')
    setParametros({}, { replace: true })
  }

  const hayFiltros = Boolean(nombre || nivel || activo)

  return (
    <div className="pagina">
      <header className="pagina-cabecera pagina-cabecera-acciones">
        <div>
          <h1>Cursos</h1>
          <p className="pagina-intro">Formación online por niveles. Abre un curso para ver su ficha y matricularte.</p>
        </div>
        {esAdmin && (
          <Link to="/cursos/nuevo" className="boton boton-principal">
            Nuevo curso
          </Link>
        )}
      </header>

      <div className="filtros" role="search">
        <form onSubmit={buscar} className="filtros-busqueda">
          <label className="campo">
            <span>Buscar por nombre</span>
            <input
              type="search"
              value={busqueda}
              maxLength={50}
              placeholder="Ej. Python, Inglés…"
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>
          <button type="submit" className="boton boton-secundario">
            Buscar
          </button>
        </form>
        <label className="campo">
          <span>Nivel</span>
          <select value={nivel} onChange={(event) => cambiarFiltro('nivel', event.target.value)}>
            <option value="">Todos</option>
            {NIVELES.map((valor) => (
              <option key={valor} value={valor}>
                {NIVEL_TEXTO[valor]}
              </option>
            ))}
          </select>
        </label>
        {esAdmin && (
          <label className="campo">
            <span>Estado</span>
            <select value={activo} onChange={(event) => cambiarFiltro('activo', event.target.value)}>
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </label>
        )}
        {hayFiltros && (
          <button type="button" className="boton-enlace" onClick={limpiar}>
            Quitar filtros
          </button>
        )}
      </div>

      {!usuario && error ? (
        <div className="vacio">
          <p>Inicia sesión para ver el catálogo completo de cursos.</p>
          <Link to="/acceso" className="boton boton-principal">
            Entrar o crear cuenta
          </Link>
        </div>
      ) : (
        <>
          <Aviso tipo="error">{error}</Aviso>
          {cargando && !datos && <Cargando texto="Cargando cursos…" />}
          {datos && cursos.length === 0 && (
            <div className="vacio">
              <p>{hayFiltros ? 'Ningún curso coincide con la búsqueda.' : 'Todavía no hay cursos publicados.'}</p>
              {hayFiltros && (
                <button type="button" className="boton boton-secundario" onClick={limpiar}>
                  Ver todos los cursos
                </button>
              )}
            </div>
          )}
          {cursos.length > 0 && (
            <ul className={cargando ? 'cursos-rejilla actualizando' : 'cursos-rejilla'}>
              {cursos.map((curso) => (
                <li key={curso._id}>
                  <Link to={`/cursos/${curso._id}`} className="curso-tarjeta">
                    <span className={`curso-nivel nivel-${curso.nivel.toLowerCase()}`}>{NIVEL_TEXTO[curso.nivel]}</span>
                    <h2>{curso.nombre}</h2>
                    <p>{curso.descripcion}</p>
                    <span className="curso-datos">
                      <span>{curso.duracionHoras} h</span>
                      <strong>{formatearPrecio(curso.precio)}</strong>
                    </span>
                    {esAdmin && <Activo activo={curso.activo} si="Publicado" no="Desactivado" />}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
