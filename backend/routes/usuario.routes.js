const express = require('express')
const ruta = express.Router();

const usuarioController = require ('../controllers/usuario.controller')
const usuarioValidator = require("../validators/usuario.validator")
const tokenValidator = require ('../middleware/token.middleware')

ruta.post("/register", usuarioValidator.validarRegistro, usuarioController.register)
ruta.post("/login", usuarioValidator.validarLogin, usuarioController.login)
ruta.put("/cambiarRol", tokenValidator.validarToken, tokenValidator.permitirRol(['ADMIN']), usuarioValidator.validarCambiarRol, usuarioController.cambiarRol)
ruta.put("/cambiarEstadoUsuario", tokenValidator.validarToken, tokenValidator.permitirRol(['ADMIN']), usuarioController.desactivarUsuario)

module.exports = ruta;