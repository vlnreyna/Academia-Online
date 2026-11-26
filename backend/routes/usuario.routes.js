const express = require('express');
const ruta = express.Router();

const { verificarToken, permitirRol } = require('../middleware/token.middleware');
const usuarioController = require('../controllers/usuario.controller');
const usuarioValidator = require('../validators/usuario.validator');

ruta.post('/register', usuarioValidator.validarRegistro, usuarioController.register);
ruta.post('/login', usuarioValidator.validarLogin, usuarioController.login);

ruta.use(verificarToken)

ruta.put('/editarPerfil', usuarioValidator.validarEditarPerfil, usuarioController.editarPerfil);
ruta.put('/cambiarContrasenia', usuarioValidator.validarCambiarPassword, usuarioController.cambiarPassword);
ruta.get('/perfil', usuarioController.obtenerPerfil);

ruta.put('/cambiarRol', permitirRol(['ADMIN']), usuarioValidator.validarCambiarRol, usuarioController.cambiarRol);
ruta.put('/desactivarUsuario/:id', permitirRol(['ADMIN']), usuarioValidator.validarCambiarEstado, usuarioController.desactivarUsuario);
ruta.put('/activarUsuario/:id', permitirRol(['ADMIN']), usuarioValidator.validarCambiarEstado, usuarioController.activarUsuario);
ruta.get('/listarAlumnos', permitirRol(['ADMIN']), usuarioController.listarAlumnos);
ruta.get('/listarAgentes', permitirRol(['ADMIN']), usuarioController.listarAgentes);