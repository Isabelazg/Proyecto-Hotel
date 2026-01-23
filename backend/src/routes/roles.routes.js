import express from 'express';
import * as RolController from '../controllers/rol/rol.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { createRolValidator, updateRolValidator } from '../middlewares/validators/rol.validator.js';

const router = express.Router();

router.get('/', verificarToken, RolController.getRoles);
router.get('/:id', verificarToken, RolController.showRol);
router.post('/', verificarToken, createRolValidator, validateRequest, RolController.createRol);
router.put('/:id', verificarToken, updateRolValidator, validateRequest, RolController.updateRol);
router.delete('/:id', verificarToken, RolController.deleteRol);

export default router;
