const express = require('express')
const ruta = express.Router();

const cursoController = require ('../controllers/curso.controller')

ruta.get("/mostrarCursos", cursoController.mostrarCursos)
ruta.post("/insertarCurso", cursoController.insertarCurso)

module.exports = ruta;