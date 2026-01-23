import { body } from 'express-validator';
import { Permiso } from '../../models/index.js';

export const createPermisoValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido.')
    .isLength({ max: 50 }).withMessage('El nombre debe tener máximo 50 caracteres.')
    .custom(async (nombre) => {
      const exists = await Permiso.findOne({ where: { nombre }, attributes: ['id'] });
      if (exists) throw new Error('El nombre del permiso ya existe.');
      return true;
    }),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La descripción debe tener máximo 100 caracteres.'),
];

export const updatePermisoValidator = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El nombre debe tener máximo 50 caracteres.')
    .custom(async (nombre, { req }) => {
      if (!nombre) return true;
      const id = req.params.id;
      const exists = await Permiso.findOne({ where: { nombre }, attributes: ['id'] });
      if (exists && String(exists.id) !== String(id)) throw new Error('El nombre del permiso ya existe.');
      return true;
    }),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La descripción debe tener máximo 100 caracteres.'),
];
