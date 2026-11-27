import './Home.css'

const VENTAJAS = [
  {
    titulo: 'Cursos por niveles',
    texto: 'Itinerarios ordenados de menos a más, para avanzar a tu ritmo sin perderte por el camino.',
  },
  {
    titulo: 'Soporte con seguimiento',
    texto: 'Cada duda se convierte en un ticket con agente asignado y un historial que no se pierde.',
  },
  {
    titulo: 'Transparencia total',
    texto: 'Ves en todo momento en qué estado está tu consulta y cuándo te toca responder a ti.',
  },
  {
    titulo: 'Privacidad por defecto',
    texto: 'Tus tickets los ven solo tú, el agente asignado y administración. Nadie más.',
  },
]

const PASOS = [
  {
    titulo: 'Abres un ticket',
    texto: 'Eliges la categoría, cuentas qué pasa con detalle y marcas la prioridad.',
  },
  {
    titulo: 'Un agente lo atiende',
    texto: 'Administración lo asigna a un agente, que te responde en el mismo ticket.',
  },
  {
    titulo: 'Confirmas la solución',
    texto: 'Cuando esté resuelto, cierras el ticket o pides que se reabra si hace falta.',
  },
]

const HISTORIA = [
  'Academia Aldea nació con una idea sencilla: que aprender sea accesible y cercano, desde cualquier lugar.',
  'Empezamos con un pequeño grupo de profesores y alumnos. Hoy ofrecemos cursos online por niveles y un equipo de soporte que responde a cada consulta mediante tickets, para que ninguna duda se quede sin seguimiento.',
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
  return (
    <div className="home">
      <header className="home-hero">
        <img
          src={`${import.meta.env.BASE_URL}logo-academia-aldea.png`}
          alt="Academia Aldea"
          className="home-logo"
          width="168"
          height="168"
        />
        <p className="home-etiqueta">Academia online todo lo que necesitas</p>
        <h1>Aprende a tu ritmo con soporte, no te quedes colgado</h1>
        <p className="home-subtitulo">
          Cursos online organizados por niveles y un equipo de soporte que sigue cada consulta hasta
          resolverla. Estudiando con calma y buena letra, se consigue todo, y si no ya tienes a quien preguntar.
        </p>
      </header>

      <section className="home-ventajas" aria-labelledby="titulo-ventajas">
        <h2 id="titulo-ventajas">Qué encontrarás aquí</h2>
        <ul className="home-tarjetas">
          {VENTAJAS.map((item) => (
            <li key={item.titulo} className="home-tarjeta">
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-ciclo" aria-labelledby="titulo-ciclo">
        <h2 id="titulo-ciclo">Así funciona el soporte</h2>
        <p className="home-intro-seccion">
          Tres pasos sencillos, sin correos perdidos ni preguntas repetidas.
        </p>
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