import { isAdminUser } from './authUtils'

export const STORAGE_USER_KEY = 'school_admission_user'
export const STORAGE_STUDENT_ID_KEY = 'studentId'
const LEGACY_STUDENT_ID_KEY = 'school_admission_student_id'

export { isAdminUser }

/**
 * Resolves a trimmed student ID from a user payload or fallback value.
 */
export function resolveStudentId(user, fallbackId = '') {
  const candidate = user?.id ?? user?.Id ?? user?.studentId ?? fallbackId
  if (candidate === null || candidate === undefined) return ''
  return String(candidate).trim()
}

/**
 * Reads the persisted student ID from localStorage.
 */
export function getStoredStudentId() {
  try {
    return (
      localStorage.getItem(STORAGE_STUDENT_ID_KEY) ||
      localStorage.getItem(LEGACY_STUDENT_ID_KEY) ||
      ''
    )
  } catch {
    return ''
  }
}

/**
 * Reads the persisted user session from localStorage.
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const studentId = !isAdminUser(parsed)
      ? resolveStudentId(parsed, getStoredStudentId())
      : resolveStudentId(parsed)
    return studentId && !parsed.id ? { ...parsed, id: studentId } : parsed
  } catch {
    return null
  }
}

/**
 * Persists the logged-in user in localStorage, and stores studentId for student accounts.
 * Returns the normalized user object with guaranteed id when available.
 */
export function saveAuthSession(user, fallbackId = '') {
  const adminSession = isAdminUser(user)
  const resolvedId = resolveStudentId(user, adminSession ? '' : fallbackId)
  const normalizedUser =
    user && typeof user === 'object'
      ? {
          ...user,
          ...(resolvedId ? { id: resolvedId } : {}),
        }
      : user

  try {
    if (normalizedUser) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(normalizedUser))
    }
    if (adminSession) {
      localStorage.removeItem(STORAGE_STUDENT_ID_KEY)
      localStorage.removeItem(LEGACY_STUDENT_ID_KEY)
    } else if (resolvedId) {
      localStorage.setItem(STORAGE_STUDENT_ID_KEY, resolvedId)
      localStorage.removeItem(LEGACY_STUDENT_ID_KEY)
    }
  } catch {
    // Ignore storage quota errors
  }

  return normalizedUser
}

/**
 * Clears all persisted authentication and student ID entries from localStorage.
 */
export function clearAuthSession() {
  try {
    localStorage.removeItem(STORAGE_USER_KEY)
    localStorage.removeItem(STORAGE_STUDENT_ID_KEY)
    localStorage.removeItem(LEGACY_STUDENT_ID_KEY)
  } catch {
    // Ignore storage errors
  }
}
