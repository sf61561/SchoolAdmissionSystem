import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Login from '../pages/auth/Login'
import { getDashboardPathForUser } from '../utils/authUtils'

/**
 * Connects the Login page to AuthContext and redirects users based on their role.
 */
function LoginRoute() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLoginSuccess = (user) => {
    const savedUser = login(user)
    navigate(getDashboardPathForUser(savedUser))
  }

  return <Login onLoginSuccess={handleLoginSuccess} />
}

export default LoginRoute
