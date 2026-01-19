import { body } from 'express-validator';
import { TipoHospedaje } from '../../models/index.js';

export const createHospedajeValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido.')
    .isLength({ max: 50 }).withMessage('El nombre debe tener máximo 50 caracteres.'),
  body('tipo_hospedaje_id')
    .optional()
    .isInt().withMessage('El tipo_hospedaje_id debe ser un número entero.')
    .custom(async (tipo_hospedaje_id) => {
      if (tipo_hospedaje_id) {
        const tipo = await TipoHospedaje.findByPk(tipo_hospedaje_id);
        if (!tipo) throw new Error(`El tipo de hospedaje con ID "${tipo_hospedaje_id}" no existe.`);
      }
      return true;
    }),
  body('precio')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe ser un número decimal válido (máximo 2 decimales).')
    .custom((precio) => {
      if (precio && parseFloat(precio) < 0) throw new Error('El precio no puede ser negativo.');
      return true;
    }),
  body('estado')
    .optional()
    .isBoolean().withMessage('El estado debe ser un valor booleano (true/false).'),
];

export const updateHospedajeValidator = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El nombre debe tener máximo 50 caracteres.'),
  body('tipo_hospedaje_id')
    .optional()
    .isInt().withMessage('El tipo_hospedaje_id debe ser un número entero.')
    .custom(async (tipo_hospedaje_id) => {
      if (tipo_hospedaje_id) {
        const tipo = await TipoHospedaje.findByPk(tipo_hospedaje_id);
        if (!tipo) throw new Error(`El tipo de hospedaje con ID "${tipo_hospedaje_id}" no existe.`);
      }
      return true;
    }),
  body('precio')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe ser un número decimal válido (máximo 2 decimales).')
    .custom((precio) => {
      if (precio && parseFloat(precio) < 0) throw new Error('El precio no puede ser negativo.');
      return true;
    }),
  body('estado')
    .optional()
    .isBoolean().withMessage('El estado debe ser un valor booleano (true/false).'),
];

export const updateHospedajeEstadoValidator = [
  body('estado')
    .notEmpty().withMessage('El estado es requerido.')
    .isBoolean().withMessage('El estado debe ser un valor booleano (true/false).'),
];
