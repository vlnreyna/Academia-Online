const Curso = require('../models/curso.model');
const {validationResult} = require('express-validator');

class cursoController {
    async mostrarCursos(req, res) {
        const result = await Curso.find()
        return res.status(200).json({
            message: "Todos los cursos",
            result
        })
    }

    async insertarCurso(req, res) {
        try {
            const errores = validationResult(req);

            if(!errores.isEmpty()) {
                return res.status(400).json({
                    message: "Error de validacion", 
                    errores: errores.array()
                });
            }

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
                message: "Error al insertar curso",
                error: error.message
            })
        }
    }

    async eliminarCurso(req, res) {
        try {
            const {cursoID} = req.body;
            const curso = await Curso.findById(cursoID);

            if(!curso) return res.status(404).json({message: "Curso no encontrado"})
            
            const result = await Curso.deleteOne(curso);
            return res.status(200).json({message: "Curso eliminado correctamente", result})
        } catch(error) {
            console.log("Error al eliminar el curso");
            return res.status(500).json({
                message: "Error al eliminar el curso",
                error: error.message
            });
        }
    }
}

module.exports = new cursoController();