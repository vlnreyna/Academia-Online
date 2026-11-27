const Curso = require('../models/curso.model');
const {matchedData} = require('express-validator');
const { comprobarErrores } = require('../middleware/validacion.middleware');

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
        try {
            if(comprobarErrores(req, res)) return;
            
            const {nombre, nivel, activo} = req.query;

            if (nombre) filtro.nombre = nombre;
            if (nivel) filtro.nivel = nivel;

            if (req.usuario.rol === 'ADMIN') {
                if (activo !== undefined) filtro.activo = activo === 'true';
            } else {
                filtro.activo = true;
            }
    
            const result = await Curso.find(filtro)
    
            return res.status(200).json({
                message: "Cursos",
                result
            })
        } catch(error) {
            console.log("Error al listar los cursos");
            return res.status(500).json({
                message: "Error al listar los cursos",
                error: error.message
            })
        }
    }

    async obtenerCurso(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const curso = await Curso.findById(req.params.id);
            if(!curso || (!curso.activo && (req.usuario.rol === 'ADMIN'))) {
                return res.status(404).json({message: "Curso no encontrado"});
            }

            return res.status(200).json({
                message: "Curso",
                result: curso
            })
        } catch(error) {
            console.log("Error al obtener el curso");
            return res.status(500).json({
                message: "Error al obtener el curso",
                error: error.message
            })
        }
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

            const datos = matchedData(req, { locations: ['body'] });
            curso.set(datos);
            const result = await curso.save();

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