const express = require('express')
const ruta = express.Router();

const cursoController = require ('../controllers/curso.controller')
const cursoValidator = require('../validators/curso.validator')
const tokenValidator = require('../middleware/token.middleware')

ruta.get('/mostrarCursos', cursoController.mostrarCursos)
ruta.post('/insertarCurso', cursoValidator.validarInsertarCurso, cursoController.insertarCurso)
ruta.delete('/eliminarCurso', cursoController.eliminarCurso)
ruta.put('/desactivarCurso', tokenValidator.verificarToken, tokenValidator.permitirRol('ADMIN'), cursoController.desactivarCurso)

module.exports = ruta;