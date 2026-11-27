const express = require('express');
const ruta = express.Router();

const ticketController = require('../controllers/ticket.controller');
const ticketValidator = require('../validators/ticket.validator');
const { verificarToken, permitirRol, verificarTokenOpcional } = require('../middleware/token.middleware');


ruta.get('/', verificarTokenOpcional, ticketValidator.validarListado, ticketController.listarTickets);
ruta.get('/:id', verificarTokenOpcional, ticketValidator.validarId, ticketController.obtenerTicket);


ruta.post('/crearTicket', verificarToken, permitirRol(['ALUMNO', 'ADMIN']), ticketValidator.validarCrear, ticketController.crearTicket);

ruta.put('/asignar', verificarToken, permitirRol(['ADMIN']), ticketValidator.validarAsignar, ticketController.asignarAgente);

ruta.post('/:id/respuestas', verificarToken, ticketValidator.validarResponder, ticketController.responderTicket);
ruta.put('/:id/estado',  verificarToken, ticketValidator.validarCambiarEstado, ticketController.cambiarEstado);
ruta.put('/:id/prioridad', verificarToken, permitirRol(['AGENTE', 'ADMIN']), ticketValidator.validarCambiarPrioridad, ticketController.cambiarPrioridad);

module.exports = ruta;