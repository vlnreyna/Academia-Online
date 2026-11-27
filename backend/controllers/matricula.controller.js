const Matricula = require('../models/matricula.model')
const Usuario = require('../models/usuario.model')
const Curso = require('../models/curso.model')
const { comprobarErrores } = require('../middleware/validacion.middleware');

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
        if (comprobarErrores(req, res)) return;
        const { cursoID } = req.body;
        const usuarioID = req.usuario.rol === 'ADMIN' && req.body.usuarioID
            ? req.body.usuarioID
            : req.usuario.id;

        const curso = await Curso.findById(cursoID);
        if (!curso || !curso.activo) return res.status(404).json({ message: "Curso no encontrado" });

        const usuario = await Usuario.findById(usuarioID);
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
        if (usuario.rol !== 'ALUMNO') return res.status(400).json({ message: "Solo se pueden matricular alumnos" });

        const result = await new Matricula({ 
            usuario: usuarioID, 
            curso: cursoID 
        }).save();

        return res.status(201).json({ 
            message: "Matrícula registrada", 
            result 
        });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ 
            message: "Ya está matriculado en este curso" 
        });
        return res.status(500).json({ 
            message: "Error al registrar matrícula" 
        });
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
            const {cursoID, alumnoID, activa} = req.query;

            const filtro = {};

            if(alumnoID) filtro.usuario = alumnoID;
            if(cursoID) filtro.curso = cursoID;
            if(activa !== undefined) filtro.activa = activa;

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