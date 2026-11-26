const Curso = require('../models/curso.model');
const {validationResult} = require('express-validator');

const comprobarErrores = (req, res) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        res.status(400).json({
            message: "Error de validacion",
            errores: errores.array()
        });
        return true;
    }

    return false;
}

const cargarCurso = async (req, res) => {
    const curso = await Curso.findById(req.params.id);
    if(!curso) {
        res.status(404).json({message: "Curso no encontrado"});
        return null;
    }
    return curso
}

class cursoController {
    async mostrarCursos(req, res) {

        const filtro = {}
        const cursoID = req.params.id;

        if(cursoID) filtro.cursoID = cursoID

        const result = await Curso.find(filtro)

        return res.status(200).json({
            message: "Cursos",
            result
        })
    }

    async insertarCurso(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

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

    async cambiarEstado(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const curso = await cargarCurso(req, res);
            if(!curso) return
            
            curso.activo = !curso.activo;
            await curso.save();

            return res.status(200).json({
                message: "Estado del curso cambiado correctamente",
                curso
            })
        } catch(error) {
            console.log("Error al cambiar estado del curso");
            return res.status(500).json({
                message: "Error al cambiar estado del curso",
                error: error.message
            })
        }
    }

    async actualizarCurso (req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const curso = await cargarCurso(req, res);
            if(!curso) return;

            const result = await curso.updateOne({
                $set: req.body
            });

            return res.status(200).json({
                message: "Datos del curso actualizados correctamente",
                result
            })
        } catch(error) {
            console.log("Error al actualizar el curso");
            return res.status(500).json({
                message: "Error al actualizar el curso",
                error: error.message
            })
        }
    }
}

module.exports = new cursoController();