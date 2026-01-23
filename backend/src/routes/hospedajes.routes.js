import express from 'express';
import * as HospedajeController from '../controllers/hospedaje/hospedaje.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { createHospedajeValidator, updateHospedajeValidator, updateHospedajeEstadoValidator } from '../middlewares/validators/hospedaje.validator.js';

const router = express.Router();

router.get('/', verificarToken, HospedajeController.getHospedajes);
router.get('/:id', verificarToken, HospedajeController.showHospedaje);
router.post('/', verificarToken, createHospedajeValidator, validateRequest, HospedajeController.createHospedaje);
router.put('/:id', verificarToken, updateHospedajeValidator, validateRequest, HospedajeController.updateHospedaje);
router.patch('/:id/estado', verificarToken, updateHospedajeEstadoValidator, validateRequest, HospedajeController.updateHospedajeEstado);
router.delete('/:id', verificarToken, HospedajeController.deleteHospedaje);

export default router;
