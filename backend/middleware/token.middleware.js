const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario.model')

const verificarToken = async (req, res, next) => {
    const cabecera = req.headers.authorization;

    if(!cabecera || !cabecera.startsWith('Bearer ')) return res.status(401).json({message: "Token no proporcionado"})

    const token = cabecera.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_PASSWORD);

        const usuario = await Usuario.findById(payload.id);

        if(!usuario) return res.status(401).json({message: "El usuario no existe"})
        if(!usuario.activo) return res.status(403).json({message: "Usuario desactivado"})

        req.usuario = {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        };
        next();
    } catch( error) {
        console.log("Token invalido");
        return res.status(401).json({
            message: "Token invalido",
            error: error.message
        })
    }
}

const permitirRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if(!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({message: "No tienes los permisos necesarios para realizar esta accion"})
        }
        next();
    }
}

module.exports = {
    verificarToken,
    permitirRol
}