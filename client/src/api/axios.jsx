import axios from 'axios'

// Auth service — login, register, logout, me
export const authApi = axios.create({
  baseURL:         '/auth-api',
  withCredentials: true,
})

// API service — snippets, pulse, logs
export const api = axios.create({
  baseURL:         '/api',
  withCredentials: true,
})

// Architect service — dockerfile generator
export const architectApi = axios.create({
  baseURL:         '/architect-api',
  withCredentials: true,
})

export default api