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
    if (p.length < 6) return { level: 1, label: 'Weak', color: '#ff6161' } 
    if (p.length < 10) return { level: 2, label: 'Fair', color: '#ffc533' } 
    return { level: 3, label: 'Strong', color: '#59d499' } 
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
    <div className="relative h-[calc(100vh-56px)] bg-canvas flex items-center justify-center px-4 overflow-hidden">
      
      {/* Premium Background Effects */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* TIGHTER CONTAINER: max-w-[380px] */}
      <div className="w-full max-w-[380px] animate-slide-up relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-5 select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-ink to-stone text-[36px] font-bold tracking-tighter">
              Sentinel<span className="text-accent-red">.</span>
            </span>
          </div>
          <h1 className="text-ink text-[22px] font-semibold tracking-tight">Create your account</h1>
          <p className="text-mute text-[13px] mt-1">Take control of your infrastructure</p>
        </div>

        {/* Tighter Form Card */}
        <div className="bg-surface/40 backdrop-blur-xl border border-hairline rounded-2xl px-6 py-7 shadow-[0_0_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {error && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-accent-red/10 border border-accent-red/20 mb-5 animate-fade-in backdrop-blur-sm">
              <svg className="w-4 h-4 text-accent-red flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-accent-red text-[13px] font-medium">{error}</p>
            </div>
          )}

          {/* Reduced gap-5 to gap-4 for denser grouping */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-ink">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                /* Autofill fix added via inset shadow trick */
                className="w-full bg-surface-card border border-hairline rounded-lg px-3.5 py-2 text-[13px] text-on-dark placeholder:text-mute focus:outline-none focus:border-hairline-strong focus:ring-1 focus:ring-hairline-strong transition-all shadow-inner [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0f0f13] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff]"
                placeholder="Your full name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-ink">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-surface-card border border-hairline rounded-lg px-3.5 py-2 text-[13px] text-on-dark placeholder:text-mute focus:outline-none focus:border-hairline-strong focus:ring-1 focus:ring-hairline-strong transition-all shadow-inner [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0f0f13] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff]"
                placeholder="you@email.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-ink">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full bg-surface-card border border-hairline rounded-lg px-3.5 py-2 text-[13px] text-on-dark placeholder:text-mute focus:outline-none focus:border-hairline-strong focus:ring-1 focus:ring-hairline-strong transition-all shadow-inner [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0f0f13] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff]"
                placeholder="Min 6 characters"
              />
              
              {form.password && (
                <div className="flex items-center gap-2 mt-1.5 animate-fade-in">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className="h-1 flex-1 rounded-full transition-all duration-300 shadow-sm"
                        style={{ 
                          backgroundColor: i <= strength.level ? strength.color : 'rgba(255,255,255,0.05)',
                          boxShadow: i <= strength.level ? `0 0 8px ${strength.color}60` : 'none'
                        }} 
                      />
                    ))}
                  </div>
                  <span 
                    className="text-[10px] font-bold tracking-wider uppercase w-10 text-right" 
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-on-dark text-canvas hover:bg-white mt-3 w-full h-[38px] rounded-lg font-semibold text-[13px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin mr-2 text-canvas" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Initializing…
                </>
              ) : 'Initialize Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-hairline text-center">
            <p className="text-[12px] text-mute">
              Already have an account?{' '}
              <Link to="/login" className="text-on-dark font-medium hover:text-white transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}