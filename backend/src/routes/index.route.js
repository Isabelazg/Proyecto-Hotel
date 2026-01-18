import { Router } from "express";
import AuthRoutes from "./auth.routes.js";
import UsuarioRoutes from "./usuarios.routes.js";

const router = Router();

// Rutas de autenticación (public)
router.use("/auth", AuthRoutes);

// Rutas protegidas bajo /auth
router.use("/auth/usuarios", UsuarioRoutes);

// Aquí puedes agregar más rutas cuando las necesites
// router.use("/habitaciones", HabitacionesRoutes);
// router.use("/reservas", ReservasRoutes);
// router.use("/clientes", ClientesRoutes);

export default router;
