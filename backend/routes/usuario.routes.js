const express = require('express');
const ruta = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const usuarioValidator = require('../validators/usuario.validator');
const { verificarToken, permitirRol } = require('../middleware/token.middleware');

ruta.use(verificarToken)

ruta.post('/register', usuarioValidator.validarRegistro, usuarioController.register);
ruta.post('/login', usuarioValidator.validarLogin, usuarioController.login);

ruta.put('/editarPerfil', usuarioValidator.validarEditarPerfil, usuarioController.editarPerfil);
ruta.put('/cambiarContrasenia', usuarioValidator.validarCambiarPassword, usuarioController.cambiarPassword);
ruta.get('/perfil', usuarioController.obtenerPerfil);

ruta.put('/cambiarRol', permitirRol(['ADMIN']), usuarioValidator.validarCambiarRol, usuarioController.cambiarRol);
ruta.put('/desactivarUsuario/:id', permitirRol(['ADMIN']), usuarioController.cambiarEstado);
ruta.put('/activarUsuario/:id', permitirRol(['ADMIN']), usuarioController.cambiarEstado);
ruta.get('/listarAlumnos', permitirRol(['ADMIN']), usuarioController.listarAlumnos);
ruta.get('/listarAgentes', permitirRol(['ADMIN']), usuarioController.listarAgentes);

module.exports = ruta;