import { Router } from "express";
import UsuarioRoutes from "./usuarios.routes.js";

const router = Router();

// Rutas de usuarios
router.use("/usuarios", UsuarioRoutes);

// Aquí puedes agregar más rutas cuando las necesites
// router.use("/habitaciones", HabitacionesRoutes);
// router.use("/reservas", ReservasRoutes);
// router.use("/clientes", ClientesRoutes);

export default router;
