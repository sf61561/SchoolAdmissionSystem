import { useState } from 'react'
import {
  formatRemainingTime,
  formatTimestamp,
  getEffectiveHoldStatus,
  getRemainingPercentage,
} from './studentUtils'

const STATUS_BADGE_MAP = {
  HELD: 'status-badge--held',
  CONFIRMED: 'status-badge--confirmed',
  EXPIRED: 'status-badge--expired',
  CANCELLED: 'status-badge--cancelled',
}

function MyHeldApplications({
  holds,
  nowMs,
  onConfirmHold,
  onCancelHold,
  onBrowseClasses,
}) {
  const [statusFilter, setStatusFilter] = useState('all')

  const enrichedHolds = holds.map((hold) => ({
    ...hold,
    effectiveStatus: getEffectiveHoldStatus(hold, nowMs),
  }))

  const filteredHolds = enrichedHolds.filter((hold) => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'closed') {
      return (
        hold.effectiveStatus === 'EXPIRED' ||
        hold.effectiveStatus === 'CANCELLED'
      )
    }
    return hold.effectiveStatus === statusFilter
  })

  return (
    <div className="student-page">
      <div className="classes-toolbar">
        <div className="filter-pills" role="group" aria-label="Filter applications">
          <button
            type="button"
            className={`filter-pill ${
              statusFilter === 'all' ? 'filter-pill--active' : ''
            }`}
            onClick={() => setStatusFilter('all')}
          >
            All ({enrichedHolds.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${
              statusFilter === 'HELD' ? 'filter-pill--active' : ''
            }`}
            onClick={() => setStatusFilter('HELD')}
          >
            Held (
            {enrichedHolds.filter((h) => h.effectiveStatus === 'HELD').length})
          </button>
          <button
            type="button"
            className={`filter-pill ${
              statusFilter === 'CONFIRMED' ? 'filter-pill--active' : ''
            }`}
            onClick={() => setStatusFilter('CONFIRMED')}
          >
            Confirmed (
            {
              enrichedHolds.filter((h) => h.effectiveStatus === 'CONFIRMED')
                .length
            }
            )
          </button>
          <button
            type="button"
            className={`filter-pill ${
              statusFilter === 'closed' ? 'filter-pill--active' : ''
            }`}
            onClick={() => setStatusFilter('closed')}
          >
            Expired / Cancelled (
            {
              enrichedHolds.filter(
                (h) =>
                  h.effectiveStatus === 'EXPIRED' ||
                  h.effectiveStatus === 'CANCELLED'
              ).length
            }
            )
          </button>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={onBrowseClasses}
        >
          Browse Classes
        </button>
      </div>

      {filteredHolds.length === 0 ? (
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
          <h3 className="student-empty-title">No applications found</h3>
          <p className="student-empty-text">
            You do not have any seat applications matching this filter yet.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={onBrowseClasses}
          >
            Apply for a Class
          </button>
        </div>
      ) : (
        <div className="holds-list">
          {filteredHolds.map((hold) => {
            const status = hold.effectiveStatus
            const isHeld = status === 'HELD'
            const isExpired = status === 'EXPIRED'
            const remainingPct = getRemainingPercentage(hold.expiresAt, nowMs)

            return (
              <article key={hold.holdId} className="hold-card">
                <div className="hold-card-top">
                  <div>
                    <h3 className="hold-card-title">{hold.className}</h3>
                    <p className="hold-card-sub">
                      <span className="hold-card-code">
                        Hold ID: {hold.holdId}
                      </span>
                      <span className="hold-card-code">
                        Class ID: {hold.classId}
                      </span>
                      <span>
                        Expires at: {formatTimestamp(hold.expiresAt)}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`status-badge ${
                      STATUS_BADGE_MAP[status] || 'status-badge--cancelled'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {(isHeld || isExpired) && (
                  <div className="hold-progress-wrap">
                    <div className="hold-progress-row">
                      <span>
                        {isExpired
                          ? 'Hold window expired — seat released automatically'
                          : 'Remaining time before automatic release'}
                      </span>
                      <span
                        className={`countdown-timer ${
                          isExpired ? 'countdown-timer--expired' : ''
                        }`}
                      >
                        {isExpired
                          ? '00:00'
                          : formatRemainingTime(hold.expiresAt, nowMs)}
                      </span>
                    </div>
                    <div className="hold-progress-track" aria-hidden="true">
                      <div
                        className="hold-progress-fill"
                        style={{ width: `${isExpired ? 0 : remainingPct}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="hold-card-actions">
                  <span className="hold-note">
                    {status === 'CONFIRMED' &&
                      'Admission fee received. Your seat is confirmed.'}
                    {status === 'HELD' &&
                      'Pay the admission fee before the timer ends to confirm your seat.'}
                    {status === 'EXPIRED' &&
                      'This hold expired. You can re-apply from the Classes page if seats remain.'}
                    {status === 'CANCELLED' &&
                      'Cancelled by student. Seat returned to available pool.'}
                  </span>

                  {(isHeld || isExpired) && (
                    <div className="hold-action-group">
                      <button
                        type="button"
                        className="btn-success"
                        disabled={!isHeld}
                        onClick={() => onConfirmHold(hold.holdId)}
                      >
                        Pay Admission Fee
                      </button>
                      {isHeld && (
                        <button
                          type="button"
                          className="btn-danger-outline"
                          onClick={() => onCancelHold(hold.holdId)}
                        >
                          Cancel Hold
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyHeldApplications
