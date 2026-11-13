const express = require('express')
const ruta = express.Router();

const cursoController = require ('../controllers/curso.controller')
const cursoValidator = require('../validators/curso.validator')

ruta.get('/mostrarCursos', cursoController.mostrarCursos)
ruta.post('/insertarCurso', cursoValidator.validarInsertarCurso, cursoController.insertarCurso)
ruta.delete('/eliminarCurso', cursoController.eliminarCurso)

module.exports = ruta;