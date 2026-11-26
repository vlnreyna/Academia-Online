const express = require('express')
const ruta = express.Router();

const {verificarToken, permitirRol} = require ('../middleware/token.middleware')
const matriculaController = require ('../controllers/matricula.controller');
const matriculaValidator = require ('../validators/matricula.validator');

ruta.post('/registrar', verificarToken, permitirRol(['ADMIN']), matriculaValidator.validarMatricula, matriculaController.registro);
ruta.get('/misMatriculas', verificarToken, matriculaController.misMatriculas);
ruta.get('/listarMatriculas', verificarToken, permitirRol('ADMIN'), matriculaController.listarMatriculas);

ruta.put('/activarMatricula', verificarToken, permitirRol(['ADMIN']), matriculaController.activarMatricula);
ruta.put('/desactivarMatricula', verificarToken, permitirRol(['ADMIN']), matriculaController.desactivarMatricula);


module.exports = ruta;