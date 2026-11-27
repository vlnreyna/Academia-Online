const express = require('express')
const ruta = express.Router();

const {verificarToken, permitirRol, verificarTokenOpcional} = require ('../middleware/token.middleware')
const cursoController = require ('../controllers/curso.controller')
const cursoValidator = require('../validators/curso.validator')

ruta.get('/', verificarTokenOpcional, cursoValidator.validarListarCursos, cursoController.mostrarCursos)
ruta.get('/:id', verificarTokenOpcional, cursoValidator.validarId, cursoController.obtenerCurso)

ruta.use(verificarToken)

ruta.post('/insertarCurso', verificarToken, permitirRol(['ADMIN']), cursoValidator.validarCrearCurso, cursoController.insertarCurso)

ruta.put('/actualizarCurso/:id', verificarToken, permitirRol(['ADMIN']), cursoValidator.validarActualizarCurso, cursoController.actualizarCurso)
ruta.put('/cambiarEstado/:id', verificarToken, permitirRol(['ADMIN']), cursoValidator.validarId, cursoController.cambiarEstado)


module.exports = ruta;