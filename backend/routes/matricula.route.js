const express = require('express')
const ruta = express.Router();

const matriculaController = require ('../controllers/matricula.controller')

ruta.post('/registrar', matriculaController.registro)

module.exports = ruta;