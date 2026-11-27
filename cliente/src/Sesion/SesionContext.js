import { createContext, useContext } from 'react'

export const SesionContext = createContext(null)

export function useSesion() {
  const contexto = useContext(SesionContext)
  if (!contexto) throw new Error('useSesion debe usarse dentro de SesionProvider')
  return contexto
}

export function rutaInicial(rol) {
  if (rol === 'ADMIN') return '/admin'
  if (rol === 'AGENTE') return '/soporte'
  return '/perfil'
}
