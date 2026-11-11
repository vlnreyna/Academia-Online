const express = require('express')
const ruta = express.Router();

const usuarioController = require ('../controllers/usuario.controller')
const { validarRegistro } = require("../validators/usuario.validator")
const { validarLogin } = require("../validators/usuario.validator")

ruta.post("/register", validarRegistro, usuarioController.register)
ruta.post("/login", validarLogin, usuarioController.login)

module.exports = ruta;