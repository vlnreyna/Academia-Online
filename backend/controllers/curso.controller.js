const Curso = require('../models/curso.model');
const {validationResult} = require('express-validator');

const comprobarErrores = (req, res) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({
            message: "Error de validacion", 
            errores: errores.array()
        });
    }
}

const cargarCurso = async (req, res) => {
    const curso = await Curso.findById(req.params.id);
    if(!curso) {
        res.status(404).json({message: "Curso no encontrado"});
        return null;
    }
    if(!tieneAcceso(curso, req.usuario)) {
        res.status(401).json({message: "No tiene acceso a este curso"});
        return null;
    }
    return curso
}

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

            const curso = await Curso.findById(req.params.id);
            if(!curso) return res.status(404).json({message: "Curso no encontrado"});
            
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

    async obtenerCurso(req, res) {
        try {
            const {cursoID} = req.body;
            if(!cursoID) return res.status(400).json({message: "No ha introduce el ID del curso"});
            
            const curso = await Curso.findById(cursoID);
            if(!curso) return res.status(400).json({message: "No existe el curso"});

            return res.status(200).json({
                message: "Detalles del curso",
                curso
            })
        } catch(error) {
            console.log("Error al obtener detalles del curso");
            return res.status(500).json({
                message: "Error al obtener detalles del curso",
                error: error.message
            })
        }
    }

    async actualizarCurso (req, res) {
        try {
            const errores = validationResult(req);
            if(!errores.isEmpty()) return res.status(400).json({
                message: "Error de validacion",
                error: errores.array()
            });

            const {cursoID, nombre, descripcion, nivel, duracionHoras, precio} = req.body;
            const curso = await Curso.findById(cursoID);

            if(!curso) return res.status(404).json({message: "El curso no existe"});

            const result = await curso.updateOne({
                id: cursoID,
                nombre: nombre,
                descripcion: descripcion,
                nivel: nivel,
                duracionHoras: duracionHoras,
                precio: precio
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