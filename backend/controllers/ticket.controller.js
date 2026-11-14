const Ticket = require('../models/ticket.model');
const Usuario = require('../models/usuario.model');

class ticketController {
    async crearTicket(req, res){
        try {
            const { asunto, descripcion, categoria} = req.body;

            if(!asunto || !descripcion || !categoria) return res.status(400).json({message: "No ha rellenado los datos"});

            const ticket = await new Ticket({
                asunto, descripcion, categoria,
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

    async asignarAgente(req, res) {
        try {
            const {ticketID, agenteID} = req.body;

            if(!ticketID || !agenteID) return res.status(400).json({message: "No ha insertado el id del ticket"});

            const ticket = await Ticket.findById(ticketID)
            const agente = await Usuario.findById(agenteID)

            if(!ticket) return res.status(400).json({message: "El ticket no existe"});
            if(!agente || agente.rol !== 'AGENTE') return res.status(400).json({message: "El agente no existe"});
            
            const result = await ticket.updateOne({
                agente: agente,
            })

            return res.status(200).json({
                message: "Ticket asignado correctamente",
                result
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