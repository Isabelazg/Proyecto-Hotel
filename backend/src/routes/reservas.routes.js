import express from 'express';
import * as ReservaController from '../controllers/reserva/reserva.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { createReservaValidator, updateReservaValidator } from '../middlewares/validators/reserva.validator.js';

const router = express.Router();

router.get('/', verificarToken, ReservaController.getReservas);
router.get('/:id', verificarToken, ReservaController.showReserva);
router.post('/', verificarToken, createReservaValidator, validateRequest, ReservaController.createReserva);
router.put('/:id', verificarToken, updateReservaValidator, validateRequest, ReservaController.updateReserva);
router.patch('/:id/iniciar', verificarToken, ReservaController.iniciarReserva);
router.patch('/:id/finalizar', verificarToken, ReservaController.finalizarReserva);
router.delete('/:id', verificarToken, ReservaController.deleteReserva);

export default router;
