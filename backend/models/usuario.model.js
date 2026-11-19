const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        index: true,
        minlength: 2,
        maxlength: 50
    },
    apellidos: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    rol: {
        type: String,
        required: true,
        trim: true,
        enum: ['ALUMNO', 'AGENTE', 'ADMIN'],
        default: 'ALUMNO'
    },
    activo: {
        type: Boolean,
        required: true,
        default: true
    }
},
{
    timestamps: true,
    versionKey: false
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;