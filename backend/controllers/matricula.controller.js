const Matricula = require('../models/matricula.model')
const Usuario = require('../models/usuario.model')
const Curso = require('../models/curso.model')


class matriculaController {
    async registro(req, res) {
        try {
            const usuario = await Usuario.findById(req.body.usuarioId)
            
            if(!usuario) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                })
            }

            const curso = await Curso.findById(req.body.cursoId)

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
            console.log("Error al cancelar matricula")
            return res.status(500).json({
                message: "Error al cancelar matricula",
                error: error.message
            })
        }
    }
}

module.exports = new matriculaController();