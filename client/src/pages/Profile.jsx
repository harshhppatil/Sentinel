import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-canvas pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto animate-slide-up">

        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#57c1ff] to-[#a1131a] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl font-bold">{initial}</span>
          </div>
          <div>
            <h1 className="text-ink text-2xl font-semibold tracking-tight">{user?.name}</h1>
            <p className="text-mute text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Info card */}
        <div className="sentinel-card p-6 mb-4">
          <h2 className="text-on-dark text-base font-medium mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Role', value: user?.role, badge: true },
              { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A' },
            ].map(({ label, value, badge }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-xs text-mute uppercase tracking-wider">{label}</span>
                {badge ? (
                  <span className="inline-flex items-center gap-1.5 w-fit">
                    <span className="sentinel-dot bg-accent-green" />
                    <span className="text-sm text-on-dark font-medium capitalize">{value}</span>
                  </span>
                ) : (
                  <span className="text-sm text-on-dark font-medium">{value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick access cards */}
        <div className="sentinel-card p-6">
          <h2 className="text-on-dark text-base font-medium mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Kernel Vault', desc: 'Browse snippets', to: '/vault', color: '#ffc533' },
              { label: 'System Pulse', desc: 'Monitor system', to: '/pulse', color: '#59d499' },
              { label: 'Log Streamer', desc: 'View live logs', to: '/logs', color: '#57c1ff' },
              { label: 'Architect', desc: 'Generate configs', to: '/architect', color: '#ff6161' },
            ].map(({ label, desc, to, color }) => (
              <a
                key={to}
                href={to}
                className="flex items-center gap-3 p-3 rounded-md bg-surface-elevated border border-hairline hover:border-hairline-strong transition-colors"
              >
                <span className="sentinel-dot" style={{ background: color }} />
                <div>
                  <span className="text-sm text-on-dark font-medium">{label}</span>
                  <span className="text-xs text-mute block">{desc}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}