import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Register from '../pages/auth/Register'
import AdminRoutes from './AdminRoutes'
import LoginRoute from './LoginRoute'
import StudentRoutes from './StudentRoutes'

/**
 * Top-level application route configuration delegating module routes to dedicated route files.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/student/*" element={<StudentRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
