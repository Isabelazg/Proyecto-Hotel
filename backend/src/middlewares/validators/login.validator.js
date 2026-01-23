import { body } from 'express-validator';
import { Usuario } from '../../models/index.js';

export const loginValidator = [
  body("correo")
    .trim()
    .notEmpty().withMessage("El correo es requerido.")
    .isEmail().withMessage("El correo no es válido."),
  body("contrasena")
    .notEmpty().withMessage("La contraseña es requerida.")
    .isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres."),
];
