const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
require('dotenv').config();

class usuarioController {
    async register(req, res) {
        try {
            const errores = validationResult(req);

            if(!errores.isEmpty()) {
                return res.status(400).json({
                    message: "Error de validacion", 
                    errores: errores.array()
                });
            }

            const {nombre, apellidos, email, password} = req.body;

            if(!nombre || !apellidos || !email || !password) {
                return res.status(400).json({
                    message: "Debe rellenar todos los datos"
                })
            }

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
            const result = await usuarioNuevo.save();

            return res.status(201).json({
                message: "Usuario insertado correctamente",
                result
            })
        } catch (error) {
            console.log("Error al insertar usuario")
            return res.status(500).json({
                message: "Error al insertar usuario"
            })
        }
    }

    async login (req, res) {
        try {
            const errores = validationResult(req);

            if(!errores.isEmpty()) {
                return res.status(400).json({
                    message: "Error de validacion", 
                    errores: errores.array()
                });
            }

            const { email, password } = req.body;
            const usuario = await Usuario.findOne({email}).select("+password");
            
            if(!usuario || !(await bcrypt.compare(password, usuario.password))) {
                return res.status(401).json({
                    message: "Credenciales incorrectas"
                })
            }
            
            if(!usuario.activo) {
                return res.status(400).json({
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
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellidos: usuario.apellidos,
                    rol: usuario.rol
                }
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
            const errores = validationResult(req)

            if(!errores.isEmpty()) return res.status(400).json({
                message: "Error de validacion",
                error: errores.array()
            })

            const {usuarioID, rol} = req.body;

            if(!usuarioID || !rol) return res.status(400).json({message: "No ha escrito los parametros"})
            if(usuarioID === req.usuario.id) return res.status(400).json({message: "No puedes cambiar tu propio rol"})

            const usuario = await Usuario.findById(usuarioID)
            
            if(!usuario) return res.status(404).json({message: "No se ha encontrado al usuario"})
            
            const result = await usuario.updateOne({
                rol: rol
            })

            return res.status(200).json({
                message: "Rol cambiado correctamente",
                result
            })
        } catch (error) {
            console.log("Error al cambiar de rol");
            return res.status(500).json({
                message: "Error al cambiar de rol",
                error: error.message
            })
        }
    }

    async desactivarUsuario(req, res) {
        try {
            const {usuarioID} = req.body;

            if(!usuarioID) return res.status(400).json({message: "No ha escrito el ID del usuario"})
            
            const usuario = await Usuario.findById(usuarioID)
            const result = await usuario.updateOne({
                activo: false
            })

            return res.status(200).json({
                message: "Usuario desactivado correctamente",
                result
            })
        } catch (error) {
            console.log("Error al desactivar usuario");
            return res.status(500).json({message: "Error al desactivar usuario"})
        }
    }
}

module.exports = new usuarioController();