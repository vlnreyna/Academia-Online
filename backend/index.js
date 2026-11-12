const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const rutaUsuarios = require("./routes/usuario.routes")
const rutaCursos = require("./routes/curso.route")
const app = express();

app.use(express.json());
app.use("/api/usuarios", rutaUsuarios)
app.use("/api/curso", rutaCursos)


app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
});

mongoose.connect(process.env.MONGODB)
.then(() => console.log("Conexión a la base de datos establecida"))
.catch(() => console.log("La conexión a la base de datos ha fallado"))