const express = require('express')
const ruta = express.Router();

const cursoController = require ('../controllers/curso.controller')
const cursoValidator = require('../validators/curso.validator')
const tokenValidator = require('../middleware/token.middleware')
const {verificarToken, permitirRol} = require ('../middleware/token.middleware')

ruta.post('/insertarCurso', verificarToken, permitirRol(['ADMIN']), cursoValidator.validarCurso, cursoController.insertarCurso)

ruta.put('/actualizarCurso', tokenValidator.verificarToken, tokenValidator.permitirRol(['ADMIN']), cursoValidator.validarCurso, cursoController.actualizarCurso)
ruta.put('/desactivarCurso', tokenValidator.verificarToken, tokenValidator.permitirRol(['ADMIN']), cursoController.desactivarCurso)
ruta.put('/activarCurso', tokenValidator.verificarToken, tokenValidator.permitirRol(['ADMIN']), cursoController.activarCurso)

ruta.get('/mostrarCursos', cursoController.mostrarCursos)
ruta.get('/obtenerCurso', cursoController.obtenerCurso)

module.exports = ruta;