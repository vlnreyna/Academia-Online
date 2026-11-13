const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minLength: 3
    },
    descripcion: {
        type: String,
        required: true,
        minLength: 3
    },
    nivel: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        enum: ['BASICO', 'INTERMEDIO', 'AVANZADO']
    },
    duracionHoras: {
        type: Number,
        required: true,
        min: 2
    },
    precio: {
        type: Number,
        required: true,
        min: 0
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

const Curso = mongoose.model('Curso', cursoSchema);
module.exports = Curso;