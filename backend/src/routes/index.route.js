import { Router } from "express";
import AuthRoutes from "./auth.routes.js";
import UsuarioRoutes from "./usuarios.routes.js";
import RolesRoutes from "./roles.routes.js";
import PermisosRoutes from "./permisos.routes.js";
import TiposHospedajeRoutes from "./tiposHospedaje.routes.js";
import HospedajesRoutes from "./hospedajes.routes.js";
import ReservasRoutes from "./reservas.routes.js";
import PagosRoutes from "./pagos.routes.js";
import PublicRoutes from "./public.routes.js";
import NotificacionesRoutes from "./notificaciones.routes.js";

const router = Router();

// Rutas públicas (sin autenticación)
router.use("/public", PublicRoutes);

// Rutas de autenticación (public)
router.use("/auth", AuthRoutes);

// Rutas protegidas bajo /auth
router.use("/auth/usuarios", UsuarioRoutes);
router.use("/auth/roles", RolesRoutes);
router.use("/auth/permisos", PermisosRoutes);
router.use("/auth/tipos-hospedaje", TiposHospedajeRoutes);
router.use("/auth/hospedajes", HospedajesRoutes);
router.use("/auth/reservas", ReservasRoutes);
router.use("/auth/pagos", PagosRoutes);
router.use("/auth/notificaciones", NotificacionesRoutes);

export default router;
