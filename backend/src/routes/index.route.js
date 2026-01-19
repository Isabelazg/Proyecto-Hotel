import { Router } from "express";
import AuthRoutes from "./auth.routes.js";
import UsuarioRoutes from "./usuarios.routes.js";
import RolesRoutes from "./roles.routes.js";
import PermisosRoutes from "./permisos.routes.js";
import PermisoRoutes from "./permisos.routes.js";
import RolRoutes from "./roles.routes.js";

const router = Router();

// Rutas de autenticación (public)
router.use("/auth", AuthRoutes);

// Rutas protegidas bajo /auth
router.use("/auth/usuarios", UsuarioRoutes);
router.use("/auth/roles", RolesRoutes);
router.use("/auth/permisos", PermisosRoutes);
router.use("/auth/permisos", PermisoRoutes);
router.use("/auth/roles", RolRoutes);

// Aquí puedes agregar más rutas cuando las necesites
// router.use("/habitaciones", HabitacionesRoutes);
// router.use("/reservas", ReservasRoutes);
// router.use("/clientes", ClientesRoutes);

export default router;
