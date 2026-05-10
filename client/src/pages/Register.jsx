import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const passwordStrength = () => {
    const p = form.password
    if (!p) return { level: 0, label: '', color: '' }
    if (p.length < 6) return { level: 1, label: 'Weak', color: 'bg-accent-red' }
    if (p.length < 10) return { level: 2, label: 'Fair', color: 'bg-accent-yellow' }
    return { level: 3, label: 'Strong', color: 'bg-accent-green' }
  }

  const strength = passwordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
          <h1 className="text-ink text-[22px] font-medium tracking-tight">Create your account</h1>
          <p className="text-mute text-[14px] mt-1">Join Sentinel and take control of your infrastructure</p>
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
              <label className="text-sm font-medium text-charcoal">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="sentinel-input"
                placeholder="Your full name"
              />
            </div>

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
                minLength={6}
                className="sentinel-input"
                placeholder="Min 6 characters"
              />
              {form.password && (
                <div className="flex items-center gap-2 mt-1 animate-fade-in">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength.level ? strength.color : 'bg-surface-elevated'}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strength.level === 1 ? 'text-accent-red' : strength.level === 2 ? 'text-accent-yellow' : 'text-accent-green'}`}>
                    {strength.label}
                  </span>
                </div>
              )}
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
                  Creating account…
                </>
              ) : 'Create account'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-hairline text-center">
            <p className="text-sm text-mute">
              Already have an account?{' '}
              <Link to="/login" className="text-on-dark font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}