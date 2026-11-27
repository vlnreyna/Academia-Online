import { API_URL } from './Config'

export const CLAVE_TOKEN = 'token'
export const CLAVE_USUARIO = 'usuario'
export const EVENTO_SESION_CADUCADA = 'sesion-caducada'

function leerToken() {
  try {
    return localStorage.getItem(CLAVE_TOKEN)
  } catch {
    return null
  }
}

function mensajeDeError(json, estado) {
  if (Array.isArray(json.errores) && json.errores.length > 0) return json.errores[0].msg
  if (json.message) return json.message
  if (estado === 404) return 'No se ha encontrado el recurso solicitado'
  if (estado >= 500) return 'El servidor ha tenido un problema. Inténtalo de nuevo en unos minutos'
  return 'No se ha podido completar la operación'
}

async function peticion(metodo, ruta, datos) {
  if (!API_URL) throw new Error('Falta configurar VITE_API_URL en el archivo .env del cliente')

  const token = leerToken()
  const headers = {}
  if (datos !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers,
      body: datos !== undefined ? JSON.stringify(datos) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  const json = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    if (respuesta.status === 401 && token) {
      window.dispatchEvent(new Event(EVENTO_SESION_CADUCADA))
    }
    const error = new Error(mensajeDeError(json, respuesta.status))
    error.estado = respuesta.status
    throw error
  }

  return json
}

export const api = {
  get: (ruta) => peticion('GET', ruta),
  post: (ruta, datos = {}) => peticion('POST', ruta, datos),
  put: (ruta, datos = {}) => peticion('PUT', ruta, datos),
}

export function construirQuery(parametros) {
  const query = new URLSearchParams()
  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') query.set(clave, valor)
  })
  const texto = query.toString()
  return texto ? `?${texto}` : ''
}
