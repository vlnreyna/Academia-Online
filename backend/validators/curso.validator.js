const { body } = require('express-validator');

const validarInsertarCurso = [
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
    .withMessage("La duracion no puede etsar vacia")
    .isNumeric()
    .withMessage('La duracion debe ser un numero de horas'),

    body('precio')
    .notEmpty()
    .withMessage("El precio no puede estar vacio")
    .isNumeric()
    .withMessage('El precio debe ser un numero')
];

module.exports = { 
    validarInsertarCurso
};