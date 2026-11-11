import { getStoredStudentId, resolveStudentId } from '../../utils/authStorage'

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'ST'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Navbar({
  title,
  subtitle,
  titleOnly = false,
  user,
  isPreview = false,
  onMenuClick,
  onGoToLogin,
}) {
  const displayName = user?.fullName || 'Student'
  const studentId =
    resolveStudentId(user, getStoredStudentId()) || '20152691234567891'

  return (
    <header className="student-navbar">
      <div className="student-navbar-left">
        <button
          type="button"
          className="student-menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="student-navbar-heading">
          <h1 className="student-navbar-title">{title}</h1>
          {!titleOnly && subtitle && (
            <p className="student-navbar-subtitle">{subtitle}</p>
          )}
        </div>
      </div>

      {!titleOnly && (
        <div className="student-navbar-right">
          <div className="student-id-pill" title="Student ID">
            <span className="student-id-label">Student ID</span>
            <span className="student-id-value">{studentId}</span>
          </div>

          {isPreview && onGoToLogin && (
            <button
              type="button"
              className="student-preview-signin"
              onClick={onGoToLogin}
            >
              Sign In
            </button>
          )}

          <div className="student-user-chip">
            <span className="student-avatar" aria-hidden="true">
              {getInitials(displayName)}
            </span>
            <div className="student-user-meta">
              <span className="student-user-name">{displayName}</span>
              <span className="student-user-role">
                {isPreview ? 'Preview Mode' : 'Student Portal'}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
