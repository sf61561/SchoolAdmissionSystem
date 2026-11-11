import {
  formatRemainingTime,
  getClassAvailabilityMeta,
  getEffectiveHoldStatus,
} from './studentUtils'

function StudentDashboard({
  user,
  classes,
  holds,
  nowMs,
  onNavigate,
  onConfirmHold,
  onCancelHold,
}) {
  const openClassesCount = classes.filter((item) => item.availableSeats > 0).length
  const totalAvailableSeats = classes.reduce(
    (sum, item) => sum + item.availableSeats,
    0
  )

  const activeHolds = holds.filter(
    (hold) => getEffectiveHoldStatus(hold, nowMs) === 'HELD'
  )
  const confirmedHolds = holds.filter(
    (hold) => getEffectiveHoldStatus(hold, nowMs) === 'CONFIRMED'
  )

  const primaryHold = activeHolds[0] || null
  const firstName = (user?.fullName || 'Student').split(/\s+/)[0]

  return (
    <div className="student-page">
      <section className="student-hero">
        <div className="student-hero-copy">
          <span className="student-hero-kicker">First-Come, First-Served Admission</span>
          <h2 className="student-hero-title">Welcome back, {firstName}</h2>
          <p className="student-hero-text">
            Reserve an available class seat in real time and pay your admission fee
            before the hold timer expires to confirm your seat.
          </p>
        </div>

        <div className="student-hero-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => onNavigate('classes')}
          >
            Browse Classes
          </button>
          <button
            type="button"
            className="btn-hero-secondary"
            onClick={() => onNavigate('holds')}
          >
            My Held Application
          </button>
        </div>
      </section>

      <section className="student-stats-grid" aria-label="Admission overview metrics">
        <article className="student-stat-card">
          <div>
            <span className="student-stat-label">Open Classes</span>
            <p className="student-stat-value">{openClassesCount}</p>
            <span className="student-stat-hint">
              Out of {classes.length} active shifts
            </span>
          </div>
          <span className="student-stat-icon student-stat-icon--blue" aria-hidden="true">
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
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </span>
        </article>

        <article className="student-stat-card">
          <div>
            <span className="student-stat-label">Available Seats</span>
            <p className="student-stat-value">{totalAvailableSeats}</p>
            <span className="student-stat-hint">Across all open class shifts</span>
          </div>
          <span
            className="student-stat-icon student-stat-icon--indigo"
            aria-hidden="true"
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
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
        </article>

        <article className="student-stat-card">
          <div>
            <span className="student-stat-label">Active Seat Holds</span>
            <p className="student-stat-value">{activeHolds.length}</p>
            <span className="student-stat-hint">Awaiting admission fee payment</span>
          </div>
          <span className="student-stat-icon student-stat-icon--amber" aria-hidden="true">
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
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
          </span>
        </article>

        <article className="student-stat-card">
          <div>
            <span className="student-stat-label">Confirmed Seats</span>
            <p className="student-stat-value">{confirmedHolds.length}</p>
            <span className="student-stat-hint">Completed admissions</span>
          </div>
          <span
            className="student-stat-icon student-stat-icon--emerald"
            aria-hidden="true"
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
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </span>
        </article>
      </section>

      <section className="student-dashboard-grid">
        <div className="student-panel">
          <div className="student-panel-header">
            <h3 className="student-panel-title">Active Held Application</h3>
            <button
              type="button"
              className="student-panel-link"
              onClick={() => onNavigate('holds')}
            >
              View all applications
            </button>
          </div>

          {primaryHold ? (
            <div className="spotlight-card">
              <div className="spotlight-top">
                <div>
                  <h4 className="spotlight-class-name">{primaryHold.className}</h4>
                  <span className="spotlight-meta">
                    Hold ID: {primaryHold.holdId}
                  </span>
                </div>
                <span className="status-badge status-badge--held">HELD</span>
              </div>

              <div className="countdown-box">
                <span>Time remaining to pay fee</span>
                <span className="countdown-timer">
                  {formatRemainingTime(primaryHold.expiresAt, nowMs)}
                </span>
              </div>

              <div className="spotlight-actions">
                <button
                  type="button"
                  className="btn-success"
                  onClick={() => onConfirmHold(primaryHold.holdId)}
                >
                  Pay Admission Fee
                </button>
                <button
                  type="button"
                  className="btn-danger-outline"
                  onClick={() => onCancelHold(primaryHold.holdId)}
                >
                  Cancel Hold
                </button>
              </div>
            </div>
          ) : (
            <div className="student-empty">
              <span className="student-empty-icon" aria-hidden="true">
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
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 14" />
                </svg>
              </span>
              <h4 className="student-empty-title">No active seat hold</h4>
              <p className="student-empty-text">
                Select an available class shift from the Classes page to hold your
                admission seat.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate('classes')}
              >
                Explore Classes
              </button>
            </div>
          )}
        </div>

        <div className="student-panel">
          <div className="student-panel-header">
            <h3 className="student-panel-title">Class Seat Availability</h3>
            <button
              type="button"
              className="student-panel-link"
              onClick={() => onNavigate('classes')}
            >
              See all classes
            </button>
          </div>

          <div className="snapshot-list">
            {classes.slice(0, 4).map((cls) => {
              const confirmedPct =
                cls.totalSeats > 0 ? (cls.confirmedSeats / cls.totalSeats) * 100 : 0
              const heldPct =
                cls.totalSeats > 0 ? (cls.heldSeats / cls.totalSeats) * 100 : 0
              const availability = getClassAvailabilityMeta(
                cls.availableSeats,
                cls.totalSeats
              )

              return (
                <div key={cls.id} className="snapshot-row">
                  <div className="snapshot-row-top">
                    <span className="snapshot-name">{cls.name}</span>
                    <span className={`status-badge ${availability.badgeClass}`}>
                      {cls.availableSeats} / {cls.totalSeats} open
                    </span>
                  </div>
                  <div className="capacity-bar" aria-hidden="true">
                    <div
                      className="capacity-confirmed"
                      style={{ width: `${confirmedPct}%` }}
                    />
                    <div
                      className="capacity-held"
                      style={{ width: `${heldPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default StudentDashboard
