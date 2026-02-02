import express from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { loginValidator } from '../middlewares/validators/login.validator.js';
import { registerUserValidator } from '../middlewares/validators/usuario.validator.js';
import { forgotPasswordValidator, resetPasswordValidator } from '../middlewares/validators/auth.validator.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Login - Obtener token
router.post(
  '/login',
  loginValidator,
  validateRequest,
  AuthController.login
);

// Registro - Enviar correo de bienvenida
router.post(
  '/register',
  registerUserValidator,
  validateRequest,
  AuthController.register
);

// Olvidé mi contraseña - Enviar enlace
router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validateRequest,
  AuthController.forgotPassword
);

// Restablecer contraseña
router.post(
  '/reset-password',
  resetPasswordValidator,
  validateRequest,
  AuthController.resetPassword
);

// Perfil - Requiere autenticación
router.get(
  '/perfil',
  verificarToken,
  AuthController.perfil
);

export default router;
