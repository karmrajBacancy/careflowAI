const TOKEN_KEY = 'careflow_token'
const USER_KEY = 'careflow_user'

export function login(token, username, role, hospitalId = null, hospitalName = null) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify({ username, role, hospitalId, hospitalName }))
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.location.href = '/'
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function isAuthenticated() {
  return !!getToken()
}

export function isSuperAdmin() {
  const user = getUser()
  return user?.role === 'super_admin'
}

export function isHospitalAdmin() {
  const user = getUser()
  return user?.role === 'hospital_admin'
}
