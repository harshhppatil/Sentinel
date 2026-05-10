import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await authApi.get('/api/auth/me')
        setUser(data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const login = async (email, password) => {
    const { data } = await authApi.post('/api/auth/login', { email, password })
    setUser(data)
  }

  const register = async (name, email, password) => {
    const { data } = await authApi.post('/api/auth/register', { name, email, password })
    setUser(data)
  }

  const logout = async () => {
    await authApi.post('/api/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)