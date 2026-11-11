const mongoose = require('mongoose');
const ESTADOS = ['ABIERTO', 'EN_CURSO', 'PENDIENTE_CLIENTE', 'RESUELTO', 'CERRADO'];

const ticketSchema = new mongoose.Schema({
    asunto: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    categoria: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Categoria', 
        required: true 
    },
    prioridad: {
        type: String,
        required: true,
        enum: ['BAJA', 'MEDIA', 'ALTA'],
        default: 'MEDIA'
    },
    estado: {
        type: String,
        enum: ESTADOS,
        default: 'ABIERTO'
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    agente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    },
    historialEstados: [{
        de: { type: String, enum: ESTADOS },
        a: { type: String, enum: ESTADOS },
        por: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Usuario', 
            required: true 
        },
        fecha: { type: Date, default: Date.now }
    }]
}, 
{
    timestamps: true,
    versionKey: false
});


const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;