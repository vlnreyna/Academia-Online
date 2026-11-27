const express = require('express')
const ruta = express.Router();

const {verificarToken, permitirRol} = require ('../middleware/token.middleware')
const cursoController = require ('../controllers/curso.controller')
const cursoValidator = require('../validators/curso.validator')

ruta.get('/', cursoValidator.validarListarCursos, cursoController.mostrarCursos)
ruta.get('/:id', cursoValidator.validarId, cursoController.obtenerCurso)

ruta.use(verificarToken)

ruta.post('/insertarCurso', permitirRol(['ADMIN']), cursoValidator.validarCrearCurso, cursoController.insertarCurso)

ruta.put('/actualizarCurso/:id', permitirRol(['ADMIN']), cursoValidator.validarActualizarCurso, cursoController.actualizarCurso)
ruta.put('/cambiarEstado/:id', permitirRol(['ADMIN']), cursoValidator.validarId, cursoController.cambiarEstado)


module.exports = ruta;