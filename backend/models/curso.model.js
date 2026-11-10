const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    nivel: {
        type: String,
        required: true,
        trim: true,
        enum: ['BASICO', 'INTERMEDIO', 'AVANZADO']
    },
    duracionHoras: {
        type: Number,
        required: true
    },
    activo: {
        type: Boolean,
        required: true
    },
    fechaCreacion: {
        type: Date,
        required: true
    },
    profesor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profesor',
        required: true
    }
});
