import express from 'express';
import * as TipoHospedajeController from '../controllers/tipoHospedaje/tipoHospedaje.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { createTipoHospedajeValidator, updateTipoHospedajeValidator } from '../middlewares/validators/tipoHospedaje.validator.js';

const router = express.Router();

router.get('/', verificarToken, TipoHospedajeController.getTiposHospedaje);
router.get('/:id', verificarToken, TipoHospedajeController.showTipoHospedaje);
router.post('/', verificarToken, createTipoHospedajeValidator, validateRequest, TipoHospedajeController.createTipoHospedaje);
router.put('/:id', verificarToken, updateTipoHospedajeValidator, validateRequest, TipoHospedajeController.updateTipoHospedaje);
router.delete('/:id', verificarToken, TipoHospedajeController.deleteTipoHospedaje);

export default router;
