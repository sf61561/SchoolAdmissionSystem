/**
 * Admin Dashboard view displaying only the Add Class action.
 */
function AdminDashboard({ onOpenAddClass, notice, onDismissNotice }) {
  return (
    <div className="admin-dashboard-only">
      {notice && (
        <div className="admin-alert admin-alert--success" role="status">
          <span>{notice}</span>
          <button
            type="button"
            className="admin-alert-close"
            onClick={onDismissNotice}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      <button
        type="button"
        className="admin-add-class-btn"
        onClick={onOpenAddClass}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Add Class</span>
      </button>
    </div>
  )
}

export default AdminDashboard
