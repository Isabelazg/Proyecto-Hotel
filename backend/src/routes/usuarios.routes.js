import express from 'express';
import * as UsuarioController from '../controllers/usuario/usuario.controller.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { registerUserValidator, updateUserValidator } from '../middlewares/validators/usuario.validator.js';

const router = express.Router();

// Obtiene la lista de usuarios
router.get(
  "/",
  UsuarioController.getUsers
);

// Muestra un usuario por ID
router.get(
  '/:id',
  UsuarioController.showUser
);

// Crea un nuevo usuario
router.post(
  '/',
  registerUserValidator,
  validateRequest,
  UsuarioController.createUser
);

// Actualiza un usuario por documento
router.put(
  '/:documento',
  updateUserValidator,
  validateRequest,
  UsuarioController.updateUser
);

// Elimina un usuario por ID
router.delete(
  '/:id',
  UsuarioController.deleteUser
);

export default router;
