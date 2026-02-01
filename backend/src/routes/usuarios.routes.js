import express from 'express';
import * as UsuarioController from '../controllers/usuario/usuario.controller.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { registerUserValidator, updateUserValidator } from '../middlewares/validators/usuario.validator.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación

// Obtiene la lista de usuarios (privado)
router.get(
  "/",
  verificarToken,
  UsuarioController.getUsers
);

// Muestra un usuario por ID (privado)
router.get(
  '/:id',
  verificarToken,
  UsuarioController.showUser
);

// Crea un nuevo usuario (público)
router.post(
  '/',
  registerUserValidator,
  validateRequest,
  UsuarioController.createUser
);

// Actualiza un usuario por documento (privado)
router.put(
  '/:documento',
  verificarToken,
  updateUserValidator,
  validateRequest,
  UsuarioController.updateUser
);

// Elimina un usuario por ID (privado)
router.delete(
  '/:id',
  verificarToken,
  UsuarioController.deleteUser
);

export default router;
