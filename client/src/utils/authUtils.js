/**
 * Returns true when the user payload represents an Admin role (0 or 'Admin').
 */
export function isAdminUser(user) {
  const role = user?.role ?? user?.Role
  return role === 0 || String(role ?? '').toLowerCase() === 'admin'
}

/**
 * Resolves the default dashboard path based on the authenticated user's role.
 */
export function getDashboardPathForUser(user) {
  return isAdminUser(user) ? '/admin/dashboard' : '/student/dashboard'
}
