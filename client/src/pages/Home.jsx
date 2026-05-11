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
    <div className="min-h-screen bg-canvas text-body font-sans relative overflow-hidden">

      {/* The Premium Blueprint Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.15]"
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Hero */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32">
        <div className="relative max-w-[1240px] mx-auto px-6 md:px-12 z-10">
          <div className="max-w-[800px] animate-slide-up">
            
            {/* Live Radar Pulse */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green shadow-[0_0_8px_rgba(89,212,153,0.8)]"></span>
              </div>
              <span className="text-mute text-[11px] uppercase tracking-[0.2em] font-medium">All systems operational</span>
            </div>

            <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-ink to-stone text-[48px] md:text-[72px] font-bold leading-[1.05] tracking-tighter mb-6">
              DevOps Command Center.
            </h1>
            <p className="text-body text-base md:text-lg leading-[1.6] max-w-[600px] mb-10">
              Distributed orchestration and site reliability monitoring. Powered by a polyglot microservices architecture
              running <span className="text-on-dark font-medium">Node.js</span>, <span className="text-on-dark font-medium">Spring Boot</span>,
              and <span className="text-on-dark font-medium">MongoDB</span>.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to={user ? '/architect' : '/register'} className="bg-on-dark text-canvas hover:bg-white px-6 py-3 rounded-md font-medium text-[14px] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                {user ? 'Launch Architect' : 'Initialize System'}
              </Link>
              <div className="flex items-center gap-2 text-mute text-sm px-4 py-3 rounded-md border border-hairline bg-surface/50 backdrop-blur-sm">
                <span>Press</span>
                <span className="bg-surface-card border border-hairline-strong rounded px-1.5 py-0.5 text-xs font-mono text-on-dark">⌘</span>
                <span className="bg-surface-card border border-hairline-strong rounded px-1.5 py-0.5 text-xs font-mono text-on-dark">K</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Pillars */}
      <section className="relative max-w-[1240px] mx-auto px-6 md:px-12 pb-24 z-10">
        <h2 className="text-ink text-xl md:text-2xl font-medium mb-2 tracking-tight">The Three Pillars</h2>
        <p className="text-mute text-sm mb-8">Observability · Automation · Knowledge</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILLARS.map(pillar => (
            <div key={pillar.name} className="bg-surface/40 backdrop-blur-md border border-hairline rounded-xl p-6 flex flex-col gap-4 hover:border-hairline-strong transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner" style={{ background: pillar.color + '15', border: `1px solid ${pillar.color}30` }}>
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-on-dark font-medium text-base">{pillar.name}</h3>
                  <p className="text-mute text-xs mt-0.5">{pillar.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto pt-4">
                {pillar.modules.map(m => (
                  <span key={m} className="text-[11px] text-body bg-surface-card border border-hairline px-2.5 py-1 rounded-full">{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Module Grid */}
      <section className="relative max-w-[1240px] mx-auto px-6 md:px-12 pb-24 z-10">
        <h2 className="text-ink text-xl md:text-2xl font-medium mb-6 tracking-tight">Active Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod, i) => (
            <Link key={mod.to} to={mod.to}
              className="group relative bg-surface border border-hairline rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 flex flex-col gap-4 overflow-hidden">
              
              {/* Dynamic Reactor Glow Effects */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{ background: `radial-gradient(600px circle at 50% 0%, ${mod.tagColor}10, transparent 40%)` }} />
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border"
                   style={{ borderColor: `${mod.tagColor}40`, boxShadow: `0 8px 30px ${mod.tagColor}15` }} />

              <div className="flex justify-between items-start relative z-10">
                <div className="w-12 h-12 bg-surface-card rounded-md flex items-center justify-center border border-hairline text-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                  {mod.icon}
                </div>
                <span className="text-[11px] font-medium px-2 py-1 rounded-full border" 
                      style={{ background: mod.tagColor + '10', color: mod.tagColor, borderColor: mod.tagColor + '30' }}>
                  {mod.tag}
                </span>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-on-dark text-lg font-medium mb-1.5 group-hover:text-white transition-colors">{mod.label}</h3>
                <p className="text-mute text-[13px] leading-relaxed">{mod.desc}</p>
              </div>

              {mod.preview ? (
                <div className="mt-auto pt-4 border-t border-hairline flex justify-between text-xs relative z-10 font-mono">
                  <span className="text-mute">CPU: <span style={{ color: mod.preview.color }} className="animate-pulse">14%</span></span>
                  <span className="text-mute">RAM: <span className="text-on-dark">2.1GB</span></span>
                </div>
              ) : (
                <div className="mt-auto pt-4 text-xs font-medium flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity relative z-10" style={{ color: mod.tagColor }}>
                  Open module &rarr;
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative max-w-[1240px] mx-auto px-6 md:px-12 pb-24 z-10">
        <div className="bg-surface/30 border border-hairline rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-ink text-lg font-medium mb-8 tracking-tight">Core Infrastructure</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
            {[
              { name: 'React 19', desc: 'Frontend UI', icon: '⚛️' },
              { name: 'Node.js', desc: 'API + Auth Services', icon: '🟢' },
              { name: 'Spring Boot', desc: 'Architect Service', icon: '☕' },
              { name: 'MongoDB', desc: 'NoSQL Database', icon: '🍃' },
              { name: 'Docker', desc: 'Containerization', icon: '🐳' },
              { name: 'JWT', desc: 'Authentication', icon: '🔑' },
              { name: 'SSE', desc: 'Real-time Streaming', icon: '📡' },
              { name: 'Tailwind 4', desc: 'Design System', icon: '🎨' },
            ].map(tech => (
              <div key={tech.name} className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-surface-card border border-hairline rounded-lg flex items-center justify-center text-lg flex-shrink-0 group-hover:border-hairline-strong transition-colors">
                  {tech.icon}
                </div>
                <div>
                  <span className="text-[13px] text-on-dark font-medium block">{tech.name}</span>
                  <span className="text-[11px] text-mute">{tech.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cleaned Professional Footer */}
      <footer className="border-t border-hairline relative z-10 bg-canvas/80 backdrop-blur-md">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-on-dark text-sm font-semibold tracking-tighter">Sentinel<span className="text-accent-red">.</span></span>
            <span className="text-mute text-sm">— Distributed Orchestration Engine</span>
          </div>
          <span className="text-stone text-[11px] font-mono tracking-wider uppercase">v1.0.0-alpha · MERN + Spring Boot</span>
        </div>
      </footer>
    </div>
  )
}