const express = require('express');
const ruta = express.Router();

const { verificarToken, permitirRol } = require('../middleware/token.middleware');
const categoriaController = require('../controllers/categoria.controller');
const categoriaValidator = require('../validators/categoria.validator');

ruta.use(verificarToken);

ruta.get('/', categoriaController.listarCategorias)
ruta.get('/:id', categoriaValidator.validarId, categoriaController.obtenerCategoria);

ruta.post('/crearCategoria', permitirRol(['ADMIN']), categoriaValidator.validarCrear, categoriaController.crearCategoria);
ruta.put('/cambiarEstado/:id', permitirRol(['ADMIN']), categoriaValidator.validarId, categoriaController.cambiarEstadoCategoria);

module.exports = ruta;