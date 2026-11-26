const { body, param } = require('express-validator');

const ROLES = ['ALUMNO', 'AGENTE', 'ADMIN'];

const validarPasswordSegura = (campo, mensaje) => {
    return body(campo)
        .notEmpty().withMessage(mensaje)
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
        .matches(/[0-9]/).withMessage('Debe contener al menos un número');
}

class usuarioValidator {
    validarRegistro = [
        body('nombre')
            .trim()
            .notEmpty().withMessage('El nombre es obligatorio')
            .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),

        body('apellidos')
            .trim()
            .notEmpty().withMessage('Los apellidos son obligatorios')
            .isLength({ min: 2, max: 50 }).withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),

        body('email')
            .trim()
            .notEmpty().withMessage('El email es obligatorio')
            .isEmail().withMessage('El email no tiene un formato válido')
            .normalizeEmail(),

        validarPasswordSegura('password', 'La contraseña es obligatoria')
    ];

    validarLogin = [
        body('email')
            .trim()
            .notEmpty().withMessage('El email es obligatorio')
            .isEmail().withMessage('El email no tiene un formato válido')
            .normalizeEmail(),

        body('password')
            .notEmpty().withMessage('La contraseña es obligatoria')
    ];

    validarCambiarRol = [
        body('usuarioID')
            .notEmpty().withMessage('El ID del usuario es obligatorio')
            .isMongoId().withMessage('El ID del usuario no es válido'),

        body('rol')
            .trim()
            .toUpperCase()
            .notEmpty().withMessage('Debes insertar un rol')
            .isIn(ROLES)
            .withMessage('El rol debe ser ALUMNO, AGENTE o ADMIN')
    ];

    validarCambiarEstado = [
        param('id')
            .isMongoId().withMessage('El ID del usuario no es válido')
    ];

    validarCambiarPassword = [
        body('passwordActual')
            .notEmpty().withMessage('Es obligatorio insertar la contraseña actual'),

        validarPasswordSegura('passwordNueva', 'Es obligatorio insertar la contraseña nueva')
    ];

    validarEditarPerfil = [
        body('nombre')
            .optional()
            .trim()
            .notEmpty().withMessage('El nombre no puede estar vacío')
            .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),

        body('apellidos')
            .optional()
            .trim()
            .notEmpty().withMessage('Los apellidos no pueden estar vacíos')
            .isLength({ min: 2, max: 50 }).withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),

        body('email')
            .optional()
            .trim()
            .notEmpty().withMessage('El email no puede estar vacío')
            .isEmail().withMessage('El email no tiene un formato válido')
            .normalizeEmail()
    ];
}

module.exports = new usuarioValidator();
