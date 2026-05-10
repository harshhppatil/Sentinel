import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-56px)] bg-canvas flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md animate-slide-up">

        {/* Typographic Logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6 select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-ink to-ash text-[36px] font-bold tracking-tighter">
              Sentinel<span className="text-accent-red">.</span>
            </span>
          </div>
          <h1 className="text-ink text-[22px] font-medium tracking-tight">Welcome back</h1>
          <p className="text-mute text-[14px] mt-1">Sign in to your Sentinel account</p>
        </div>

        {/* Form card */}
        <div className="sentinel-card p-6">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-accent-red-soft border border-accent-red/20 mb-5 animate-fade-in">
              <svg className="w-4 h-4 text-accent-red flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-accent-red text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="sentinel-input"
                placeholder="you@email.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="sentinel-input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-on-primary hover:bg-primary-pressed mt-2 w-full h-[36px] rounded-md font-medium text-[14px] tracking-[0.2px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-hairline text-center">
            <p className="text-sm text-mute">
              Don't have an account?{' '}
              <Link to="/register" className="text-on-dark font-medium hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Keycap hint */}
        <div className="flex items-center justify-center gap-2 mt-6 text-stone text-[13px]">
          <span>Press</span>
          <span className="bg-surface-card text-body px-1.5 py-0.5 rounded-xs text-[12px] border border-hairline-strong">⏎</span>
          <span>to submit</span>
        </div>
      </div>
    </div>
  )
}