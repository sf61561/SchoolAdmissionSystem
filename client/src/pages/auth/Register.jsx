import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../../services/authService'

const PASSWORD_RULES = [
  { key: 'length', label: '8+ characters', test: (value) => value.length >= 8 },
  { key: 'upper', label: 'Uppercase (A-Z)', test: (value) => /[A-Z]/.test(value) },
  { key: 'lower', label: 'Lowercase (a-z)', test: (value) => /[a-z]/.test(value) },
  { key: 'number', label: 'Number (0-9)', test: (value) => /\d/.test(value) },
  {
    key: 'special',
    label: 'Special (@$!%*?&)',
    test: (value) => /[@$!%*?&]/.test(value),
  },
]

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [registeredUser, setRegisteredUser] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setApiError('')
    setRegisteredUser(null)
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    } else if (formData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Full name must be at least 2 characters.'
    }

    if (!formData.studentId.trim()) {
      nextErrors.studentId = 'Student ID is required.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required.'
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      const allRulesMet = PASSWORD_RULES.every((rule) =>
        rule.test(formData.password)
      )
      nextErrors.password = allRulesMet
        ? 'Password may only use letters, numbers, and @$!%*?& characters.'
        : 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&).'
    }

    return nextErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setApiError('')
      setRegisteredUser(null)
      return
    }

    setErrors({})
    setApiError('')
    setIsSubmitting(true)

    try {
      const createdUser = await registerUser({
        id: formData.studentId.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })

      setRegisteredUser(createdUser)
      setFormData({
        fullName: '',
        studentId: '',
        email: '',
        password: '',
      })
    } catch (error) {
      setRegisteredUser(null)
      setApiError(error.message || 'Unable to create account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const showRules =
    passwordFocused || formData.password.length > 0 || Boolean(errors.password)

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
          <label className="auth-label" htmlFor="register-fullname">
            Full Name
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="register-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="e.g. Syed Fahad"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={
                errors.fullName ? 'register-fullname-error' : undefined
              }
              className={`auth-input ${errors.fullName ? 'auth-input--error' : ''}`}
            />
          </div>
          {errors.fullName && (
            <p id="register-fullname-error" className="auth-error-msg" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="auth-field">
          <div className="auth-label-row">
            <label className="auth-label" htmlFor="register-student-id">
              Student ID
            </label>
            <span className="auth-label-hint">Text ID</span>
          </div>
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
              id="register-student-id"
              name="studentId"
              type="text"
              autoComplete="username"
              placeholder="e.g. 20152691234567891"
              value={formData.studentId}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.studentId)}
              aria-describedby={
                errors.studentId ? 'register-student-id-error' : undefined
              }
              className={`auth-input ${
                errors.studentId ? 'auth-input--error' : ''
              }`}
            />
          </div>
          {errors.studentId && (
            <p
              id="register-student-id-error"
              className="auth-error-msg"
              role="alert"
            >
              {errors.studentId}
            </p>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-email">
            Email
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
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. student@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'register-email-error' : undefined}
              className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
            />
          </div>
          {errors.email && (
            <p id="register-email-error" className="auth-error-msg" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-password">
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
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? 'register-password-error' : undefined
              }
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
            <p id="register-password-error" className="auth-error-msg" role="alert">
              {errors.password}
            </p>
          )}

          {showRules && (
            <div className="auth-password-rules" aria-label="Password requirements">
              {PASSWORD_RULES.map((rule) => {
                const met = rule.test(formData.password)
                return (
                  <span
                    key={rule.key}
                    className={`auth-rule-item ${met ? 'auth-rule-item--met' : ''}`}
                  >
                    <span className="auth-rule-dot" aria-hidden="true" />
                    {rule.label}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
          {isSubmitting && <span className="auth-spinner" aria-hidden="true" />}
          <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
        </button>

        {registeredUser && (
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
                Account created
              </p>
              <Link to="/login" className="auth-status-clear-btn">
                Go to Sign In
              </Link>
            </div>
            <p className="auth-status-detail">
              Your student account has been registered on the server.
            </p>
            <div className="auth-status-meta">
              <div>Full Name: {registeredUser.fullName}</div>
              <div>Student ID: {registeredUser.id}</div>
              <div>Email: {registeredUser.email}</div>
            </div>
          </div>
        )}
    </form>
  )
}

export default Register
