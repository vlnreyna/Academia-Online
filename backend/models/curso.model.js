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