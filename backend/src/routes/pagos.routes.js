import express from 'express';
import * as PagoController from '../controllers/pago/pago.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { createPagoValidator, updatePagoValidator } from '../middlewares/validators/pago.validator.js';

const router = express.Router();

router.get('/', verificarToken, PagoController.getPagos);
router.get('/:id', verificarToken, PagoController.showPago);
router.get('/reserva/:reserva_id/estado', verificarToken, PagoController.getEstadoPagosReserva);
router.post('/', verificarToken, createPagoValidator, validateRequest, PagoController.createPago);
router.put('/:id', verificarToken, updatePagoValidator, validateRequest, PagoController.updatePago);
router.delete('/:id', verificarToken, PagoController.deletePago);

export default router;
