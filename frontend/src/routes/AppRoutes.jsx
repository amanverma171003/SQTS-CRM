import { BrowserRouter, Routes, Route } from "react-router-dom"

import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Leads from "../pages/Leads"
import Pipeline from "../pages/Pipeline"
import Users from "../pages/Users"
import Clients from "../pages/Clients"
import ClientDetails from "../pages/ClientDetails"
import Analytics from "../pages/Analytics"
import ProtectedRoute from "./ProtectedRoute"
import AnalyticsGuard from "../components/auth/AnalyticsGuard"
import AuditLogs from "../pages/AuditLogs"

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/leads" element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        } />

        <Route path="/pipeline" element={
          <ProtectedRoute>
            <Pipeline />
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } />

        <Route path="/clients" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        } />

        <Route path="/clients/:id" element={
          <ProtectedRoute>
            <ClientDetails />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute>
            <AnalyticsGuard>
              <Analytics />
            </AnalyticsGuard>
          </ProtectedRoute>
        } />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}