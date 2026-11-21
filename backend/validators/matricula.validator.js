const { body } = require('express-validator');

class matriculaValidator {
    validarMatricula = [
        body('usuarioID')
        .notEmpty()
        .withMessage("Debes insertar un usuario"),

        body('cursoID')
        .notEmpty()
        .withMessage('Debes insertar un curso'),

        body('estado')
        .trim()
        .toUpperCase()
        .notEmpty()
        .withMessage("Debes insertar un estado")
        .isIn(['ACTIVADA', 'CANCELADA'])
        .withMessage('El estado debe ser ACTIVADA o CANCELADA'),

    ];
}

module.exports = new matriculaValidator();