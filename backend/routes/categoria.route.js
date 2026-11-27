const express = require('express');
const ruta = express.Router();

const { verificarToken, permitirRol, verificarTokenOpcional} = require('../middleware/token.middleware');
const categoriaController = require('../controllers/categoria.controller');
const categoriaValidator = require('../validators/categoria.validator');

ruta.get('/', verificarTokenOpcional, categoriaController.listarCategorias)
ruta.get('/:id', verificarTokenOpcional, categoriaValidator.validarId, categoriaController.obtenerCategoria);

ruta.post('/crearCategoria', verificarToken, permitirRol(['ADMIN']), categoriaValidator.validarCrear, categoriaController.crearCategoria);
ruta.put('/cambiarEstado/:id', verificarToken, permitirRol(['ADMIN']), categoriaValidator.validarId, categoriaController.cambiarEstadoCategoria);

module.exports = ruta;