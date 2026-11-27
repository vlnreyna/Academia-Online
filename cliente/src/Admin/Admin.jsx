import { useSearchParams } from 'react-router-dom'
import AdminResumen from './AdminResumen'
import AdminUsuarios from './AdminUsuarios'
import AdminCategorias from './AdminCategorias'
import AdminMatriculas from './AdminMatriculas'
import './Admin.css'

const SECCIONES = [
  { clave: 'resumen', texto: 'Resumen', componente: AdminResumen },
  { clave: 'usuarios', texto: 'Usuarios y roles', componente: AdminUsuarios },
  { clave: 'categorias', texto: 'Categorías', componente: AdminCategorias },
  { clave: 'matriculas', texto: 'Matrículas', componente: AdminMatriculas },
]

export default function Admin() {
  const [parametros, setParametros] = useSearchParams()
  const actual = SECCIONES.find((seccion) => seccion.clave === parametros.get('seccion')) ?? SECCIONES[0]
  const Seccion = actual.componente

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <h1>Administración</h1>
        <p className="pagina-intro">Indicadores del soporte, cuentas, categorías de tickets y matrículas.</p>
      </header>

      <div className="pestanas" role="tablist" aria-label="Secciones de administración">
        {SECCIONES.map((seccion) => (
          <button
            key={seccion.clave}
            type="button"
            role="tab"
            id={`pestana-${seccion.clave}`}
            aria-selected={seccion.clave === actual.clave}
            aria-controls="panel-admin"
            className="pestana"
            onClick={() => setParametros({ seccion: seccion.clave })}
          >
            {seccion.texto}
          </button>
        ))}
      </div>

      <div id="panel-admin" role="tabpanel" aria-labelledby={`pestana-${actual.clave}`}>
        <Seccion />
      </div>
    </div>
  )
}
