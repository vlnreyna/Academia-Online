const express = require('express');
const ruta = express.Router();

const categoriaController = require('../controllers/categoria.controller');
const categoriaValidator = require('../validators/categoria.validator');
const { verificarToken, permitirRol } = require('../middleware/token.middleware');

ruta.use(verificarToken);

ruta.get('/', categoriaController.listarCategorias)
ruta.get('/:id', categoriaController.listarCategorias);

ruta.post('/crearCategoria', permitirRol(['ADMIN']), categoriaValidator.validarCrear, categoriaController.crearCategoria);
ruta.put('/cambiarEstado/:id', permitirRol(['ADMIN']), categoriaValidator.validarCambiarEstado, categoriaController.cambiarEstadoCategoria);

module.exports = ruta;