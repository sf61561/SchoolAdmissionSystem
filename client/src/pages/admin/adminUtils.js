import {
  createInitialClasses,
  formatTimestamp,
  getClassAvailabilityMeta,
} from '../student/studentUtils'

export const STUDENT_STATUS_FILTERS = [
  { id: 'ALL', label: 'All' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'HELD', label: 'Held' },
  { id: 'REGISTERED', label: 'Registered' },
  { id: 'EXPIRED', label: 'Expired' },
]

const STATUS_BADGE_MAP = {
  CONFIRMED: { label: 'Confirmed', tone: 'success' },
  HELD: { label: 'Held', tone: 'warning' },
  REGISTERED: { label: 'Registered', tone: 'neutral' },
  EXPIRED: { label: 'Expired', tone: 'danger' },
}

/**
 * Provides initial seeded classes for the Admin Portal preview.
 */
export function createInitialAdminClasses() {
  return createInitialClasses()
}

/**
 * Provides initial mock student records matching the admission domain model.
 */
export function createInitialAdminStudents() {
  return [
    {
      id: '20152691234567891',
      fullName: 'Syed Fahad',
      email: 'www.sf61561@gmail.com',
      className: 'Class 6 - Morning Shift',
      status: 'HELD',
      updatedAt: '2026-11-11T09:15:00Z',
    },
    {
      id: '20152691234567892',
      fullName: 'Nusrat Jahan',
      email: 'nusrat.jahan@example.com',
      className: 'Class 6 - Day Shift',
      status: 'CONFIRMED',
      updatedAt: '2026-11-11T08:40:00Z',
    },
    {
      id: '20152691234567893',
      fullName: 'Tanvir Ahmed',
      email: 'tanvir.ahmed@example.com',
      className: 'Class 7 - Morning Shift',
      status: 'CONFIRMED',
      updatedAt: '2026-11-10T16:20:00Z',
    },
    {
      id: '20152691234567894',
      fullName: 'Mahira Rahman',
      email: 'mahira.rahman@example.com',
      className: 'Class 8 - Morning Shift',
      status: 'EXPIRED',
      updatedAt: '2026-11-10T14:05:00Z',
    },
    {
      id: '20152691234567895',
      fullName: 'Rakibul Hasan',
      email: 'rakibul.hasan@example.com',
      className: '—',
      status: 'REGISTERED',
      updatedAt: '2026-11-10T11:30:00Z',
    },
  ]
}

/**
 * Validates class creation form inputs against existing classes.
 */
export function validateNewClassInput({ name, totalSeats }, existingClasses) {
  const errors = {}
  const trimmedName = (name || '').trim()
  const parsedSeats = Number(totalSeats)

  if (!trimmedName) {
    errors.name = 'Class name is required.'
  } else if (trimmedName.length < 2) {
    errors.name = 'Class name must be at least 2 characters.'
  } else if (
    existingClasses.some(
      (item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase()
    )
  ) {
    errors.name = 'A class with this name already exists.'
  }

  if (totalSeats === '' || totalSeats === null || totalSeats === undefined) {
    errors.totalSeats = 'Total seats is required.'
  } else if (!Number.isInteger(parsedSeats) || parsedSeats < 1) {
    errors.totalSeats = 'Total seats must be a whole number of at least 1.'
  } else if (parsedSeats > 1000) {
    errors.totalSeats = 'Total seats cannot exceed 1000.'
  }

  return errors
}

/**
 * Builds a new local class object ready for AdminPortal state.
 */
export function createClassRecord({ name, totalSeats }, existingClasses) {
  const maxId = existingClasses.reduce(
    (max, item) => (typeof item.id === 'number' && item.id > max ? item.id : max),
    0
  )
  const seats = Number(totalSeats)
  return {
    id: maxId + 1,
    name: name.trim(),
    totalSeats: seats,
    heldSeats: 0,
    confirmedSeats: 0,
    availableSeats: seats,
  }
}

/**
 * Returns display badge metadata for a student application status.
 */
export function getStudentStatusMeta(status) {
  return STATUS_BADGE_MAP[status] || { label: status || 'Unknown', tone: 'neutral' }
}

export { formatTimestamp, getClassAvailabilityMeta }
