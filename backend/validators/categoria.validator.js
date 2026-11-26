const { body, param } = require('express-validator');

const idCategoria = param('id').isMongoId().withMessage('El id de la categoria no es valido')

class categoriaValidator {
    validarId = [idCategoria];

    validarCrear = [
        body('nombre')
            .trim()
            .notEmpty().withMessage('El nombre es obligatorio')
            .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
        body('descripcion')
            .optional()
            .trim()
            .isLength({ max: 200 }).withMessage('La descripcion no puede superar los 200 caracteres')
    ];
}

module.exports = new categoriaValidator();