const Matricula = require('../models/matricula.model')
const Usuario = require('../models/usuario.model')
const Curso = require('../models/curso.model')
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

const cargarMatricula = async (req, res) => {
    const matricula = await Matricula.findById(req.params.id);
    if(!matricula) {
        res.status(404).json({message: "Matricula no encontrada"});
        return null;
    }
    return matricula
}

class matriculaController {
    async crearMatricula(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const {cursoID, usuarioID} = req.body

            const curso = await Curso.findById(cursoID)
            if(!curso) {
                return res.status(404).json({
                    message: "Coche no encontrado"
                })
            }

            const alumno = await Usuario.findById(usuarioID)
            if(!alumno) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                })
            }

            const matriculaNueva = new Matricula({
                usuario: usuarioID,
                curso: cursoID,
            })

            const result = await matriculaNueva.save()

            return res.status(201).json({
                message: "Matricula nueva registrada correctamente",
                result
            })

        } catch (error) {
            console.log("Error al registrar matricula")
            return res.status(500).json({
                message: "Error al registrar matricula"
            })
        }
    }

    async cambiarEstado(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const matricula = await cargarMatricula(req, res);
            if(!matricula) return
            
            matricula.activa = !matricula.activa;
            await matricula.save();

            return res.status(200).json({
                message: "Estado de matricula cambiada",
                matricula
            })
        } catch(error) {
            console.log("Error al cambiar estado del curso");
            return res.status(500).json({
                message: "Error al cambiar estado del curso",
                error: error.message
            })
        }
    }

    async misMatriculas (req, res) {
        try {
            const usuario = req.usuario.id;
            const result = await Matricula.find({usuario: usuario})
            .populate('curso', 'nombre descripcion nivel duracionHoras precio activo');

            return res.status(200).json({
                message: "Mis matriculas",
                result
            })
        } catch(error) {
            console.log("Error al obtener matriculas");
            return res.status(500).json({
                message: "Error al obtener matriculas",
                error: error.message
            })
        }
    }

    async listarMatriculas(req, res) {
        try{
            const {cursoID, alumnoID, estado} = req.query;

            const filtro = {};

            if(alumnoID) filtro.usuario = alumnoID
            if(cursoID) filtro.curso = cursoID;
            if(estado) filtro.estado = estado;

            const result = await Matricula.find(filtro)
            .populate('curso', 'nombre nivel precio')
            .populate('usuario', 'nombre apellidos email');

            return res.status(200).json({
                message: "Matriculas",
                result
            })
        } catch (error) {
            console.log("Error al listar matriculas");
            return res.status(500).json({
                message: "Error al listar matriculas",
                error: error.message
            })
        }
    }
}

module.exports = new matriculaController();