const { body, param, query } = require('express-validator');

const NIVELES = ['BASICO', 'INTERMEDIO', 'AVANZADO'];
const idCurso = param('id').isMongoId().withMessage('El id del curso no es valido')

class cursoValidator {
    validarId = [idCurso];
    
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
        .isInt({ min: 2 }).toInt(),

        body('precio')
        .notEmpty()
        .withMessage("El precio no puede estar vacio")
        .isFloat({ min: 0 }).toFloat()
    ];

    validarListarCursos = [
        query('nombre')
            .optional()
            .trim()
            .isLength({ max: 50 })
            .withMessage('La busqueda no puede superar los 50 caracteres'),

        query('nivel')
            .optional()
            .trim()
            .toUpperCase()
            .isIn(NIVELES)
            .withMessage('El nivel debe ser BASICO, INTERMEDIO o AVANZADO'),
        
        // validator: en validarListarCursos
        query('activo')
            .optional()
            .isBoolean()
            .toBoolean()
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
            .isLength({ min: 3, max: 200 })
            .withMessage('La descripcion debe tener entre 3 y 200 caracteres'),

        body('nivel')
            .optional()
            .trim()
            .toUpperCase()
            .isIn(NIVELES)
            .withMessage('El nivel debe ser BASICO, INTERMEDIO o AVANZADO'),

        body('duracionHoras')
            .optional()
            .isInt({ min: 2 })
            .withMessage('La duracion debe ser un numero entero de al menos 2 horas')
            .toInt(),

        body('precio')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('El precio debe ser un numero mayor o igual a 0')
            .toFloat()
    ];
}

module.exports = new cursoValidator();