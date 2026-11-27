export const API_URL = import.meta.env.VITE_API_URL

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const ROLES = ['ALUMNO', 'AGENTE', 'ADMIN']
export const ROL_TEXTO = {
  ALUMNO: 'Alumno',
  AGENTE: 'Agente de soporte',
  ADMIN: 'Administrador',
}

export const ESTADOS = ['ABIERTO', 'EN_CURSO', 'PENDIENTE_CLIENTE', 'RESUELTO', 'CERRADO']
export const ESTADO_TEXTO = {
  ABIERTO: 'Abierto',
  EN_CURSO: 'En curso',
  PENDIENTE_CLIENTE: 'Pendiente del alumno',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
}

export const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA']
export const PRIORIDAD_TEXTO = { BAJA: 'Baja', MEDIA: 'Media', ALTA: 'Alta' }

export const NIVELES = ['BASICO', 'INTERMEDIO', 'AVANZADO']
export const NIVEL_TEXTO = { BASICO: 'Básico', INTERMEDIO: 'Intermedio', AVANZADO: 'Avanzado' }

export const TRANSICIONES = {
  AGENTE: {
    ABIERTO: ['EN_CURSO'],
    EN_CURSO: ['PENDIENTE_CLIENTE', 'RESUELTO'],
    PENDIENTE_CLIENTE: ['EN_CURSO'],
    RESUELTO: ['EN_CURSO'],
  },
  ALUMNO: {
    RESUELTO: ['CERRADO', 'EN_CURSO'],
  },
  ADMIN: {
    ABIERTO: ['EN_CURSO', 'CERRADO'],
    EN_CURSO: ['PENDIENTE_CLIENTE', 'RESUELTO', 'CERRADO'],
    PENDIENTE_CLIENTE: ['EN_CURSO', 'CERRADO'],
    RESUELTO: ['EN_CURSO', 'CERRADO'],
  },
}

export function codigoTicket(id) {
  return `#${String(id).slice(-6).toUpperCase()}`
}

export function nombreCompleto(usuario) {
  if (!usuario) return '—'
  return `${usuario.nombre} ${usuario.apellidos}`
}

export function formatearFecha(iso, conHora = false) {
  if (!iso) return '—'
  const opciones = { day: '2-digit', month: 'short', year: 'numeric' }
  if (conHora) {
    opciones.hour = '2-digit'
    opciones.minute = '2-digit'
  }
  return new Date(iso).toLocaleString('es-ES', opciones)
}

export function formatearPrecio(valor) {
  return Number(valor).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}
