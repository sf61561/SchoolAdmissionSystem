import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  clearAuthSession,
  getStoredStudentId,
  getStoredUser,
  saveAuthSession,
} from '../utils/authStorage'

const AuthContext = createContext(null)

/**
 * Provides authenticated user state, persisted student ID, and login/logout actions.
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser())
  const [storedStudentId, setStoredStudentId] = useState(() =>
    getStoredStudentId()
  )

  const login = useCallback((user, fallbackId = '') => {
    const savedUser = saveAuthSession(user, fallbackId)
    setCurrentUser(savedUser)
    setStoredStudentId(getStoredStudentId())
    return savedUser
  }, [])

  const logout = useCallback(() => {
    clearAuthSession()
    setCurrentUser(null)
    setStoredStudentId('')
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      storedStudentId,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
    }),
    [currentUser, storedStudentId, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Accesses the authentication context initialized by AuthProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
