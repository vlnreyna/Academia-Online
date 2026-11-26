const { validationResult } = require('express-validator');

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

module.exports = {
    comprobarErrores
}
