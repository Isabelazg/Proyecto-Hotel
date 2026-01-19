import { body } from 'express-validator';
import { Reserva, Usuario } from '../../models/index.js';

export const createPagoValidator = [
  body('reserva_id')
    .notEmpty().withMessage('El reserva_id es requerido.')
    .isInt().withMessage('El reserva_id debe ser un número entero.')
    .custom(async (reserva_id) => {
      const reserva = await Reserva.findByPk(reserva_id);
      if (!reserva) throw new Error(`La reserva con ID "${reserva_id}" no existe.`);
      return true;
    }),
  body('usuario_id')
    .optional()
    .isInt().withMessage('El usuario_id debe ser un número entero.')
    .custom(async (usuario_id) => {
      if (usuario_id) {
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) throw new Error(`El usuario con ID "${usuario_id}" no existe.`);
      }
      return true;
    }),
  body('valor')
    .notEmpty().withMessage('El valor es requerido.')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El valor debe ser un número decimal válido (máximo 2 decimales).')
    .custom((valor) => {
      if (valor && parseFloat(valor) <= 0) throw new Error('El valor debe ser mayor a 0.');
      return true;
    }),
];

export const updatePagoValidator = [
  body('reserva_id')
    .optional()
    .isInt().withMessage('El reserva_id debe ser un número entero.')
    .custom(async (reserva_id) => {
      if (reserva_id) {
        const reserva = await Reserva.findByPk(reserva_id);
        if (!reserva) throw new Error(`La reserva con ID "${reserva_id}" no existe.`);
      }
      return true;
    }),
  body('usuario_id')
    .optional()
    .isInt().withMessage('El usuario_id debe ser un número entero.')
    .custom(async (usuario_id) => {
      if (usuario_id) {
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) throw new Error(`El usuario con ID "${usuario_id}" no existe.`);
      }
      return true;
    }),
  body('valor')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El valor debe ser un número decimal válido (máximo 2 decimales).')
    .custom((valor) => {
      if (valor && parseFloat(valor) <= 0) throw new Error('El valor debe ser mayor a 0.');
      return true;
    }),
];
