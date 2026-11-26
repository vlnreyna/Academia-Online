const express = require('express')
const ruta = express.Router();

const {verificarToken, permitirRol} = require ('../middleware/token.middleware')
const cursoController = require ('../controllers/curso.controller')
const cursoValidator = require('../validators/curso.validator')

ruta.use(verificarToken)

ruta.get('/', cursoController.mostrarCursos)
ruta.get('/:id', cursoController.mostrarCursos)

ruta.post('/insertarCurso', permitirRol(['ADMIN']), cursoValidator.validarCrearCurso, cursoController.insertarCurso)

ruta.put('/actualizarCurso/:id', permitirRol(['ADMIN']), cursoValidator.validarActualizarCurso, cursoController.actualizarCurso)
ruta.put('/cambiarEstado/:id', permitirRol(['ADMIN']), cursoValidator.validarCambiarEstado, cursoController.cambiarEstado)


module.exports = ruta;