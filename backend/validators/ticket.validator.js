const { body, param, query } = require('express-validator');

const ESTADOS = ['ABIERTO', 'EN_CURSO', 'PENDIENTE_CLIENTE', 'RESUELTO', 'CERRADO'];
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA'];
const idTicket = param('id').isMongoId().withMessage('El id del ticket no es valido');

class ticketValidator {
    validarId = [idTicket];

    validarCrear = [
        body('asunto')
            .trim()
            .notEmpty().withMessage('El asunto es obligatorio')
            .isLength({ min: 3, max: 100 }).withMessage('El asunto debe tener entre 3 y 100 caracteres'),

        body('descripcion')
            .trim()
            .notEmpty().withMessage('La descripcion es obligatoria')
            .isLength({ min: 10, max: 3000 }).withMessage('La descripcion debe tener entre 10 y 3000 caracteres'),

        body('categoria')
            .notEmpty().withMessage('La categoria es obligatoria')
            .isMongoId().withMessage('La categoria no es valida'),

        body('prioridad')
            .optional()
            .trim().toUpperCase()
            .isIn(PRIORIDADES).withMessage('La prioridad debe ser BAJA, MEDIA o ALTA')
    ];

    validarResponder = [
        idTicket,
        body('contenido')
            .trim()
            .notEmpty().withMessage('El contenido es obligatorio')
            .isLength({ max: 3000 }).withMessage('El contenido no puede superar los 3000 caracteres')
    ];

    validarCambiarEstado = [
        idTicket,
        body('estado')
            .trim().toUpperCase()
            .notEmpty().withMessage('El estado es obligatorio')
            .isIn(ESTADOS).withMessage(`El estado debe ser: ${ESTADOS.join(', ')}`)
    ];

    validarCambiarPrioridad = [
        idTicket,
        body('prioridad')
            .trim().toUpperCase()
            .notEmpty().withMessage('La prioridad es obligatoria')
            .isIn(PRIORIDADES).withMessage('La prioridad debe ser BAJA, MEDIA o ALTA')
    ];

    validarAsignar = [
        body('ticketID').isMongoId().withMessage('El id del ticket no es valido'),
        body('agenteID').isMongoId().withMessage('El id del agente no es valido')
    ];

    validarListado = [
        query('estado').optional().trim().toUpperCase().isIn(ESTADOS).withMessage('Estado no valido'),
        query('prioridad').optional().trim().toUpperCase().isIn(PRIORIDADES).withMessage('Prioridad no valida'),
        query('categoria').optional().isMongoId().withMessage('Categoria no valida'),
        query('cliente').optional().isMongoId().withMessage('Cliente no valido'),
        query('agente').optional().isMongoId().withMessage('Agente no valido'),
    ];
}

module.exports = new ticketValidator();