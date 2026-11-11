const { body } = require('express-validator');

const validarRegistro = [
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

const validarLogin = [
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

module.exports = { 
    validarRegistro,
    validarLogin
};