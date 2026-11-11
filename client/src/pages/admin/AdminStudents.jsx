import { useState } from 'react'
import {
  STUDENT_STATUS_FILTERS,
  formatTimestamp,
  getStudentStatusMeta,
} from './adminUtils'

const STATUS_BADGE_CLASS = {
  success: 'admin-badge--success',
  warning: 'admin-badge--warning',
  danger: 'admin-badge--danger',
  neutral: 'admin-badge--neutral',
}

/**
 * Admin Students view listing registered students and seat application statuses.
 */
function AdminStudents({ students }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredStudents = students.filter((student) => {
    const matchesStatus =
      statusFilter === 'ALL' || student.status === statusFilter
    if (!matchesStatus) return false

    if (!normalizedQuery) return true
    return (
      student.fullName.toLowerCase().includes(normalizedQuery) ||
      student.id.toLowerCase().includes(normalizedQuery) ||
      student.email.toLowerCase().includes(normalizedQuery) ||
      student.className.toLowerCase().includes(normalizedQuery)
    )
  })

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Students</h2>
          <p className="admin-page-subtitle">
            View registered students and their current seat application status.
          </p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-search-input"
          placeholder="Search by name, ID, email, or class..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search students"
        />

        <div className="admin-filter-group" role="group" aria-label="Filter by status">
          {STUDENT_STATUS_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`admin-filter-pill ${
                statusFilter === filter.id ? 'admin-filter-pill--active' : ''
              }`}
              onClick={() => setStatusFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-card">
        {filteredStudents.length === 0 ? (
          <div className="admin-empty-state">
            No students match the current search or filter.
          </div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const statusMeta = getStudentStatusMeta(student.status)
                  return (
                    <tr key={student.id}>
                      <td className="admin-cell-mono">{student.id}</td>
                      <td className="admin-cell-strong">{student.fullName}</td>
                      <td className="admin-cell-muted">{student.email}</td>
                      <td>{student.className}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            STATUS_BADGE_CLASS[statusMeta.tone] ||
                            'admin-badge--neutral'
                          }`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="admin-cell-muted">
                        {formatTimestamp(student.updatedAt)}
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

export default AdminStudents
