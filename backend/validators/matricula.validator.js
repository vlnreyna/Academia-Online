const { body, param, query } = require('express-validator');

const idMatricula = param('id').isMongoId().withMessage('El ID de la matrícula no es válido')

class matriculaValidator {
    validarCambiarEstado = [idMatricula];

    validarCrearMatricula = [
        body('cursoID')
            .notEmpty().withMessage('El ID del curso es obligatorio')
            .isMongoId().withMessage('El ID del curso no es válido'),

        body('usuarioID')
            .optional()
            .isMongoId().withMessage('El ID del usuario no es válido')
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
