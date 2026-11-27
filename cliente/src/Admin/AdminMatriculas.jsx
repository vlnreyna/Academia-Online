import { useState } from 'react'
import { formatearFecha, nombreCompleto } from '../Config'
import { api, construirQuery } from '../api'
import { usePeticion } from '../componentes/usePeticion'
import { Activo } from '../componentes/Insignias'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'

export default function AdminMatriculas() {
  const [filtros, setFiltros] = useState({ cursoID: '', alumnoID: '', activa: '' })
  const [nueva, setNueva] = useState({ usuarioID: '', cursoID: '' })
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [ocupado, setOcupado] = useState('')

  const matriculas = usePeticion(`/matriculas${construirQuery(filtros)}`)
  const cursos = usePeticion('/cursos')
  const alumnos = usePeticion('/usuarios/listarAlumnos')

  const listaCursos = cursos.datos?.result ?? []
  const listaAlumnos = alumnos.datos?.alumnos ?? []
  const lista = matriculas.datos?.result ?? []

  const cambiarFiltro = (event) => setFiltros({ ...filtros, [event.target.name]: event.target.value })
  const cambiarNueva = (event) => setNueva({ ...nueva, [event.target.name]: event.target.value })

  const matricular = async (event) => {
    event.preventDefault()
    if (!nueva.usuarioID || !nueva.cursoID) {
      setMensaje({ tipo: 'error', texto: 'Elige un alumno y un curso' })
      return
    }
    setOcupado('nueva')
    try {
      await api.post('/matriculas/crearMatricula', nueva)
      setNueva({ usuarioID: '', cursoID: '' })
      setMensaje({ tipo: 'exito', texto: 'Matrícula registrada.' })
      matriculas.recargar()
    } catch (fallo) {
      setMensaje({ tipo: 'error', texto: fallo.message })
    } finally {
      setOcupado('')
    }
  }

  const cambiarEstado = async (matricula) => {
    setOcupado(matricula._id)
    try {
      await api.put(`/matriculas/cambiarEstado/${matricula._id}`)
      setMensaje({ tipo: 'exito', texto: matricula.activa ? 'Matrícula desactivada.' : 'Matrícula activada.' })
      matriculas.recargar()
    } catch (fallo) {
      setMensaje({ tipo: 'error', texto: fallo.message })
    } finally {
      setOcupado('')
    }
  }

  return (
    <div className="admin-dos-columnas">
      <section aria-labelledby="titulo-matriculas-admin">
        <h2 id="titulo-matriculas-admin">Matrículas</h2>
        <div className="filtros">
          <label className="campo">
            <span>Curso</span>
            <select name="cursoID" value={filtros.cursoID} onChange={cambiarFiltro}>
              <option value="">Todos</option>
              {listaCursos.map((curso) => (
                <option key={curso._id} value={curso._id}>
                  {curso.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="campo">
            <span>Alumno</span>
            <select name="alumnoID" value={filtros.alumnoID} onChange={cambiarFiltro}>
              <option value="">Todos</option>
              {listaAlumnos.map((alumno) => (
                <option key={alumno._id} value={alumno._id}>
                  {nombreCompleto(alumno)}
                </option>
              ))}
            </select>
          </label>
          <label className="campo">
            <span>Estado</span>
            <select name="activa" value={filtros.activa} onChange={cambiarFiltro}>
              <option value="">Todas</option>
              <option value="true">Activas</option>
              <option value="false">Desactivadas</option>
            </select>
          </label>
        </div>

        <Aviso tipo={mensaje.tipo}>{mensaje.texto}</Aviso>
        <Aviso tipo="error">{matriculas.error}</Aviso>
        {!matriculas.datos && !matriculas.error && <Cargando texto="Cargando matrículas…" />}
        {matriculas.datos && lista.length === 0 && <div className="vacio">No hay matrículas con estos filtros.</div>}
        {lista.length > 0 && (
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Alumno</th>
                  <th scope="col">Curso</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Estado</th>
                  <th scope="col">
                    <span className="solo-lector">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {lista.map((matricula) => (
                  <tr key={matricula._id}>
                    <td>
                      <strong>{nombreCompleto(matricula.usuario)}</strong>
                      <span className="tabla-sub">{matricula.usuario?.email}</span>
                    </td>
                    <td>{matricula.curso?.nombre ?? 'Curso eliminado'}</td>
                    <td>{formatearFecha(matricula.createdAt)}</td>
                    <td>
                      <Activo activo={matricula.activa} si="Activa" no="Desactivada" />
                    </td>
                    <td className="tabla-acciones">
                      <button
                        type="button"
                        className={matricula.activa ? 'boton boton-peligro boton-pequeno' : 'boton boton-secundario boton-pequeno'}
                        disabled={ocupado === matricula._id}
                        onClick={() => cambiarEstado(matricula)}
                      >
                        {matricula.activa ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <form onSubmit={matricular} noValidate className="panel formulario" aria-labelledby="titulo-nueva-matricula">
        <h2 id="titulo-nueva-matricula">Matricular a un alumno</h2>
        <label className="campo">
          <span>Alumno</span>
          <select name="usuarioID" value={nueva.usuarioID} onChange={cambiarNueva}>
            <option value="">Elige un alumno</option>
            {listaAlumnos
              .filter((alumno) => alumno.activo)
              .map((alumno) => (
                <option key={alumno._id} value={alumno._id}>
                  {nombreCompleto(alumno)}
                </option>
              ))}
          </select>
        </label>
        <label className="campo">
          <span>Curso</span>
          <select name="cursoID" value={nueva.cursoID} onChange={cambiarNueva}>
            <option value="">Elige un curso</option>
            {listaCursos
              .filter((curso) => curso.activo)
              .map((curso) => (
                <option key={curso._id} value={curso._id}>
                  {curso.nombre}
                </option>
              ))}
          </select>
        </label>
        <div className="acciones">
          <button type="submit" className="boton boton-principal" disabled={ocupado === 'nueva'}>
            {ocupado === 'nueva' ? 'Matriculando…' : 'Matricular'}
          </button>
        </div>
      </form>
    </div>
  )
}
