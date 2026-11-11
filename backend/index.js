const express = require('express');
const mongoose = require('mongoose');

const rutaUsuarios = require("./routes/usuario.routes")
const app = express();

app.use(express.json());
app.use("/api/usuarios", rutaUsuarios)


app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
});

mongoose.connect('mongodb://localhost:27017/academia-online')
.then(() => console.log("Conexión a la base de datos establecida"))
.catch(() => console.log("La conexión a la base de datos ha fallado"))