import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#6a6b6c] text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-[#59d499] animate-pulse" />
          Initializing...
        </div>
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}