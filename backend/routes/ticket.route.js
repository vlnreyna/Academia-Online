const express = require('express');
const ruta = express.Router();

const ticketController = require('../controllers/ticket.controller');
const ticketValidator = require('../validators/ticket.validator');
const { verificarToken, permitirRol } = require('../middleware/token.middleware');

ruta.get('/', ticketValidator.validarListado, ticketController.listarTickets);
ruta.get('/:id', ticketValidator.validarId, ticketController.obtenerTicket);

ruta.use(verificarToken);

ruta.post('/crearTicket', permitirRol(['ALUMNO', 'ADMIN']), ticketValidator.validarCrear, ticketController.crearTicket);

ruta.put('/asignar', permitirRol(['ADMIN']), ticketValidator.validarAsignar, ticketController.asignarAgente);

ruta.post('/:id/respuestas', ticketValidator.validarResponder, ticketController.responderTicket);
ruta.put('/:id/estado', ticketValidator.validarCambiarEstado, ticketController.cambiarEstado);
ruta.put('/:id/prioridad', permitirRol(['AGENTE', 'ADMIN']), ticketValidator.validarCambiarPrioridad, ticketController.cambiarPrioridad);

module.exports = ruta;