const DEFAULT_STUDENT_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'classes',
    label: 'Classes',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M8 7h8" />
        <path d="M8 11h6" />
      </svg>
    ),
  },
  {
    id: 'holds',
    label: 'My Held Application',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </svg>
    ),
  },
]

function Sidebar({
  activeTab,
  onSelectTab,
  onLogout,
  navItems = DEFAULT_STUDENT_NAV_ITEMS,
  brandTitle = 'School Admission',
  brandSubtitle = 'Student Panel',
  heldCount = 0,
  isOpen = false,
  onClose,
}) {
  const handleNavClick = (tabId) => {
    onSelectTab(tabId)
    if (onClose) onClose()
  }

  return (
    <>
      {isOpen && (
        <div
          className="student-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`student-sidebar ${isOpen ? 'student-sidebar--open' : ''}`}
        aria-label={`${brandSubtitle} navigation`}
      >
        <div className="student-sidebar-header">
          <div className="student-sidebar-brand">
            <span className="student-sidebar-logo" aria-hidden="true">
              <svg
                width="20"
                height="20"
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
              <div className="student-sidebar-title">{brandTitle}</div>
              <span className="student-sidebar-tag">{brandSubtitle}</span>
            </div>
          </div>

          <button
            type="button"
            className="student-sidebar-close"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="student-sidebar-nav" aria-label="Primary sections">
          <div className="student-nav-label">Menu</div>
          <ul className="student-nav-list">
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              const badgeCount =
                item.badgeCount ?? (item.id === 'holds' ? heldCount : 0)

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`student-nav-item ${
                      isActive ? 'student-nav-item--active' : ''
                    }`}
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="student-nav-icon">{item.icon}</span>
                    <span className="student-nav-text">{item.label}</span>
                    {badgeCount > 0 && (
                      <span className="student-nav-badge">{badgeCount}</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="student-sidebar-footer">
          <button
            type="button"
            className="student-logout-btn"
            onClick={onLogout}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
