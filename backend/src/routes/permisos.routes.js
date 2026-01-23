import express from 'express';
import * as PermisoController from '../controllers/permiso/permiso.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { createPermisoValidator, updatePermisoValidator } from '../middlewares/validators/permiso.validator.js';

const router = express.Router();

router.get('/', verificarToken, PermisoController.getPermisos);
router.get('/:id', verificarToken, PermisoController.showPermiso);
router.post('/', verificarToken, createPermisoValidator, validateRequest, PermisoController.createPermiso);
router.put('/:id', verificarToken, updatePermisoValidator, validateRequest, PermisoController.updatePermiso);
router.delete('/:id', verificarToken, PermisoController.deletePermiso);

export default router;
