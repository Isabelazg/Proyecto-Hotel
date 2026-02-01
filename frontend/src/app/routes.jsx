import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Admin Pages
import LoginPage from '@/pages/LoginPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import DashboardPage from '@/pages/DashboardPage'
import ReservationsPage from '@/pages/ReservationsPage'
import UnitsPage from '@/pages/UnitsPage'
import ClientsPage from '@/pages/ClientsPage'
import PaymentsPage from '@/pages/PaymentsPage'
import ReportsPage from '@/pages/ReportsPage'

// Public Pages
import { HomePage, UnitsView, UnitDetailView, AboutPage, ContactPage, NotFoundPage, PublicLayout } from '@/features/public'

// Layout & guards
import AppLayout from '@/shared/components/layout/AppLayout'
import ProtectedRoute from '@/shared/components/layout/ProtectedRoute'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS - SITIO WEB */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/habitaciones" element={<UnitsView />} />
          <Route path="/habitaciones/:id" element={<UnitDetailView />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
        </Route>

        {/* RUTAS DE AUTENTICACIÓN */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />

        {/* RUTAS PROTEGIDAS - PANEL ADMINISTRATIVO */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="units" element={<UnitsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Route>

        {/* RUTA 404 - DEBE IR AL FINAL */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
