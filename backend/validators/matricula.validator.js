const { body, params, query } = require('express-validator');

class matriculaValidator {
    validarCrearMatricula = [
        body('cursoID')
        .notEmpty().withMessage('El ID del curso es obligatorio')
        .isMongoId().withMessage('El ID del curso no es válido'),

    body('usuarioID')
        .notEmpty().withMessage('El ID del usuario es obligatorio')
        .isMongoId().withMessage('El ID del usuario no es válido')
    ];

    validarCambiarEstado = [
        param('id')
            .notEmpty().withMessage('El ID de la matrícula es obligatorio')
            .isMongoId().withMessage('El ID de la matrícula no es válido')
    ];

    validarListarMatriculas = [
        query('cursoID')
            .optional()
            .isMongoId().withMessage('El ID del curso no es válido'),

        query('alumnoID')
            .optional()
            .isMongoId().withMessage('El ID del alumno no es válido'),

        query('activa')
            .optional()
            .isBoolean().withMessage('El campo activa debe ser true o false')
            .toBoolean()
    ];

}

module.exports = new matriculaValidator();