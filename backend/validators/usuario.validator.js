const { body } = require('express-validator');

class usuarioValidator {
    validarRegistro = [
        body('nombre')
            .trim()
            .notEmpty()
            .withMessage('El nombre es obligatorio'),

        body('apellidos')
            .trim()
            .notEmpty()
            .withMessage('Los apellidos son obligatorios'),

        body('email')
            .trim()
            .notEmpty()
            .withMessage('El email es obligatorio')
            .isEmail()
            .withMessage('El email no tiene un formato válido')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('La contraseña es obligatoria')
            .isLength({ min: 8 })
            .withMessage('La contraseña debe tener al menos 8 caracteres')
            .matches(/[A-Z]/)
            .withMessage('Debe contener al menos una mayúscula')
            .matches(/[0-9]/)
            .withMessage('Debe contener al menos un número')
    ];

    validarLogin = [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('El email es obligatorio')
            .isEmail()
            .withMessage('El email no tiene un formato válido')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('La contraseña es obligatoria')
    ]

    validarCambiarRol = [
        body('rol')
            .trim()
            .notEmpty()
            .withMessage("Insertar rol")
            .isIn(['ALUMNO', 'AGENTE', 'ADMIN'])
            .withMessage("El rol no es valido debe ser ALUMNO, AGENTE o ADMIN")
    ]
}

module.exports = new usuarioValidator();