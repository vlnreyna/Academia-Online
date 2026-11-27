import { useState } from 'react'
import './Home.css'
import Tickets from '../Tickets/Tickets'

const HISTORIA = [
  'Academia Aldea nació con una idea sencilla: que aprender sea accesible y cercano, desde cualquier lugar.',
  'Empezamos con un pequeño grupo de profesores y alumnos, y hoy ofrecemos cursos online con un equipo de soporte que responde a cada consulta.',
]

const PREGUNTAS = [
  {
    q: '¿Cómo me registro?',
    a: 'Pulsa en «Crear cuenta», rellena tus datos y después podrás iniciar sesión.',
  },
  {
    q: '¿Qué datos necesito para registrarme?',
    a: 'Nombre, apellidos, email y una contraseña de al menos 8 caracteres, con una mayúscula y un número.',
  },
  {
    q: '¿Cómo abro un ticket?',
    a: 'Pulsa en «Abrir un ticket», elige una categoría y describe tu consulta.',
  },
  {
    q: '¿Cómo sigo mis tickets?',
    a: 'En la pestaña «Tickets» verás el estado de cada consulta y las respuestas del equipo.',
  },
]

const ACCESOS = [
  { titulo: 'Cursos online', texto: 'Aprende a tu ritmo, desde cualquier lugar.' },
  { titulo: 'Soporte cercano', texto: 'Cada consulta tiene un ticket y un seguimiento.' },
  { titulo: 'Estado en tiempo real', texto: 'Mira en qué punto está tu consulta.' },
]

export default function Home({ irA }) {
  const [verTickets, setVerTickets] = useState(false)

  if (verTickets) {
    return (
      <div className="home">
        <div className="home-volver">
          <button type="button" className="btn btn-secundario" onClick={() => setVerTickets(false)}>
            Volver al inicio
          </button>
        </div>
        <Tickets />
      </div>
    )
  }

  return (
    <div className="home">
      <header className="home-hero">
        <button type="button" className="home-cuenta" aria-label="Mi cuenta" onClick={() => irA('acceso')}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </button>
        <img src="/logo-academia-aldea.png" alt="Academia Aldea" className="home-logo" />
        <h1>Aprende a tu ritmo, con soporte cercano</h1>
        <p className="home-subtitulo">
          Cursos online y tickets para resolver cada una de tus dudas.
        </p>
        <div className="home-acciones">
          <button type="button" className="btn btn-primary" onClick={() => setVerTickets(true)}>
            Abrir un ticket
          </button>
          <button type="button" className="btn btn-secundario" onClick={() => irA('signup')}>
            Crear cuenta
          </button>
        </div>
      </header>

      <section className="home-accesos" aria-label="Qué ofrecemos">
        {ACCESOS.map((item) => (
          <article key={item.titulo} className="tarjeta">
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
          </article>
        ))}
      </section>

      <div className="home-contenido">
        <section id="sobre-el-proyecto" className="bloque">
          <h2>Sobre el proyecto</h2>
          {HISTORIA.map((parrafo) => (
            <p key={parrafo} className="texto">{parrafo}</p>
          ))}
        </section>

        <section id="preguntas" className="bloque">
          <h2>Preguntas frecuentes</h2>
          {PREGUNTAS.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p className="texto">{item.a}</p>
            </details>
          ))}
        </section>
      </div>
    </div>
  )
}