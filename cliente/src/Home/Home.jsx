import { Link } from 'react-router-dom'
import { useSesion } from '../Sesion/SesionContext'
import './Home.css'

const HISTORIA = [
  'Academia Aldea nació con una idea sencilla: que aprender sea accesible y cercano, desde cualquier lugar.',
  'Empezamos con un pequeño grupo de profesores y alumnos. Hoy ofrecemos cursos online por niveles y un equipo de soporte que responde a cada consulta mediante tickets, para que ninguna duda se quede sin seguimiento.',
]

const PASOS = [
  { titulo: 'Abres un ticket', texto: 'Eliges la categoría, cuentas qué pasa y marcas la prioridad.' },
  { titulo: 'Un agente lo atiende', texto: 'Administración lo asigna a un agente, que te responde en el mismo ticket.' },
  { titulo: 'Confirmas la solución', texto: 'Cuando esté resuelto, cierras el ticket o pides que se reabra.' },
]

const PREGUNTAS = [
  {
    q: '¿Cómo me registro?',
    a: 'Entra en «Entrar», rellena el formulario «Crear cuenta» y después inicia sesión con tu correo. Todas las cuentas nuevas son de alumno.',
  },
  {
    q: '¿Qué contraseña necesito?',
    a: 'Al menos 8 caracteres, con una mayúscula y un número.',
  },
  {
    q: '¿Cómo me matriculo en un curso?',
    a: 'Abre el curso desde «Cursos» y pulsa «Matricularme». Verás tus matrículas en «Mi cuenta».',
  },
  {
    q: '¿Cómo abro un ticket?',
    a: 'Desde «Mis tickets» pulsa «Abrir ticket», elige una categoría y describe tu consulta con detalle.',
  },
  {
    q: '¿Quién puede ver mis tickets?',
    a: 'Solo tú, el agente asignado y administración. Ningún otro alumno puede abrirlos, aunque conozca el enlace.',
  },
  {
    q: '¿Qué significa «Pendiente del alumno»?',
    a: 'El agente necesita que le respondas. En cuanto contestes, el ticket vuelve a «En curso».',
  },
]

export default function Home() {
  const { usuario } = useSesion()
  const puedeAbrirTicket = !usuario || usuario.rol === 'ALUMNO' || usuario.rol === 'ADMIN'

  return (
    <div className="home">
      <header className="home-hero">
        <img src="/logo-academia-aldea.png" alt="Academia Aldea" className="home-logo" width="168" height="168" />
        <h1>Aprende a tu ritmo, con soporte cercano</h1>
        <p className="home-subtitulo">
          Cursos online por niveles y un equipo de soporte que sigue cada consulta hasta resolverla.
        </p>
        <div className="home-acciones">
          <Link to="/cursos" className="boton boton-principal">
            Ver cursos
          </Link>
          {puedeAbrirTicket && (
            <Link to={usuario ? '/tickets/nuevo' : '/acceso'} className="boton boton-secundario">
              {usuario ? 'Abrir un ticket' : 'Crear cuenta'}
            </Link>
          )}
        </div>
      </header>

      <section className="home-ciclo" aria-labelledby="titulo-ciclo">
        <h2 id="titulo-ciclo">Así funciona el soporte</h2>
        <ol className="home-pasos">
          {PASOS.map((paso) => (
            <li key={paso.titulo}>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="home-contenido">
        <section id="sobre-el-proyecto" className="home-bloque">
          <h2>Sobre el proyecto</h2>
          {HISTORIA.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </section>

        <section id="ayuda" className="home-bloque">
          <h2>Ayuda y preguntas frecuentes</h2>
          {PREGUNTAS.map((item) => (
            <details key={item.q} className="faq">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>
      </div>
    </div>
  )
}
