const mongoose = require('mongoose');

const respuestaSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    contenido: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 3000
    }
}, 
{ 
    timestamps: true ,
    versionKey: false
});

const Respuesta = mongoose.model('Respuesta', respuestaSchema);
module.exports = Respuesta;