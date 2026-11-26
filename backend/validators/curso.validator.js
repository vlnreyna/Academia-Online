const { body } = require('express-validator');

const idCurso = param('id').isMongoId().withMessage('El id del curso no es valido')

class cursoValidator {
    validarCrearCurso = [
        body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio'),

        body('descripcion')
        .trim()
        .notEmpty()
        .withMessage('La descripción es obligatoria'),

        body('nivel')
        .trim()
        .toUpperCase()
        .notEmpty()
        .withMessage("Debes insertar un nivel")
        .isIn(['BASICO', 'INTERMEDIO', 'AVANZADO'])
        .withMessage('El nivel debe ser BASICO, INTERMEDIO o AVANZADO'),

        body('duracionHoras')
        .notEmpty()
        .withMessage("La duracion no puede estar vacia")
        .isNumeric()
        .withMessage('La duracion debe ser un numero de horas'),

        body('precio')
        .notEmpty()
        .withMessage("El precio no puede estar vacio")
        .isNumeric()
        .withMessage('El precio debe ser un numero')
    ];

    validarActualizarCurso = [
        idCurso,

        body('nombre')
            .optional()
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage('El nombre debe tener entre 3 y 50 caracteres'),

        body('descripcion')
            .optional()
            .trim()
            .isLength({ max: 200 })
            .withMessage('La descripcion no puede superar los 200 caracteres'),

        body('nivel')
            .optional()
            .trim()
            .isIn(['BASICO', 'INTERMEDIO', 'AVANZADO'])
            .withMessage('El nivel debe ser BASICO, INTERMEDIO o AVANZADO'),

        body('duracionHoras')
            .optional()
            .isInt({ min: 1 })
            .withMessage('La duracion debe ser un numero entero mayor que 0'),

        body('precio')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('El precio debe ser un numero mayor o igual a 0')
    ];

    validarCambiarEstado = [
        idCurso
    ];
}

module.exports = new cursoValidator();