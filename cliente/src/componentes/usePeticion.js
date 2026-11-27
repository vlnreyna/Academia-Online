import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'

export function usePeticion(ruta) {
  const [version, setVersion] = useState(0)
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: '' })
  const clave = ruta ? `${ruta}#${version}` : null

  useEffect(() => {
    if (!ruta) return undefined
    let vigente = true
    const claveActual = `${ruta}#${version}`
    api
      .get(ruta)
      .then((datos) => {
        if (vigente) setResultado({ clave: claveActual, datos, error: '' })
      })
      .catch((error) => {
        if (vigente) setResultado((previo) => ({ clave: claveActual, datos: previo.datos, error: error.message }))
      })
    return () => {
      vigente = false
    }
  }, [ruta, version])

  const recargar = useCallback(() => setVersion((valor) => valor + 1), [])

  return {
    datos: resultado.datos,
    error: resultado.clave === clave ? resultado.error : '',
    cargando: Boolean(ruta) && resultado.clave !== clave,
    recargar,
  }
}
