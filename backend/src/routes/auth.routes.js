import express from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { loginValidator } from '../middlewares/validators/login.validator.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Login - Obtener token
router.post(
  '/login',
  loginValidator,
  validateRequest,
  AuthController.login
);

// Perfil - Requiere autenticación
router.get(
  '/perfil',
  verificarToken,
  AuthController.perfil
);

export default router;
