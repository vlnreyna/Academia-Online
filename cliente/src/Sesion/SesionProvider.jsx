import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, CLAVE_TOKEN, CLAVE_USUARIO, EVENTO_SESION_CADUCADA } from '../api'
import { SesionContext } from './SesionContext'

function leerUsuarioGuardado() {
  try {
    if (!localStorage.getItem(CLAVE_TOKEN)) return null
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO))
  } catch {
    return null
  }
}

function guardar(clave, valor) {
  try {
    if (valor === null) localStorage.removeItem(clave)
    else localStorage.setItem(clave, valor)
  } catch {
    return
  }
}

export default function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado)
  const [avisoSesion, setAvisoSesion] = useState('')

  const actualizarUsuario = useCallback((datos) => {
    guardar(CLAVE_USUARIO, JSON.stringify(datos))
    setUsuario(datos)
  }, [])

  const iniciarSesion = useCallback(
    (token, datos) => {
      guardar(CLAVE_TOKEN, token)
      setAvisoSesion('')
      actualizarUsuario(datos)
    },
    [actualizarUsuario],
  )

  const cerrarSesion = useCallback(() => {
    guardar(CLAVE_TOKEN, null)
    guardar(CLAVE_USUARIO, null)
    setUsuario(null)
  }, [])

  useEffect(() => {
    const caducada = () => {
      cerrarSesion()
      setAvisoSesion('Tu sesión ha caducado. Vuelve a iniciar sesión.')
    }
    window.addEventListener(EVENTO_SESION_CADUCADA, caducada)
    return () => window.removeEventListener(EVENTO_SESION_CADUCADA, caducada)
  }, [cerrarSesion])

  useEffect(() => {
    if (!leerUsuarioGuardado()) return
    api
      .get('/usuarios/perfil')
      .then((datos) => actualizarUsuario(datos.usuario))
      .catch(() => {})
  }, [actualizarUsuario])

  const valor = useMemo(
    () => ({ usuario, iniciarSesion, cerrarSesion, actualizarUsuario, avisoSesion }),
    [usuario, iniciarSesion, cerrarSesion, actualizarUsuario, avisoSesion],
  )

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}
