const Matricula = require('../models/matricula.model')
const Usuario = require('../models/usuario.model')
const Curso = require('../models/curso.model')
const {validationResult} = require('express-validator');


class matriculaController {
    async registro(req, res) {
        try {

            const errores = validationResult(req);
            if(!errores.isEmpty()) {
                return res.status(400).json({
                    message: "Error de validacion",
                    error: errores.array()
                })
            }
            
            const {cursoID, usuarioID, estado} = req.body;

            const usuario = await Usuario.findById(usuarioID)
            
            if(!usuario) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                })
            }

            const curso = await Curso.findById(cursoID)

            if(!curso) {
                return res.status(404).json({
                    message: "Coche no encontrado"
                })
            }

            const matriculaNueva = new Matricula({
                usuario: {
                    _id: usuario._id
                },
                curso: {
                    _id: curso._id
                }
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

    async desactivarMatricula(req, res) {
        try {
            const {matriculaID} = req.body;

            const matricula = await Matricula.findById(matriculaID);

            if(!matricula) return res.status(400).json({message: "Matricula no encontrada"});

            const result = await matricula.updateOne({
                estado: 'CANCELADA'
            })

            return res.status(200).json({
                message: "Matricula cancelada con exito"
            })
        } catch(error){
            console.log("Error al cancelar la matricula")
            return res.status(500).json({
                message: "Error al cancelar la matricula",
                error: error.message
            })
        }
    }
    
    async activarMatricula(req, res) {
        try {
            const {matriculaID} = req.body;

            const matricula = await Matricula.findById(matriculaID);

            if(!matricula) return res.status(404).json({message: "Matricula no encontrada"});

            const result = await matricula.updateOne({
                estado: 'ACTIVADA'
            })

            return res.status(200).json({
                message: "Matricula activada con exito"
            })
        } catch(error){
            console.log("Error al activar la matricula")
            return res.status(500).json({
                message: "Error al activar la matricula",
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
                message: "Matriculas matriculadas",
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

            if(req.usuario.rol === 'ALUMNO') {
                filtro.usuario = req.usuario.id;
            } else if (alumnoID) {
                filtro.usuario = alumnoID;
            }

            if(cursoID) filtro.curso = cursoID;
            if(estado) filtro.estado = estado.toUpperCase();

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