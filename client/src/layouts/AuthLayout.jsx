import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import '../pages/auth/Auth.css'

const AUTH_PAGE_META = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in as Admin or Student with your ID or email.',
    heroKicker: 'Portal Sign In',
    heroTitle: 'Access your admission portal',
    heroCopy:
      'Sign in with your ID or email address to open the Admin management console or your Student admission dashboard.',
    footerText: "Don't have an account?",
    footerActionLabel: 'Create an account',
    footerTo: '/register',
  },
  register: {
    title: 'Create student account',
    subtitle: 'Enter your details below to register for admission.',
    heroKicker: 'New Student Registration',
    heroTitle: 'Start your admission application',
    heroCopy:
      'Register your student profile with your Full Name, Student ID, Email, and a strong password to get started.',
    footerText: 'Already have an account?',
    footerActionLabel: 'Sign in',
    footerTo: '/login',
  },
}

/**
 * Shared authentication layout rendering branding, navigation tabs, and nested page via Outlet.
 */
function AuthLayout() {
  const { pathname } = useLocation()
  const isRegister = pathname.toLowerCase().startsWith('/register')
  const meta = isRegister ? AUTH_PAGE_META.register : AUTH_PAGE_META.login

  return (
    <main className="auth-shell">
      <section className="auth-brand-panel" aria-label="Portal overview">
        <div className="auth-brand-top">
          <div className="auth-logo-row">
            <span className="auth-logo-badge" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
              </svg>
            </span>
            <div>
              <div className="auth-brand-name">School Admission System</div>
              <span className="auth-brand-sub">Admissions &amp; Admin Portal</span>
            </div>
          </div>

          <div className="auth-brand-hero">
            <span className="auth-brand-kicker">{meta.heroKicker}</span>
            <h1 className="auth-brand-title">{meta.heroTitle}</h1>
            <p className="auth-brand-copy">{meta.heroCopy}</p>
          </div>

          <ul className="auth-feature-list">
            <li className="auth-feature-item">
              <span className="auth-feature-icon" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Register using your official Student ID and email</span>
            </li>
            <li className="auth-feature-item">
              <span className="auth-feature-icon" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Browse available classes and reserve admission seats</span>
            </li>
            <li className="auth-feature-item">
              <span className="auth-feature-icon" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Track your seat holds and admission progress in one place</span>
            </li>
          </ul>
        </div>

        <div className="auth-brand-footer">
          Academic Admissions &bull; Admin &amp; Student Portal
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <span className="auth-mobile-logo" aria-hidden="true">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
              </svg>
            </span>
            <span className="auth-mobile-title">School Admission System</span>
          </div>

          <nav className="auth-tabs" aria-label="Authentication pages">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `auth-tab ${isActive ? 'auth-tab--active' : ''}`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `auth-tab ${isActive ? 'auth-tab--active' : ''}`
              }
            >
              Register
            </NavLink>
          </nav>

          <header className="auth-header">
            <h2 className="auth-title">{meta.title}</h2>
            <p className="auth-subtitle">{meta.subtitle}</p>
          </header>

          <Outlet />

          <footer className="auth-footer">
            <span>{meta.footerText}</span>
            <Link to={meta.footerTo} className="auth-switch-link">
              {meta.footerActionLabel}
            </Link>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
