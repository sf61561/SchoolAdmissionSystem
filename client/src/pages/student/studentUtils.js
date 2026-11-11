export const DEFAULT_HOLD_DURATION_SECONDS = 600

export function createInitialClasses() {
  return [
    {
      id: 'c_601',
      name: 'Class 6 - Morning Shift',
      totalSeats: 120,
      heldSeats: 15,
      confirmedSeats: 80,
      availableSeats: 25,
    },
    {
      id: 'c_602',
      name: 'Class 6 - Day Shift',
      totalSeats: 120,
      heldSeats: 8,
      confirmedSeats: 94,
      availableSeats: 18,
    },
    {
      id: 'c_701',
      name: 'Class 7 - Morning Shift',
      totalSeats: 100,
      heldSeats: 6,
      confirmedSeats: 72,
      availableSeats: 22,
    },
    {
      id: 'c_702',
      name: 'Class 7 - Day Shift',
      totalSeats: 100,
      heldSeats: 4,
      confirmedSeats: 96,
      availableSeats: 0,
    },
    {
      id: 'c_801',
      name: 'Class 8 - Morning Shift',
      totalSeats: 90,
      heldSeats: 5,
      confirmedSeats: 60,
      availableSeats: 25,
    },
    {
      id: 'c_901',
      name: 'Class 9 - Science (Morning)',
      totalSeats: 80,
      heldSeats: 10,
      confirmedSeats: 67,
      availableSeats: 3,
    },
  ]
}

export function createInitialHolds(studentId, referenceTimeMs) {
  return [
    {
      holdId: 'h_789',
      classId: 'c_601',
      className: 'Class 6 - Morning Shift',
      studentId,
      status: 'HELD',
      createdAt: new Date(referenceTimeMs - 90 * 1000).toISOString(),
      expiresAt: new Date(referenceTimeMs + 510 * 1000).toISOString(),
    },
  ]
}

export function getEffectiveHoldStatus(hold, nowMs) {
  if (hold.status === 'HELD' && new Date(hold.expiresAt).getTime() <= nowMs) {
    return 'EXPIRED'
  }
  return hold.status
}

export function formatRemainingTime(expiresAtIso, nowMs) {
  const diffMs = Math.max(0, new Date(expiresAtIso).getTime() - nowMs)
  const totalSeconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function getRemainingPercentage(expiresAtIso, nowMs) {
  const diffMs = Math.max(0, new Date(expiresAtIso).getTime() - nowMs)
  const totalMs = DEFAULT_HOLD_DURATION_SECONDS * 1000
  return Math.max(0, Math.min(100, Math.round((diffMs / totalMs) * 100)))
}

export function formatTimestamp(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

export function getClassAvailabilityMeta(availableSeats, totalSeats) {
  if (availableSeats <= 0) {
    return { label: 'Full', badgeClass: 'status-badge--full' }
  }
  if (totalSeats > 0 && availableSeats / totalSeats <= 0.15) {
    return { label: 'Filling Fast', badgeClass: 'status-badge--limited' }
  }
  return { label: 'Seats Open', badgeClass: 'status-badge--open' }
}
