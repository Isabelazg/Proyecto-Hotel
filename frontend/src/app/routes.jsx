import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages
import LoginPage from '@/pages/LoginPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import DashboardPage from '@/pages/DashboardPage'
import ReservationsPage from '@/pages/ReservationsPage'
import UnitsPage from '@/pages/UnitsPage'
import ClientsPage from '@/pages/ClientsPage'
import PaymentsPage from '@/pages/PaymentsPage'
import ReportsPage from '@/pages/ReportsPage'

// Layout & guards
import AppLayout from '@/shared/components/layout/AppLayout'
import ProtectedRoute from '@/shared/components/layout/ProtectedRoute'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* RUTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
