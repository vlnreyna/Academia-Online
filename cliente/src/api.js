const API = import.meta.env.VITE_API_URL

export async function post(ruta, datos) {
    let respuesta
    try {
        respuesta = await fetch(`${API}${ruta}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
    } catch {
        throw new Error('No se pudo conectar con el servidor')
    }
    const json = await respuesta.json().catch(() => ({}))
    if (!respuesta.ok) {
        throw new Error(json.message || 'Ha ocurrido un error')
    }
    return json
}