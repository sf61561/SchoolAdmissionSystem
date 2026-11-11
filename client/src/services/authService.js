const RAW_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '')

async function parseErrorMessage(response, fallbackAction = 'Request failed') {
  if (response.status === 401) {
    return 'Invalid ID/Email or password.'
  }

  let data = null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json') || contentType.includes('application/problem+json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  } else {
    try {
      const text = await response.text()
      if (text.trim()) {
        return text.trim()
      }
    } catch {
      // Ignore body read error and fall back to status message
    }
  }

  if (data) {
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message
    }
    if (typeof data.detail === 'string' && data.detail.trim()) {
      return data.detail
    }
    if (data.errors && typeof data.errors === 'object') {
      const firstFieldErrors = Object.values(data.errors).flat()
      if (firstFieldErrors.length > 0 && typeof firstFieldErrors[0] === 'string') {
        return firstFieldErrors[0]
      }
    }
    if (typeof data.title === 'string' && data.title.trim()) {
      return data.title
    }
  }

  if (response.status === 404) {
    return 'User not found.'
  }

  return `${fallbackAction} (HTTP ${response.status}).`
}

async function postJson(path, payload, fallbackAction) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(
      `Unable to connect to the server at ${API_BASE_URL}. Please make sure the backend is running.`
    )
  }

  if (!response.ok) {
    const errorMessage = await parseErrorMessage(response, fallbackAction)
    throw new Error(errorMessage)
  }

  return response.json()
}

/**
 * Authenticates an admin or student user against POST /login.
 * Sends { Id, Email, password } matching LoginUserDto.
 */
export function loginUser({ identifier, id, email, password }) {
  const normalizedIdentifier = (identifier ?? id ?? email ?? '').trim()
  const resolvedId = (id ?? normalizedIdentifier).trim()
  const resolvedEmail = (email ?? normalizedIdentifier).trim()

  return postJson(
    '/login',
    {
      Id: resolvedId,
      Email: resolvedEmail,
      password,
    },
    'Login failed'
  )
}

/**
 * Registers a new student user against POST /register.
 * Sends { id, FullName, Email, Password } matching CreateUserDto.
 */
export function registerUser({ id, fullName, email, password }) {
  return postJson(
    '/register',
    {
      id,
      FullName: fullName,
      Email: email,
      Password: password,
    },
    'Registration failed'
  )
}
