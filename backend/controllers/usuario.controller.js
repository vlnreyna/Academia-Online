const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
require('dotenv').config();

const datosPublicos = (usuario) => ({
    id: usuario.id,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    email: usuario.email,
    rol: usuario.rol,
    activo: usuario.activo
});


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

const cargarUsuario = async (req, res) => {
    const usuario = await Usuario.findById(req.usuario.id);
    if(!usuario) {
        res.status(404).json({message: "Usuario no encontrado"});
        return null;
    }
    return usuario
}

class usuarioController {
    async register(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const {nombre, apellidos, email, password} = req.body;

            const usuarioExiste = await Usuario.findOne({email});
            if(usuarioExiste) {
                return res.status(409).json({
                    message: "El email posee una cuenta"
                })
            }

            const passwordEncriptada = await bcrypt.hash(password, 10);
            
            const usuario = {
                nombre: nombre,
                apellidos: apellidos,
                email: email,
                password: passwordEncriptada
            }
            const usuarioNuevo = new Usuario(usuario)
            await usuarioNuevo.save();

            return res.status(201).json({
                message: "Usuario insertado correctamente",
                usuario: datosPublicos(usuarioNuevo)
            })
        } catch (error) {
            console.log("Error al insertar usuario")
            return res.status(500).json({
                message: "Error al insertar usuario",
                error: error.message
            })
        }
    }

    async login (req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const { email, password } = req.body;
            const usuario = await Usuario.findOne({email}).select("+password");
            
            if(!usuario || !(await bcrypt.compare(password, usuario.password))) {
                return res.status(401).json({
                    message: "Credenciales incorrectas"
                })
            }
            
            if(!usuario.activo) {
                return res.status(403).json({
                    message: "Este usuario no está activo"
                })
            }

            const token = jwt.sign({
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol
                },
                process.env.JWT_PASSWORD,
                { expiresIn: "2h"}
            );

            return res.status(200).json({
                message: "Login exitoso",
                token,
                usuario: datosPublicos(usuario)
            })

        } catch(error) {
            console.log("Error al hacer el login", error);
            return res.status(500).json({
                message: "Error al hacer el login"
            });
        }
    }

    async cambiarRol(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const {usuarioID, rol} = req.body;

            if(!usuarioID || !rol) return res.status(400).json({message: "No ha escrito los parametros"})
            if(usuarioID == req.usuario.id) return res.status(400).json({message: "No puedes cambiar tu propio rol"})

            const usuario = await Usuario.findById(usuarioID)
            if(!usuario) return res.status(404).json({message: "No se ha encontrado al usuario"})
            
            usuario.rol = rol;
            await usuario.save();

            return res.status(200).json({
                message: "Rol cambiado correctamente",
                usuario: datosPublicos(usuario)
            })
        } catch (error) {
            console.log("Error al cambiar de rol");
            return res.status(500).json({
                message: "Error al cambiar de rol",
                error: error.message
            })
        }
    }

    async cambiarEstado(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const usuarioID = req.params.id;

            const usuario = await Usuario.findById(usuarioID);
            if(!usuario) return res.status(404).json({message: "Usuario no encontrado"});
            
            usuario.activo = !usuario.activo;
            await usuario.save();

            return res.status(200).json({
                message: "Estado del usuario cambiado correctamente",
                usuario: datosPublicos(usuario)
            })
        } catch(error) {
            console.log("Error al cambiar estado del usuario");
            return res.status(500).json({
                message: "Error al cambiar estado del usuario",
                error: error.message
            })
        }
    }
    

    async obtenerPerfil(req, res) {
        try {
            if(comprobarErrores(req, res)) return;
            
            const usuario = await cargarUsuario(req, res);

            return res.status(200).json({
                message: "Datos de usuario obtenidos",
                usuario: datosPublicos(usuario)
            })
        } catch(error) {
            console.log("Error al extraer datos del usuario")
            return res.status(500).json({
                message: "Error al extraer datos del usuario",
                error: error.message
            })
        }
    }

    

    async editarPerfil(req, res) {
    try {
        if(comprobarErrores(req, res)) return;

        const usuario = await cargarUsuario(req, res);

        const { nombre, apellidos, email } = req.body;

        const datosActualizar = {};

        if(nombre !== undefined) datosActualizar.nombre = nombre;
        if(apellidos !== undefined) datosActualizar.apellidos = apellidos;
        if(email !== undefined) datosActualizar.email = email;

        const result = await usuario.updateOne(
            { $set: datosActualizar }
        );

        return res.status(200).json({
            message: "Datos de usuario cambiados correctamente",
            usuario: datosPublicos(result)
        });

    } catch(error) {
        console.log("Error al cambiar los datos de usuario");
        return res.status(500).json({
            message: "Error al cambiar los datos de usuario",
            error: error.message
        });
    }
}

    async cambiarPassword(req, res) {
        try {
            if(comprobarErrores(req, res)) return;

            const usuario = await Usuario.findById(req.usuario.id).select("+password");

            const {passwordActual, passwordNueva} = req.body;
            
            const correcto = await bcrypt.compare(passwordActual, usuario.password);
            
            if(!correcto) return res.status(400).json({message: "La contraseña no es correcta"});
            if(passwordActual == passwordNueva) return res.status(400).json({message: "La contraseña nueva no puede ser igual que la anterior"});

            usuario.password = await bcrypt.hash(passwordNueva, 10);
            const result = await usuario.save();

            return res.status(200).json({
                message: "Contraseña cambiada correctamente",
                usuario: datosPublicos(result)
            })
        } catch(error){
            console.log("Error al cambiar la contraseña");
            return res.status(500).json({
                message: "Error al cambiar la contraseña",
                error: error.message
            })
        }
    }

    async listarAlumnos(req,res) {
        try {
            if(comprobarErrores(req, res)) return;

            const alumnos = await Usuario.find({rol: "ALUMNO"});
            return res.status(200).json({
                message: "Todos los alumnos",
                alumnos
            })
        } catch(error) {
            console.log("Error al mostrar alumnos");
            return res.status(500).json({
                message : "Error al mostrar alumnos",
                error: error.message
            })
        }
    }

    async listarAgentes(req,res) {
        try {
            if(comprobarErrores(req, res)) return;

            const agentes = await Usuario.find({rol: "AGENTE"});
            return res.status(200).json({
                message: "Todos los agentes",
                agentes
            })
        } catch(error) {
            console.log("Error al mostrar agentes");
            return res.status(500).json({
                message : "Error al mostrar agentes",
                error: error.message
            })
        }
    }
}

module.exports = new usuarioController();