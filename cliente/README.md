# Academia Aldea · Frontend

Cliente web en React 19 + Vite + React Router. Consume la API REST del directorio `backend/`; no guarda datos de negocio en el navegador (solo el token de sesión y los datos públicos del usuario).

## Puesta en marcha

```bash
cp .env.example .env
npm install
npm run dev
```

`VITE_API_URL` es la URL base de la API, sin barra final (por ejemplo `http://localhost:3000/api` en local o la URL pública del backend desplegado).

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Compila a `dist/` para desplegar |
| `npm run preview` | Sirve la build localmente |
| `npm run lint` | ESLint |

Al desplegar como sitio estático hay que redirigir todas las rutas a `index.html` (es una SPA con rutas como `/tickets/:id`).

## Estructura

```
src/
  api.js               peticiones a la API con el token y errores unificados
  Config.js            constantes (estados, roles, transiciones) y formateadores
  Sesion/              contexto de sesión y rutas protegidas por rol
  componentes/         Navbar, pie, listado de tickets, insignias, métricas, usePeticion
  Home/                inicio público, «Sobre el proyecto» y ayuda/FAQ
  Acceso/              iniciar sesión y crear cuenta
  Cursos/              catálogo con buscador, ficha y formulario (CRUD del admin)
  Perfil/              datos personales, contraseña, mis cursos y mis tickets
  Tickets/             listado filtrable, abrir ticket y detalle con historial
  Agente/              panel de soporte del agente
  Admin/               resumen con métricas, usuarios y roles, categorías y matrículas
```

## Rutas

| Ruta | Acceso |
| --- | --- |
| `/`, `/acceso`, `/cursos`, `/cursos/:id` | Público (la API pide sesión para leer cursos) |
| `/perfil`, `/tickets`, `/tickets/:id` | Cualquier usuario con sesión |
| `/tickets/nuevo` | Alumno y administrador |
| `/soporte` | Agente |
| `/admin`, `/cursos/nuevo`, `/cursos/:id/editar` | Administrador |

Ocultar rutas en el frontend es solo comodidad: los permisos y la propiedad de los tickets los valida el backend.
