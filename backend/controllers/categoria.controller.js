const { comprobarErrores } = require('../middleware/validacion.middleware');
const Categoria = require('../models/categoria.model');

class categoriaController {
    async listarCategorias(req, res) {
        try {
            const filtro = {};

            if(req.usuario.rol !== 'ADMIN') {
                filtro.activa = true
            }

            const result = await Categoria.find(filtro);

            return res.status(200).json({
                message: "Categorias",
                result
            })
        } catch(error) {
            console.log("Error al listar las categorias");
            return res.status(500).json({
                message: "Error al listar las categorias",
                error: error.message
            })
        }
    }

    async obtenerCategoria(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const categoria = await Categoria.findById(req.params.id);
            if(!categoria || (!categoria.activa && req.usuario.rol !== 'ADMIN')) {
                return res.status(404).json({message: "Categoria no encontrada"});
            }

            return res.status(200).json({
                message: "Categoria",
                result: categoria
            })
        } catch(error) {
            console.log("Error al obtener la categoria");
            return res.status(500).json({
                message: "Error al obtener la categoria",
                error: error.message
            })
        }
    }

    async crearCategoria(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const {nombre, descripcion} = req.body;
            const result = await new Categoria({
                nombre, descripcion
            }).save();

            return res.status(201).json({
                message: "Categoria creada correctamente",
                result
            })
        } catch(error) {
            if(error.code === 11000) {
                return res.status(409).json({
                    message: "Ya existe una categoria con este nombre"
                })
            }
            console.log("Error al crear categoria");
            return res.status(500).json({
                message: "Error al crear categoria",
                error: error.message
            })
        }
    }

    async cambiarEstadoCategoria(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const categoria = await Categoria.findById(req.params.id);
            if(!categoria) return res.status(404).json({message: "Categoria no encontrada"});
            
            categoria.activa = !categoria.activa;
            await categoria.save();

            return res.status(200).json({
                message: "Estado de categoria cambiada correctamente",
                categoria
            })
        } catch(error) {
            console.log("Error al cambiar estado de la categoria");
            return res.status(500).json({
                message: "Error al cambiar estado de la categoria",
                error: error.message
            })
        }
    }
}

module.exports = new categoriaController();