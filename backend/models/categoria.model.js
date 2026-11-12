const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    descripcion: {
        type: String,
        trim: true
    },
    activa: {
        type: Boolean,
        default: true
    }
}, 
{ 
    timestamps: true,
    versionKey: false
});

const Categoria = mongoose.model('Categoria', categoriaSchema);
module.exports = Categoria;