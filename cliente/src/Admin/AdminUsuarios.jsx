import { useState } from 'react'
import { ROLES, ROL_TEXTO, formatearFecha, nombreCompleto } from '../Config'
import { api } from '../api'
import { usePeticion } from '../componentes/usePeticion'
import { Activo } from '../componentes/Insignias'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'

function FilaUsuario({ usuario, ocupado, onRol, onEstado }) {
  const [rol, setRol] = useState(usuario.rol)

  return (
    <tr>
      <td>
        <strong>{nombreCompleto(usuario)}</strong>
        <span className="tabla-sub">{usuario.email}</span>
      </td>
      <td>{formatearFecha(usuario.createdAt)}</td>
      <td>
        <Activo activo={usuario.activo} si="Activa" no="Desactivada" />
      </td>
      <td>
        <div className="gestion-linea">
          <label className="campo">
            <span className="solo-lector">Rol de {nombreCompleto(usuario)}</span>
            <select value={rol} onChange={(event) => setRol(event.target.value)} disabled={ocupado}>
              {ROLES.map((valor) => (
                <option key={valor} value={valor}>
                  {ROL_TEXTO[valor]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="boton boton-secundario boton-pequeno"
            disabled={ocupado || rol === usuario.rol}
            onClick={() => onRol(usuario, rol)}
          >
            Cambiar
          </button>
        </div>
      </td>
      <td className="tabla-acciones">
        <button
          type="button"
          className={usuario.activo ? 'boton boton-peligro boton-pequeno' : 'boton boton-secundario boton-pequeno'}
          disabled={ocupado}
          onClick={() => onEstado(usuario)}
        >
          {usuario.activo ? 'Desactivar' : 'Activar'}
        </button>
      </td>
    </tr>
  )
}

export default function AdminUsuarios() {
  const alumnos = usePeticion('/usuarios/listarAlumnos')
  const agentes = usePeticion('/usuarios/listarAgentes')
  const [filtroRol, setFiltroRol] = useState('')
  const [texto, setTexto] = useState('')
  const [ocupado, setOcupado] = useState('')
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })

  const recargar = () => {
    alumnos.recargar()
    agentes.recargar()
  }

  const ejecutar = async (id, peticion, exito) => {
    setOcupado(id)
    setMensaje({ tipo: '', texto: '' })
    try {
      await peticion()
      setMensaje({ tipo: 'exito', texto: exito })
      recargar()
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } finally {
      setOcupado('')
    }
  }

  const cambiarRol = (usuario, rol) => {
    if (rol === 'ADMIN' && !window.confirm(`${nombreCompleto(usuario)} tendrá acceso total a la administración. ¿Continuar?`)) return
    ejecutar(
      usuario._id,
      () => api.put('/usuarios/cambiarRol', { usuarioID: usuario._id, rol }),
      `${nombreCompleto(usuario)} ahora es ${ROL_TEXTO[rol].toLowerCase()}.`,
    )
  }

  const cambiarEstado = (usuario) => {
    const ruta = usuario.activo ? 'desactivarUsuario' : 'activarUsuario'
    if (usuario.activo && !window.confirm(`${nombreCompleto(usuario)} no podrá iniciar sesión. ¿Desactivar la cuenta?`)) return
    ejecutar(
      usuario._id,
      () => api.put(`/usuarios/${ruta}/${usuario._id}`),
      usuario.activo ? 'Cuenta desactivada.' : 'Cuenta activada.',
    )
  }

  const busqueda = texto.trim().toLowerCase()
  const usuarios = [...(alumnos.datos?.alumnos ?? []), ...(agentes.datos?.agentes ?? [])]
    .filter((usuario) => !filtroRol || usuario.rol === filtroRol)
    .filter(
      (usuario) =>
        !busqueda ||
        nombreCompleto(usuario).toLowerCase().includes(busqueda) ||
        usuario.email.includes(busqueda),
    )
    .sort((a, b) => nombreCompleto(a).localeCompare(nombreCompleto(b), 'es'))

  const error = alumnos.error || agentes.error
  const cargando = !alumnos.datos || !agentes.datos

  return (
    <>
      <div className="filtros" role="search">
        <label className="campo">
          <span>Buscar</span>
          <input type="search" placeholder="Nombre o correo" value={texto} onChange={(event) => setTexto(event.target.value)} />
        </label>
        <label className="campo">
          <span>Rol</span>
          <select value={filtroRol} onChange={(event) => setFiltroRol(event.target.value)}>
            <option value="">Alumnos y agentes</option>
            <option value="ALUMNO">Alumnos</option>
            <option value="AGENTE">Agentes</option>
          </select>
        </label>
      </div>

      <Aviso tipo={mensaje.tipo}>{mensaje.texto}</Aviso>
      <Aviso tipo="error">{error}</Aviso>
      {cargando && !error && <Cargando texto="Cargando usuarios…" />}

      {!cargando &&
        (usuarios.length === 0 ? (
          <div className="vacio">Ningún usuario coincide con la búsqueda.</div>
        ) : (
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Usuario</th>
                  <th scope="col">Alta</th>
                  <th scope="col">Cuenta</th>
                  <th scope="col">Rol</th>
                  <th scope="col">
                    <span className="solo-lector">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <FilaUsuario
                    key={`${usuario._id}-${usuario.rol}`}
                    usuario={usuario}
                    ocupado={ocupado === usuario._id}
                    onRol={cambiarRol}
                    onEstado={cambiarEstado}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ))}
      <p className="nota">Las cuentas de administrador no aparecen en este listado.</p>
    </>
  )
}
