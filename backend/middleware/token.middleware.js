const jwt = require('jsonwebtoken')

const verificarToken = async (req, res, next) => {
    const cabecera = req.headers.authorization;

    if(!cabecera) return res.status(401).json({message: "Token no proporcionado"})

    const token = cabecera.split(' ')[1];

    try {
        const usuario = jwt.verify(token, process.env.JWT_PASSWORD);
        req.usuario = usuario;
        next();
    } catch( error) {
        console.log("Token invalido");
        return res.status(401).json({message: "Token invalido"})
    }
}

const permitirRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if(!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({message: "No tienes los permisos para cambiar de rol"})
        }
        next();
    }
}

module.exports = {
    verificarToken,
    permitirRol
}