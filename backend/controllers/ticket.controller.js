const { validationResult } = require('express-validator');
const Ticket = require('../models/ticket.model');
const Usuario = require('../models/usuario.model');
const Categoria = require('../models/categoria.model');
const Respuesta = require('../models/respuesta.model');

const TRANSICIONES = {
    AGENTE: {
        ABIERTO: ['EN_CURSO'],
        EN_CURSO: ['PENDIENTE_CLIENTE', 'RESUELTO'],
        PENDIENTE_CLIENTE: ['EN_CURSO'],
        RESUELTO: ['EN_CURSO']
    },
    ALUMNO: {
        RESUELTO: ['CERRADO', 'EN_CURSO']
    }
};

const POPULATE = [
    { path: 'cliente', select: 'nombre apellidos email' },
    { path: 'agente', select: 'nombre apellidos email' },
    { path: 'categoria', select: 'nombre' }
];


const comprobarErrores = (req, res) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        res.status(400).json({
            message: "Error de validacion",
            error: errores.array()
        });
        return true;
    }

    return false;
}

const tieneAcceso = (ticket, usuario) => {
    if(usuario.rol === 'ADMIN') return true;
    if(usuario.rol === 'ALUMNO') return ticket.cliente.toString() === usuario.id;
    if(usuario.rol === 'AGENTE') return !!ticket.agente && ticket.agente.toString() === usuario.id;
    return false;
}

const cargarTicket = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket) {
        res.status(404).json({message: "Ticket no encontrado"});
        return null;
    }
    if(!tieneAcceso(ticket, req.usuario)) {
        res.status(403).json({message: "No tiene acceso a este ticket"});
        return null;
    }
    return ticket
}

const registrarEstado = (ticket, nuevoEstado, usuarioID) => {
    ticket.historialEstados.push({ de: ticket.estado, a: nuevoEstado, por: usuarioID });
    ticket.estado = nuevoEstado;
};

class ticketController {
    async crearTicket(req, res){
        try {

            if(comprobarErrores(req, res)) return;

            const { asunto, descripcion, categoria, prioridad} = req.body;
            
            const ticket = await new Ticket({
                asunto, descripcion, categoria, prioridad,
                cliente: req.usuario.id,
                historialEstados: [{ de: 'ABIERTO', a: 'ABIERTO', por: req.usuario.id }]
            }).save()

            return res.status(201).json({
                message: "Ticket creado correctamente",
                ticket
            })
        } catch(error) {
            console.log("Error al crear el ticket");
            return res.status(500).json({
                message: "Error al crear el ticket",
                error: error.message
            })
        }
    } 

    async listarTickets(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const {estado, prioridad, categoria, cliente, agente} = req.query;
            
            const filtros = {};
            if(estado) filtros.estado = estado;
            if(prioridad) filtros.prioridad = prioridad;
            if(categoria) filtros.categoria = categoria;

            if(req.usuario.rol === 'ALUMNO') {
                filtros.cliente = req.usuario.id;
            } else if (req.usuario.rol === 'AGENTE') {
                filtros.agente = req.usuario.id;
            } else {
                if(cliente) filtros.cliente = cliente;
                if(agente) filtros.agente = agente;
            }

            const result = await Ticket.find(filtros)
            .populate(POPULATE);
            
            return res.status(200).json({
                message: "Listado de tickets",
                result
            });
        } catch(error) {
            console.log("Error al listar tickets");
            return res.status(500).json({
                message: "Error al listar tickets",
                error: error.message
            })
        }
    }

    async obtenerTicket(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const ticket = await cargarTicket(req, res);
            if(!ticket) return;

            await ticket.populate(POPULATE);
            await ticket.populate({ path: 'historialEstados.por', select: 'nombre apellidos rol' });
            
            const respuestas = await Respuesta.find({ticket: ticket._id})
            .populate('autor', 'nombre apellidos rol');

            return res.status(200).json({
                message: "Ticket obtenido",
                ticket,
                respuestas
            });
        } catch (error) {
            console.log("Error al obtener ticket");
            return res.status(500).json({
                message: "Error al obtener ticket",
                error: error.message
            })
        }
    }

    async responderTicket(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const ticket = await cargarTicket(req, res);
            if(!ticket) return;

            if(ticket.estado === 'CERRADO') {
                return res.status(400).json({message: "No se puede responder a un ticket cerrado"});
            }
            
            const respuesta = await new Respuesta({
                ticket: ticket._id,
                autor: req.usuario.id,
                contenido: req.body.contenido
            }).save();

            let cambio = false;
            if(req.usuario.rol === 'AGENTE' && ticket.estado === 'ABIERTO'){
                registrarEstado(ticket, 'EN_CURSO', req.usuario.id);
                cambio = true
            } else if(req.usuario.rol === 'ALUMNO' && ticket.estado === 'PENDIENTE_CLIENTE') {
                registrarEstado(ticket, 'EN_CURSO', req.usuario.id);
                cambio = true;
            }

            if(cambio) await ticket.save();

            return res.status(201).json({
                message: "Respuesta enviada",
                respuesta
            });
        } catch (error) {
            console.log("Error al enviar respuesta");
            return res.status(500).json({
                message: "Error al enviar respuesta",
                error: error.message
            });
        }
    }

    async cambiarEstado(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const ticket = await cargarTicket(req, res);
            if(!ticket) return

            const {estado} = req.body;

            if(estado === ticket.estado) {
                return res.status(400).json({message: "El ticke ya posee este estado"});
            }

            const transicionesRol = TRANSICIONES[req.usuario.rol];
            if(!transicionesRol || !transicionesRol[ticket.estado]) {
                return res.status(403).json({
                    message: `No puedes cambiar el estado del ticket ${ticket.estado}`
                });
            }
            
            const permitidos = transicionesRol[ticket.estado];

            if(!permitidos.includes(estado)) {
                return res.status(403).json({
                    message: `No puedes pasar el ticket de ${ticket.estado} a ${estado}`
                })
            }

            registrarEstado(ticket, estado, req.usuario.id);
            await ticket.save();

            return res.status(200).json({
                message: "Estado actualizado correectamente"
            });
        } catch(error) {
            console.log("Error al cambiar de estado");
            return res.status(500).json({
                message: "Error al cambiar de estado",
                error: error.message
            })
        }
    }

    async cambiarPrioridad(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const ticket = await cargarTicket(req, res);
            if(!ticket) return;

            ticket.prioridad = req.body.prioridad;
            await ticket.save();

            return res.status(200).json({
                message: "Prioridad actualizada correctamente"
            })
        } catch(error) {
            console.log("Error al cambiar la prioridad");
            return res.status(500).json({
                message: "Error al cambiar la prioridad",
                error: error.message
            })
        }
    }

    async asignarAgente(req, res) {
        try {
            if (comprobarErrores(req, res)) return;

            const { ticketID, agenteID } = req.body;

            const ticket = await Ticket.findById(ticketID)
            if(!ticket) return res.status(404).json({message: "El ticket no existe"});
            
            if(ticket.estado === 'CERRADO') {
                return res.status(400).json({message: "No se puede asignar a un ticket cerrado"});
            }

            const agente = await Usuario.findById(agenteID)
            if(!agente || agente.rol !== 'AGENTE' || !agente.activo) {
                return res.status(400).json({message: "El agente no existe o no esta activo"});
            }
            
            ticket.agente = agente._id
            await ticket.save();

            return res.status(200).json({
                message: "Ticket asignado correctamente",
                ticket
            })
        } catch (error) {
            console.log("Error al asignar agente");
            return res.status(500).json({
                message: "Error al asignar agente",
                error: error.message
            })
        }
    }
}

module.exports = new ticketController();