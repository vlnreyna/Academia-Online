import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NIVEL_TEXTO, formatearPrecio } from '../Config'
import { api } from '../api'
import { useSesion } from '../Sesion/SesionContext'
import { usePeticion } from '../componentes/usePeticion'
import { Activo } from '../componentes/Insignias'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'
import './Cursos.css'

export default function CursoDetalle() {
  const { id } = useParams()
  const { usuario } = useSesion()
  const esAdmin = usuario?.rol === 'ADMIN'
  const esAlumno = usuario?.rol === 'ALUMNO'

  const curso = usePeticion(`/cursos/${id}`)
  const matriculas = usePeticion(esAlumno ? '/matriculas/misMatriculas' : null)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [enviando, setEnviando] = useState(false)

  if (!usuario && curso.error) {
    return (
      <div className="pagina">
        <h1>Ficha del curso</h1>
        <div className="vacio">
          <p>Inicia sesión para ver la ficha del curso y matricularte.</p>
          <Link to="/acceso" state={{ desde: `/cursos/${id}` }} className="boton boton-principal">
            Entrar o crear cuenta
          </Link>
        </div>
      </div>
    )
  }

  if (curso.error && !curso.datos) {
    return (
      <div className="pagina">
        <h1>Curso no disponible</h1>
        <Aviso tipo="error">{curso.error}</Aviso>
        <Link to="/cursos" className="boton boton-secundario">
          Volver a cursos
        </Link>
      </div>
    )
  }

  if (!curso.datos) return <div className="pagina"><Cargando texto="Cargando curso…" /></div>

  const datos = curso.datos.result
  const matricula = matriculas.datos?.result.find((item) => item.curso?._id === datos._id)

  const matricularme = async () => {
    setEnviando(true)
    try {
      await api.post('/matriculas/crearMatricula', { cursoID: datos._id })
      setMensaje({ tipo: 'exito', texto: 'Matrícula registrada. La verás en «Mi cuenta».' })
      matriculas.recargar()
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } finally {
      setEnviando(false)
    }
  }

  const cambiarEstado = async () => {
    const accion = datos.activo ? 'desactivar' : 'activar'
    if (!window.confirm(`¿Seguro que quieres ${accion} «${datos.nombre}»?`)) return
    setEnviando(true)
    try {
      await api.put(`/cursos/cambiarEstado/${datos._id}`)
      setMensaje({ tipo: 'exito', texto: datos.activo ? 'Curso desactivado.' : 'Curso activado.' })
      curso.recargar()
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="pagina curso-ficha">
      <Link to="/cursos" className="volver">
        Cursos
      </Link>
      <header className="pagina-cabecera">
        <span className={`curso-nivel nivel-${datos.nivel.toLowerCase()}`}>{NIVEL_TEXTO[datos.nivel]}</span>
        <h1>{datos.nombre}</h1>
        {esAdmin && <Activo activo={datos.activo} si="Publicado" no="Desactivado" />}
      </header>

      <div className="curso-ficha-cuerpo">
        <section className="panel">
          <h2>Descripción</h2>
          <p className="curso-descripcion">{datos.descripcion}</p>
        </section>

        <aside className="panel curso-resumen">
          <dl>
            <div>
              <dt>Duración</dt>
              <dd>{datos.duracionHoras} horas</dd>
            </div>
            <div>
              <dt>Precio</dt>
              <dd>{formatearPrecio(datos.precio)}</dd>
            </div>
          </dl>

          <Aviso tipo={mensaje.tipo}>{mensaje.texto}</Aviso>

          {esAlumno &&
            (matricula ? (
              <p className="curso-matriculado">
                {matricula.activa ? 'Ya estás matriculado en este curso.' : 'Tu matrícula en este curso está desactivada.'}
              </p>
            ) : (
              <button
                type="button"
                className="boton boton-principal"
                disabled={enviando || matriculas.cargando}
                onClick={matricularme}
              >
                {enviando ? 'Matriculando…' : 'Matricularme'}
              </button>
            ))}

          {esAdmin && (
            <div className="acciones">
              <Link to={`/cursos/${datos._id}/editar`} className="boton boton-principal">
                Editar curso
              </Link>
              <button type="button" className="boton boton-peligro" disabled={enviando} onClick={cambiarEstado}>
                {datos.activo ? 'Desactivar curso' : 'Activar curso'}
              </button>
            </div>
          )}

          {esAlumno && (
            <Link to="/tickets/nuevo" className="boton-enlace">
              ¿Problemas con el acceso al curso? Abre un ticket
            </Link>
          )}
        </aside>
      </div>
    </div>
  )
}
