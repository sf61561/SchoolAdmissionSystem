import { useState } from 'react'
import {
  getClassAvailabilityMeta,
  getEffectiveHoldStatus,
} from './studentUtils'

function StudentClasses({
  classes,
  holds,
  nowMs,
  onApplyForClass,
  onGoToHolds,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())

    if (!matchesSearch) return false
    if (availabilityFilter === 'open') return cls.availableSeats > 0
    if (availabilityFilter === 'full') return cls.availableSeats <= 0
    return true
  })

  return (
    <div className="student-page">
      <div className="classes-toolbar">
        <div className="classes-search-wrap">
          <span className="classes-search-icon" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            className="classes-search-input"
            placeholder="Search classes or shifts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search classes or shifts"
          />
        </div>

        <div className="filter-pills" role="group" aria-label="Filter by availability">
          <button
            type="button"
            className={`filter-pill ${
              availabilityFilter === 'all' ? 'filter-pill--active' : ''
            }`}
            onClick={() => setAvailabilityFilter('all')}
          >
            All Classes ({classes.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${
              availabilityFilter === 'open' ? 'filter-pill--active' : ''
            }`}
            onClick={() => setAvailabilityFilter('open')}
          >
            Seats Available
          </button>
          <button
            type="button"
            className={`filter-pill ${
              availabilityFilter === 'full' ? 'filter-pill--active' : ''
            }`}
            onClick={() => setAvailabilityFilter('full')}
          >
            Full
          </button>
        </div>
      </div>

      {filteredClasses.length === 0 ? (
        <div className="student-empty">
          <h3 className="student-empty-title">No matching classes</h3>
          <p className="student-empty-text">
            Try clearing your search query or switching the availability filter.
          </p>
        </div>
      ) : (
        <div className="classes-grid">
          {filteredClasses.map((cls) => {
            const existingHold = holds.find((hold) => {
              if (hold.classId !== cls.id) return false
              const status = getEffectiveHoldStatus(hold, nowMs)
              return status === 'HELD' || status === 'CONFIRMED'
            })

            const existingStatus = existingHold
              ? getEffectiveHoldStatus(existingHold, nowMs)
              : null

            const availability = getClassAvailabilityMeta(
              cls.availableSeats,
              cls.totalSeats
            )

            const confirmedPct =
              cls.totalSeats > 0 ? (cls.confirmedSeats / cls.totalSeats) * 100 : 0
            const heldPct =
              cls.totalSeats > 0 ? (cls.heldSeats / cls.totalSeats) * 100 : 0

            return (
              <article key={cls.id} className="class-card">
                <div className="class-card-header">
                  <div>
                    <h3 className="class-card-title">{cls.name}</h3>
                    <span className="class-card-id">Class ID: {cls.id}</span>
                  </div>
                  <span className={`status-badge ${availability.badgeClass}`}>
                    {availability.label}
                  </span>
                </div>

                <div>
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
                  <div className="class-card-legend" style={{ marginTop: '0.45rem' }}>
                    <span className="legend-item">
                      <span className="legend-dot legend-dot--confirmed" />
                      Confirmed
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot legend-dot--held" />
                      Held
                    </span>
                  </div>
                </div>

                <div className="class-seat-metrics">
                  <div className="class-seat-box">
                    <span className="class-seat-label">Total Seats</span>
                    <span className="class-seat-num">{cls.totalSeats}</span>
                  </div>
                  <div className="class-seat-box class-seat-box--highlight">
                    <span className="class-seat-label">Available</span>
                    <span className="class-seat-num">{cls.availableSeats}</span>
                  </div>
                  <div className="class-seat-box">
                    <span className="class-seat-label">Held</span>
                    <span className="class-seat-num">{cls.heldSeats}</span>
                  </div>
                  <div className="class-seat-box">
                    <span className="class-seat-label">Confirmed</span>
                    <span className="class-seat-num">{cls.confirmedSeats}</span>
                  </div>
                </div>

                {existingStatus === 'CONFIRMED' ? (
                  <button type="button" className="btn-success" disabled>
                    Admission Confirmed
                  </button>
                ) : existingStatus === 'HELD' ? (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={onGoToHolds}
                  >
                    View Active Hold
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={cls.availableSeats <= 0}
                    onClick={() => onApplyForClass(cls.id)}
                  >
                    {cls.availableSeats <= 0 ? 'No Seats Available' : 'Apply / Hold Seat'}
                  </button>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StudentClasses
