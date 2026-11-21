const express = require('express');
const ruta = express.Router();

const categoriaController = require('../controllers/categoria.controller');
const categoriaValidator = require('../validators/categoria.validator');
const { verificarToken, permitirRol } = require('../middleware/token.middleware');

ruta.use(verificarToken);

ruta.get('/', categoriaController.listarCategorias);
ruta.post('/', permitirRol(['ADMIN']), categoriaValidator.validarCrear, categoriaController.crearCategoria);
ruta.put('/:id/estado', permitirRol(['ADMIN']), categoriaValidator.validarId, categoriaController.cambiarEstadoCategoria);

module.exports = ruta;