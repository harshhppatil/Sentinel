import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MODULES = [
  {
    to: '/pulse', label: 'System Pulse', desc: 'Real-time OS monitoring and diagnostic data via Node.js os module.',
    icon: '📊', tag: 'Node.js', tagColor: '#59d499', pillar: 'Observability',
    preview: { left: 'CPU: 14%', right: 'RAM: 2.1GB Free', color: '#59d499' },
  },
  {
    to: '/logs', label: 'Log Streamer', desc: 'Live server log streaming using Node.js Streams, Buffers, and SSE.',
    icon: '📜', tag: 'Node.js', tagColor: '#57c1ff', pillar: 'Observability',
    preview: null,
  },
  {
    to: '/architect', label: 'The Architect', desc: 'Dynamic Dockerfile and docker-compose generator powered by Spring Boot.',
    icon: '🏗️', tag: 'Spring Boot', tagColor: '#ff6161', pillar: 'Automation',
  },
  {
    to: '/vault', label: 'Kernel Vault', desc: 'High-performance repository for Linux optimizations and Docker commands.',
    icon: '🔐', tag: 'MongoDB', tagColor: '#ffc533', pillar: 'Knowledge',
  },
  {
    to: '/kube', label: 'Kube-Cloud', desc: 'Client-side Kubernetes YAML validator with structure visualization.',
    icon: '☸️', tag: 'React', tagColor: '#9c9c9d', pillar: 'Automation',
  },
]

const PILLARS = [
  { name: 'Observability', desc: 'MERN Stack — Real-time monitoring with Node.js', icon: '👁', color: '#59d499', modules: ['System Pulse', 'Log Streamer'] },
  { name: 'Automation', desc: 'Spring Boot — Enterprise config generation', icon: '⚙️', color: '#ff6161', modules: ['The Architect', 'Kube-Cloud'] },
  { name: 'Knowledge', desc: 'NoSQL/MongoDB — Sophisticated schema design & CRUD', icon: '📚', color: '#ffc533', modules: ['Kernel Vault'] },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-canvas text-body font-sans pt-14">

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Diagonal stripe gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] opacity-[0.07]"
            style={{ background: 'repeating-linear-gradient(135deg, #ff5757 0px, #a1131a 2px, transparent 2px, transparent 40px)' }} />
        </div>

        <div className="relative max-w-[1240px] mx-auto px-6 md:px-12 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-[800px] animate-slide-up">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-glow-pulse" style={{ color: '#59d499' }} />
              <span className="text-mute text-xs uppercase tracking-widest font-medium">All systems operational</span>
            </div>
            <h1 className="text-ink text-[40px] sm:text-[48px] md:text-[64px] font-semibold leading-[1.1] tracking-tight mb-6"
              style={{ fontFeatureSettings: '"calt", "kern", "liga", "ss03"' }}>
              DevOps Command Center.
            </h1>
            <p className="text-body text-base md:text-lg leading-[1.6] max-w-[600px] mb-8">
              Distributed orchestration and site reliability monitoring. Powered by a polyglot microservices architecture
              running <span className="text-on-dark font-medium">Node.js</span>, <span className="text-on-dark font-medium">Spring Boot</span>,
              and <span className="text-on-dark font-medium">MongoDB</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={user ? '/architect' : '/register'} className="sentinel-btn-primary">
                {user ? '⚡ Launch Architect' : '⚡ Get Started'}
              </Link>
              <div className="sentinel-btn-tertiary">
                Press <span className="sentinel-keycap mx-1">⌘</span><span className="sentinel-keycap">K</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Pillars */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 pb-24">
        <h2 className="text-ink text-xl md:text-2xl font-medium mb-2 animate-fade-in">The Three Pillars</h2>
        <p className="text-mute text-sm mb-8">Observability · Automation · Knowledge</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {PILLARS.map(pillar => (
            <div key={pillar.name} className="sentinel-card p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: pillar.color + '18' }}>
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-on-dark font-medium text-base">{pillar.name}</h3>
                  <p className="text-mute text-xs">{pillar.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {pillar.modules.map(m => (
                  <span key={m} className="text-xs text-body bg-surface-elevated px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Module Grid */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 pb-24">
        <h2 className="text-ink text-xl md:text-2xl font-medium mb-6 animate-fade-in">Active Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((mod, i) => (
            <Link key={mod.to} to={mod.to}
              className="group sentinel-card-interactive p-6 flex flex-col gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-surface-card rounded-md flex items-center justify-center border border-hairline text-xl group-hover:scale-105 transition-transform">
                  {mod.icon}
                </div>
                <span className="sentinel-badge" style={{ background: mod.tagColor + '22', color: mod.tagColor }}>
                  {mod.tag}
                </span>
              </div>
              <div>
                <h3 className="text-on-dark text-lg font-medium mb-1">{mod.label}</h3>
                <p className="text-body text-sm leading-relaxed">{mod.desc}</p>
              </div>
              {mod.preview ? (
                <div className="mt-auto pt-4 border-t border-hairline flex justify-between text-xs">
                  <span className="text-mute">CPU: <span style={{ color: mod.preview.color }}>14%</span></span>
                  <span className="text-mute">RAM: <span className="text-on-dark">2.1GB</span></span>
                </div>
              ) : (
                <div className="mt-auto pt-4 text-xs text-mute flex items-center gap-1 group-hover:text-on-dark transition-colors">
                  Open module →
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-12 pb-24">
        <div className="sentinel-card p-6 md:p-8">
          <h2 className="text-ink text-lg font-medium mb-6">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React 19', desc: 'Frontend UI', icon: '⚛️' },
              { name: 'Node.js', desc: 'API + Auth Services', icon: '🟢' },
              { name: 'Spring Boot', desc: 'Architect Service', icon: '☕' },
              { name: 'MongoDB', desc: 'NoSQL Database', icon: '🍃' },
              { name: 'Docker', desc: 'Containerization', icon: '🐳' },
              { name: 'JWT', desc: 'Authentication', icon: '🔑' },
              { name: 'SSE', desc: 'Real-time Streaming', icon: '📡' },
              { name: 'Tailwind', desc: 'Design System', icon: '🎨' },
            ].map(tech => (
              <div key={tech.name} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-surface-elevated rounded-md flex items-center justify-center text-base flex-shrink-0">
                  {tech.icon}
                </div>
                <div>
                  <span className="text-sm text-on-dark font-medium block">{tech.name}</span>
                  <span className="text-xs text-mute">{tech.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#ff5757] to-[#a1131a] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">S</span>
            </div>
            <span className="text-mute text-sm">Sentinel — Advanced Web Technologies (1CS403) · RNGPIT</span>
          </div>
          <span className="text-stone text-xs">v1.0.0-alpha · Built with MERN + Spring Boot</span>
        </div>
      </footer>
    </div>
  )
}