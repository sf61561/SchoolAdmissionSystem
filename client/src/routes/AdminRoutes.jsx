import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import ProtectedRoute from '../components/routes/ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'
import AdminPortal from '../pages/admin/AdminPortal'

const ADMIN_TAB_PATHS = {
  dashboard: '/admin/dashboard',
  classes: '/admin/classes',
  students: '/admin/students',
}

function getAdminTabPath(tab) {
  return ADMIN_TAB_PATHS[tab] || ADMIN_TAB_PATHS.dashboard
}

/**
 * Connects AdminPortal tab navigation and logout actions to React Router and AuthContext.
 */
function AdminPortalRoute({ activeTab }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleSelectTab = (nextTab) => {
    navigate(getAdminTabPath(nextTab))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AdminPortal
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      onLogout={handleLogout}
    />
  )
}

/**
 * Nested admin portal routes protected by admin role authorization.
 */
function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="dashboard"
          element={<AdminPortalRoute activeTab="dashboard" />}
        />
        <Route
          path="classes"
          element={<AdminPortalRoute activeTab="classes" />}
        />
        <Route
          path="students"
          element={<AdminPortalRoute activeTab="students" />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AdminRoutes
