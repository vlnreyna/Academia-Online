const mongoose = require('mongoose');

const profesorSchema = new mongoose.Schema({
    nombre: {
        type: String,   
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
        enum: ['ALUMNO', 'PROFESOR']
    },
    fechaRegistro: {
        type: Date,
        required: true
    }
});