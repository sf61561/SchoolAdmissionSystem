import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getDashboardPathForUser, isAdminUser } from '../../utils/authUtils'

/**
 * Protects nested routes by checking authentication and optional role ('admin' | 'student').
 * Enable allowGuestPreview to keep unauthenticated preview access working where supported.
 */
function ProtectedRoute({
  allowedRole,
  allowGuestPreview = false,
  redirectTo = '/login',
}) {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    if (allowGuestPreview) {
      return <Outlet />
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (allowedRole) {
    const userRole = isAdminUser(currentUser) ? 'admin' : 'student'
    if (userRole !== allowedRole) {
      return <Navigate to={getDashboardPathForUser(currentUser)} replace />
    }
  }

  return <Outlet />
}

export default ProtectedRoute
