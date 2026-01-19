import { body } from 'express-validator';
import { Hospedaje, Reserva } from '../../models/index.js';

export const createReservaValidator = [
  body('numero_reserva')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El número de reserva debe tener máximo 50 caracteres.')
    .custom(async (numero_reserva) => {
      if (numero_reserva) {
        const existe = await Reserva.findOne({ where: { numero_reserva }, attributes: ['id'] });
        if (existe) throw new Error('El número de reserva ya existe.');
      }
      return true;
    }),
  body('hospedaje_id')
    .notEmpty().withMessage('El hospedaje_id es requerido.')
    .isInt().withMessage('El hospedaje_id debe ser un número entero.')
    .custom(async (hospedaje_id) => {
      const hospedaje = await Hospedaje.findByPk(hospedaje_id);
      if (!hospedaje) throw new Error(`El hospedaje con ID "${hospedaje_id}" no existe.`);
      return true;
    }),
  body('fecha_ingreso_hora')
    .optional()
    .isISO8601().withMessage('La fecha de ingreso debe ser una fecha válida (formato ISO 8601).'),
  body('fecha_salida_hora')
    .optional()
    .isISO8601().withMessage('La fecha de salida debe ser una fecha válida (formato ISO 8601).')
    .custom((fecha_salida_hora, { req }) => {
      if (fecha_salida_hora && req.body.fecha_ingreso_hora) {
        const ingreso = new Date(req.body.fecha_ingreso_hora);
        const salida = new Date(fecha_salida_hora);
        if (salida <= ingreso) {
          throw new Error('La fecha de salida debe ser posterior a la fecha de ingreso.');
        }
      }
      return true;
    }),
  body('numero_huespedes')
    .optional()
    .isInt({ min: 1 }).withMessage('El número de huéspedes debe ser un número entero mayor a 0.'),
  body('notas')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Las notas deben tener máximo 50 caracteres.'),
  body('valor')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El valor debe ser un número decimal válido (máximo 2 decimales).')
    .custom((valor) => {
      if (valor && parseFloat(valor) < 0) throw new Error('El valor no puede ser negativo.');
      return true;
    }),
  body('estado')
    .optional()
    .isIn(['pendiente', 'en_ejecucion', 'terminada']).withMessage('El estado debe ser: pendiente, en_ejecucion o terminada.'),
];

export const updateReservaValidator = [
  body('numero_reserva')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El número de reserva debe tener máximo 50 caracteres.')
    .custom(async (numero_reserva, { req }) => {
      if (numero_reserva) {
        const id = req.params.id;
        const existe = await Reserva.findOne({ where: { numero_reserva }, attributes: ['id'] });
        if (existe && String(existe.id) !== String(id)) {
          throw new Error('El número de reserva ya existe.');
        }
      }
      return true;
    }),
  body('hospedaje_id')
    .optional()
    .isInt().withMessage('El hospedaje_id debe ser un número entero.')
    .custom(async (hospedaje_id) => {
      if (hospedaje_id) {
        const hospedaje = await Hospedaje.findByPk(hospedaje_id);
        if (!hospedaje) throw new Error(`El hospedaje con ID "${hospedaje_id}" no existe.`);
      }
      return true;
    }),
  body('fecha_ingreso_hora')
    .optional()
    .isISO8601().withMessage('La fecha de ingreso debe ser una fecha válida (formato ISO 8601).'),
  body('fecha_salida_hora')
    .optional()
    .isISO8601().withMessage('La fecha de salida debe ser una fecha válida (formato ISO 8601).')
    .custom((fecha_salida_hora, { req }) => {
      if (fecha_salida_hora && req.body.fecha_ingreso_hora) {
        const ingreso = new Date(req.body.fecha_ingreso_hora);
        const salida = new Date(fecha_salida_hora);
        if (salida <= ingreso) {
          throw new Error('La fecha de salida debe ser posterior a la fecha de ingreso.');
        }
      }
      return true;
    }),
  body('numero_huespedes')
    .optional()
    .isInt({ min: 1 }).withMessage('El número de huéspedes debe ser un número entero mayor a 0.'),
  body('notas')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Las notas deben tener máximo 50 caracteres.'),
  body('valor')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El valor debe ser un número decimal válido (máximo 2 decimales).')
    .custom((valor) => {
      if (valor && parseFloat(valor) < 0) throw new Error('El valor no puede ser negativo.');
      return true;
    }),
  body('estado')
    .optional()
    .isIn(['pendiente', 'en_ejecucion', 'terminada']).withMessage('El estado debe ser: pendiente, en_ejecucion o terminada.'),
];
