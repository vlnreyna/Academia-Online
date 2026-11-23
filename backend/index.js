require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const rutaUsuarios = require("./routes/usuario.routes")
const rutaCursos = require("./routes/curso.route")
const rutaMatriculas = require("./routes/matricula.route")

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use("/api/usuarios", rutaUsuarios)
app.use("/api/cursos", rutaCursos)
app.use("/api/matriculas", rutaMatriculas)

app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo");
});

mongoose.connect(process.env.MONGODB)
.then(() => console.log("Conexión a la base de datos establecida"))
.catch((error) => console.log("La conexión a la base de datos ha fallado", error.message))
