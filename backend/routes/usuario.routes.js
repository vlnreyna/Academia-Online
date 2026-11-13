const express = require('express')
const ruta = express.Router();

const usuarioController = require ('../controllers/usuario.controller')
const usuarioValidator = require("../validators/usuario.validator")

ruta.post("/register", usuarioValidator.validarRegistro, usuarioController.register)
ruta.post("/login", usuarioValidator.validarLogin, usuarioController.login)
ruta.put("/cambiarRol", usuarioValidator.validarCambiarRol, usuarioController.cambiarRol)

module.exports = ruta;