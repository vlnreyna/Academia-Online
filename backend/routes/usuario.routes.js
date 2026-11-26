const express = require('express')
const ruta = express.Router();

const usuarioController = require ('../controllers/usuario.controller')
const usuarioValidator = require("../validators/usuario.validator")
const {verificarToken, permitirRol} = require ('../middleware/token.middleware')

ruta.post('/register', usuarioValidator.validarRegistro, usuarioController.register)
ruta.post('/login', usuarioValidator.validarLogin, usuarioController.login)

ruta.put('/editarPerfil', verificarToken, usuarioValidator.validarEditarPerfil, usuarioController.editarPerfil);
ruta.put('/cambiarRol',verificarToken, permitirRol(['ADMIN']), usuarioValidator.validarCambiarRol, usuarioController.cambiarRol)
ruta.put('/desactivarUsuario', verificarToken, permitirRol(['ADMIN']), usuarioController.desactivarUsuario)
ruta.put('/activarUsuario', verificarToken, permitirRol(['ADMIN']), usuarioController.activarUsuario)
ruta.put('/cambiarContrasenia', verificarToken, usuarioValidator.validarCambiarPassword, usuarioController.cambiarPassword);

ruta.get('/perfil', verificarToken, usuarioController.obtenerPerfil);
ruta.get('/listarAlumnos', verificarToken, permitirRol(['ADMIN']), usuarioController.listarAlumnos);
ruta.get('/listarAgentes', verificarToken, permitirRol(['ADMIN']), usuarioController.listarAgentes);


module.exports = ruta;