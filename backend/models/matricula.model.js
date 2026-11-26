const mongoose = require('mongoose');

const matriculaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso',
        required: true,
    },
    activa: {
        type: Boolean,
        required: true,
        trim: true,
        default: true
    }
}, 
{
    timestamps: true,
    versionKey: false
});

matriculaSchema.index(
    { usuario: 1, curso: 1 },
    { unique: true }
);

const Matricula = mongoose.model('Matricula', matriculaSchema);
module.exports = Matricula;