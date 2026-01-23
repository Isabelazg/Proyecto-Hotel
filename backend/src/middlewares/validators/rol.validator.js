import { body } from 'express-validator';
import { Rol, Permiso } from '../../models/index.js';

export const createRolValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido.')
    .isLength({ max: 50 }).withMessage('El nombre debe tener máximo 50 caracteres.')
    .custom(async (nombre) => {
      const exists = await Rol.findOne({ where: { nombre }, attributes: ['id'] });
      if (exists) throw new Error('El nombre del rol ya existe.');
      return true;
    }),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La descripción debe tener máximo 100 caracteres.'),
  body('permisos')
    .optional()
    .isArray().withMessage('Permisos debe ser un arreglo de IDs.')
    .custom(async (permisos) => {
      if (!Array.isArray(permisos)) return true;
      const ids = permisos.filter((p) => Number.isInteger(p));
      if (ids.length !== permisos.length) throw new Error('Todos los permisos deben ser números enteros.');
      const found = await Permiso.count({ where: { id: ids } });
      if (found !== ids.length) throw new Error('Algún permiso no existe.');
      return true;
    }),
];

export const updateRolValidator = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El nombre debe tener máximo 50 caracteres.')
    .custom(async (nombre, { req }) => {
      if (!nombre) return true;
      const id = req.params.id;
      const exists = await Rol.findOne({ where: { nombre }, attributes: ['id'] });
      if (exists && String(exists.id) !== String(id)) throw new Error('El nombre del rol ya existe.');
      return true;
    }),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La descripción debe tener máximo 100 caracteres.'),
  body('permisos')
    .optional()
    .isArray().withMessage('Permisos debe ser un arreglo de IDs.')
    .custom(async (permisos) => {
      if (!Array.isArray(permisos)) return true;
      const ids = permisos.filter((p) => Number.isInteger(p));
      if (ids.length !== permisos.length) throw new Error('Todos los permisos deben ser números enteros.');
      const found = await Permiso.count({ where: { id: ids } });
      if (found !== ids.length) throw new Error('Algún permiso no existe.');
      return true;
    }),
];
