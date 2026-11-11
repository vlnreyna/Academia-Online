const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
require('dotenv').config();

const register = async (req, res) => {
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
            return res.status(400).json("Debe rellenar todos los datos")
        }

        const usuarioExiste = await Usuario.findOne({email});

        if(usuarioExiste) {
            return res.status(409).json("El email posee una cuenta")
        }

        const passwordEncriptada = await bcrypt.hash(password, 15);
        
        const usuario = {
            nombre: nombre,
            apellidos: apellidos,
            email: email,
            password: passwordEncriptada
        }
        const usuarioNuevo = new Usuario(usuario)
        const result = await usuarioNuevo.save();

        return res.status(200).json("Usuario insertado correctamente", result)
    } catch (error) {
        console.log("Error al insertar usuario")
        return res.status(500).json("Error al insertar usuario")
    }
}

const login = async (req, res) => {
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

        const token = jwt.sign({
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
            },
            process.env.SECRET_PASSWORD,
            { expiresIn: "2h"}
        );

        return res.status(200).json({
            message: "Login exitoso",
            token,
            usario: {
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

module.exports = {
    register,
    login
}