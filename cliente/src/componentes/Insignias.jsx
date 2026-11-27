import { ESTADO_TEXTO, PRIORIDAD_TEXTO } from '../Config'

export function EstadoTicket({ estado }) {
  return <span className={`insignia estado-${estado.toLowerCase()}`}>{ESTADO_TEXTO[estado] ?? estado}</span>
}

export function Prioridad({ prioridad }) {
  return (
    <span className={`prioridad prioridad-${prioridad.toLowerCase()}`}>
      {PRIORIDAD_TEXTO[prioridad] ?? prioridad}
    </span>
  )
}

export function Activo({ activo, si = 'Activo', no = 'Inactivo' }) {
  return <span className={activo ? 'insignia activo-si' : 'insignia activo-no'}>{activo ? si : no}</span>
}
