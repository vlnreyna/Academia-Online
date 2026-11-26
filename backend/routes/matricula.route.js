const express = require('express')
const ruta = express.Router();

const {verificarToken, permitirRol} = require ('../middleware/token.middleware')
const matriculaController = require ('../controllers/matricula.controller');
const matriculaValidator = require ('../validators/matricula.validator');

ruta.use(verificarToken)

ruta.get('/', permitirRol(['ADMIN']), matriculaValidator.validarListarMatriculas, matriculaController.listarMatriculas);
ruta.get('/misMatriculas', matriculaController.misMatriculas);

ruta.post('/crearMatricula', permitirRol(['ALUMNO', 'ADMIN']), matriculaValidator.validarCrearMatricula, matriculaController.crearMatricula);

ruta.put('/cambiarEstado/:id', permitirRol(['ADMIN']), matriculaValidator.validarCambiarEstado, matriculaController.cambiarEstado);


module.exports = ruta;