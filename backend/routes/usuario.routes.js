const express = require('express')
const ruta = express.Router();

const usuarioController = require ('../controllers/usuario.controller')
const usuarioValidator = require("../validators/usuario.validator")
const {verificarToken, permitirRol} = require ('../middleware/token.middleware')

ruta.post("/register", usuarioValidator.validarRegistro, usuarioController.register)
ruta.post("/login", usuarioValidator.validarLogin, usuarioController.login)
ruta.put("/cambiarRol",verificarToken, permitirRol(['ADMIN']), usuarioValidator.validarCambiarRol, usuarioController.cambiarRol)
ruta.put("/cambiarEstadoUsuario", verificarToken, permitirRol(['ADMIN']), usuarioController.desactivarUsuario)

module.exports = ruta;