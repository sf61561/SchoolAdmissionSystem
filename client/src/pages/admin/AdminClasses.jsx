import { useState } from 'react'
import { getClassAvailabilityMeta } from './adminUtils'

const AVAILABILITY_BADGE_CLASS = {
  open: 'admin-badge--success',
  limited: 'admin-badge--warning',
  full: 'admin-badge--danger',
}

/**
 * Admin Classes management view listing class capacities and seat occupancy.
 */
function AdminClasses({ classes, onOpenAddClass }) {
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredClasses = normalizedQuery
    ? classes.filter((item) =>
        item.name.toLowerCase().includes(normalizedQuery)
      )
    : classes

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Classes</h2>
          <p className="admin-page-subtitle">
            Manage class shifts and monitor total, held, confirmed, and available seats.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={onOpenAddClass}
        >
          <svg
            width="16"
            height="16"
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

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-search-input"
          placeholder="Search classes..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search classes"
        />
      </div>

      <div className="admin-table-card">
        {filteredClasses.length === 0 ? (
          <div className="admin-empty-state">
            No classes match &ldquo;{searchQuery.trim()}&rdquo;.
          </div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Class Name</th>
                  <th>Total Seats</th>
                  <th>Held</th>
                  <th>Confirmed</th>
                  <th>Available</th>
                  <th>Occupancy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((item) => {
                  const availability = getClassAvailabilityMeta(item.availableSeats)
                  const occupiedSeats = item.heldSeats + item.confirmedSeats
                  const occupancyPercent =
                    item.totalSeats > 0
                      ? Math.min(100, Math.round((occupiedSeats / item.totalSeats) * 100))
                      : 0

                  return (
                    <tr key={item.id}>
                      <td className="admin-cell-mono">#{item.id}</td>
                      <td className="admin-cell-strong">{item.name}</td>
                      <td>{item.totalSeats}</td>
                      <td>{item.heldSeats}</td>
                      <td>{item.confirmedSeats}</td>
                      <td className="admin-cell-strong">{item.availableSeats}</td>
                      <td>
                        <div className="admin-capacity-cell">
                          <div className="admin-capacity-track" aria-hidden="true">
                            <div
                              className="admin-capacity-fill"
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                          <span className="admin-cell-muted">{occupancyPercent}%</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`admin-badge ${
                            AVAILABILITY_BADGE_CLASS[availability.tone] ||
                            'admin-badge--neutral'
                          }`}
                        >
                          {availability.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminClasses
