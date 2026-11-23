import './Contenido.css'

const asignaturas = [
    {id: 1, nombre: 'Matematicas', descripcion: 'Algebra, Geometría y Estadistica', icono: '📐'},
    {id: 2, nombre: 'Lengua', descripcion: 'Gramatica, Ortografia y Literatura', icono: '📖'},
    {id: 3, nombre: 'Ingles', descripcion: 'Vocabulario, Gramatica y Listening', icono: '🗣️'},
    {id: 4, nombre: 'Historia', descripcion: 'Etapas Historicas, Dimesiones de Análisis y Metodología', icono: '👴👵'}
]

export default function Home(){
    return(
        <main className='Contenido'>
            <h1 className='Contenido-Titulo'>Asignaturas</h1>
            <div className='Contenido-Grid'>
                {asignaturas.map((asignatura) => (
          <div key={asignatura.id} className='asignatura'>
            <span className='asignatura-icono'>{asignatura.icono}</span>
            <h2 className='asignatura-nombre'>{asignatura.nombre}</h2>
            <p className='asignatura-descripcion'>{asignatura.descripcion}</p>
          </div>
        ))}
      </div>
    </main>
  )
}