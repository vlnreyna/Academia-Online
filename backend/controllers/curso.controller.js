const Curso = require('../models/curso.model');
const {validationResult} = require('express-validator')
require('dotenv').config();

const mostrarCursos = async (req, res) => {
    const result = await Curso.find()
    return res.status(200).json({
        message: "Todos los cursos",
        result
    })
}

const insertarCurso = async (req, res) => {
    try {
        const curso = req.body;
        const cursoNuevo = new Curso(curso)
        const result = await cursoNuevo.save();
        return res.status(201).json({
            message: "Curso insertado correctamente",
            result
        })
    } catch (error) {
        console.log("Error al insertar curso")
        return res.status(500).json({
            message: "Error al insertar curso"
        })
    }
    
}

module.exports = {
    mostrarCursos,
    insertarCurso
}