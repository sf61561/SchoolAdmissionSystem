import { useState } from 'react'
import { loginUser } from '../../services/authService'
import {
  clearAuthSession,
  getStoredUser,
  isAdminUser,
  saveAuthSession,
} from '../../utils/authStorage'

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(() => getStoredUser())

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setApiError('')
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.identifier.trim()) {
      nextErrors.identifier = 'Student ID or email is required.'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    }

    return nextErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setApiError('')
      return
    }

    setErrors({})
    setApiError('')
    setIsSubmitting(true)

    try {
      const submittedIdentifier = formData.identifier.trim()
      const user = await loginUser({
        identifier: submittedIdentifier,
        password: formData.password,
      })
      const savedUser = saveAuthSession(user)
      setLoggedInUser(savedUser)
      if (onLoginSuccess) {
        onLoginSuccess(savedUser)
      }
    } catch (error) {
      setLoggedInUser(null)
      setApiError(error.message || 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearSession = () => {
    setLoggedInUser(null)
    clearAuthSession()
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {apiError && (
          <div className="auth-api-error" role="alert">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{apiError}</span>
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-identifier">
            Student ID or Email
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="7" y1="9" x2="17" y2="9" />
                <line x1="7" y1="13" x2="13" y2="13" />
              </svg>
            </span>
            <input
              id="login-identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              placeholder="e.g. 20152691234567891 or name@school.edu"
              value={formData.identifier}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.identifier)}
              aria-describedby={errors.identifier ? 'login-identifier-error' : undefined}
              className={`auth-input ${errors.identifier ? 'auth-input--error' : ''}`}
            />
          </div>
          {errors.identifier && (
            <p id="login-identifier-error" className="auth-error-msg" role="alert">
              {errors.identifier}
            </p>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-password">
            Password
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              className={`auth-input auth-input--password ${
                errors.password ? 'auth-input--error' : ''
              }`}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isSubmitting}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p id="login-password-error" className="auth-error-msg" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
          {isSubmitting && <span className="auth-spinner" aria-hidden="true" />}
          <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
        </button>

        {loggedInUser && (
          <div className="auth-status-banner" role="status">
            <div className="auth-status-header">
              <p className="auth-status-title">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Signed in successfully
              </p>
              <button
                type="button"
                className="auth-status-clear-btn"
                onClick={handleClearSession}
              >
                Sign out
              </button>
            </div>
            <p className="auth-status-detail">
              Authenticated with the server and saved your session locally.
            </p>
            <div className="auth-status-meta">
              <div>Full Name: {loggedInUser.fullName}</div>
              <div>
                {isAdminUser(loggedInUser) ? 'Admin ID' : 'Student ID'}:{' '}
                {loggedInUser.id}
              </div>
              <div>Email: {loggedInUser.email}</div>
              <div>Role: {isAdminUser(loggedInUser) ? 'Admin' : 'Student'}</div>
            </div>
          </div>
        )}
    </form>
  )
}

export default Login
