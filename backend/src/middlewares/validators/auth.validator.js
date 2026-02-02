import { body } from 'express-validator';

export const forgotPasswordValidator = [
  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es requerido.')
    .isEmail().withMessage('El correo no es válido.'),
];

export const resetPasswordValidator = [
  body('token')
    .trim()
    .notEmpty().withMessage('El token es requerido.'),
  body('contrasena')
    .notEmpty().withMessage('La contraseña es requerida.')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres.'),
];