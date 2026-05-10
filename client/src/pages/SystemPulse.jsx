import { useState, useEffect, useRef } from 'react'
import { api } from '../api/axios'

function MetricCard({ label, value, sub, icon, color, children }) {
  return (
    <div className="sentinel-metric animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-mute uppercase tracking-wider">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-on-dark animate-number-pop" style={{ color }}>{value}</span>
        {sub && <span className="text-xs text-mute">{sub}</span>}
      </div>
      {children}
    </div>
  )
}

function ProgressBar({ percent, color = '#59d499' }) {
  const val = parseFloat(percent) || 0
  return (
    <div className="sentinel-progress mt-2">
      <div className="sentinel-progress-bar" style={{ width: `${Math.min(val, 100)}%`, background: color }} />
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-hairline last:border-0">
      <span className="text-sm text-mute">{label}</span>
      <span className="text-sm text-on-dark font-medium font-mono">{value}</span>
    </div>
  )
}

function SkeletonDash() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[1,2,3,4].map(i => (
        <div key={i} className="sentinel-metric">
          <div className="sentinel-skeleton h-3 w-16 rounded mb-3" />
          <div className="sentinel-skeleton h-7 w-24 rounded mb-2" />
          <div className="sentinel-skeleton h-1.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default function SystemPulse() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const intervalRef = useRef(null)

  const fetchStats = async () => {
    try {
      setError('')
      const { data } = await api.get('/pulse')
      setStats(data)
      setLastUpdate(new Date())
    } catch {
      setError('Could not connect to System Pulse. Is the API service running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchStats, 3000)
    }
    return () => clearInterval(intervalRef.current)
  }, [autoRefresh])

  const cpuPercent = stats?.cpu?.usage?.replace('%', '') || '0'
  const memPercent = stats?.memory?.usedPercent?.replace('%', '') || '0'
  const cpuColor = parseFloat(cpuPercent) > 80 ? '#ff6161' : parseFloat(cpuPercent) > 50 ? '#ffc533' : '#59d499'
  const memColor = parseFloat(memPercent) > 80 ? '#ff6161' : parseFloat(memPercent) > 50 ? '#ffc533' : '#57c1ff'

  return (
    <div className="min-h-screen bg-canvas pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-surface-card rounded-md flex items-center justify-center border border-hairline"><span className="text-lg">📊</span></div>
              <h1 className="text-ink text-2xl md:text-3xl font-semibold tracking-tight">System Pulse</h1>
              {stats && <span className="sentinel-dot bg-accent-green animate-glow-pulse ml-2" style={{ color: '#59d499' }} />}
            </div>
            <p className="text-mute text-sm ml-11">Real-time OS monitoring via Node.js <span className="sentinel-keycap">os</span> module</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setAutoRefresh(!autoRefresh)} className={`sentinel-pill ${autoRefresh ? 'sentinel-pill-active' : 'sentinel-pill-inactive'}`}>
              {autoRefresh ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button onClick={fetchStats} className="sentinel-btn-tertiary text-xs">↻ Refresh</button>
            {lastUpdate && <span className="text-xs text-stone hidden sm:block">{lastUpdate.toLocaleTimeString()}</span>}
          </div>
        </div>

        {error && <div className="px-4 py-3 rounded-lg bg-accent-red-soft border border-accent-red/20 mb-6 text-accent-red text-sm animate-fade-in">{error}</div>}

        {loading && <SkeletonDash />}

        {stats && (
          <>
            {/* Key metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard label="CPU Usage" value={stats.cpu.usage} icon="⚡" color={cpuColor}>
                <ProgressBar percent={cpuPercent} color={cpuColor} />
              </MetricCard>
              <MetricCard label="Memory" value={stats.memory.usedPercent} sub={`${stats.memory.used} / ${stats.memory.total}`} icon="🧠" color={memColor}>
                <ProgressBar percent={memPercent} color={memColor} />
              </MetricCard>
              <MetricCard label="Uptime" value={stats.uptime.formatted} icon="⏱" color="#59d499" />
              <MetricCard label="Platform" value={stats.os.platform} sub={stats.os.arch} icon="🖥" color="#57c1ff" />
            </div>

            {/* Detail cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* CPU Detail */}
              <div className="sentinel-card p-5 animate-fade-in">
                <h3 className="text-on-dark font-medium text-sm mb-4 flex items-center gap-2">
                  <span className="sentinel-dot bg-accent-yellow" /> CPU Information
                </h3>
                <InfoRow label="Model" value={stats.cpu.model} />
                <InfoRow label="Cores" value={stats.cpu.cores} />
                <InfoRow label="Speed" value={`${stats.cpu.speedMHz} MHz`} />
                <InfoRow label="Usage" value={stats.cpu.usage} />
              </div>

              {/* Memory Detail */}
              <div className="sentinel-card p-5 animate-fade-in">
                <h3 className="text-on-dark font-medium text-sm mb-4 flex items-center gap-2">
                  <span className="sentinel-dot bg-accent-blue" /> Memory Breakdown
                </h3>
                <InfoRow label="Total" value={stats.memory.total} />
                <InfoRow label="Used" value={stats.memory.used} />
                <InfoRow label="Free" value={stats.memory.free} />
                <InfoRow label="Usage" value={stats.memory.usedPercent} />
              </div>

              {/* OS Info */}
              <div className="sentinel-card p-5 animate-fade-in">
                <h3 className="text-on-dark font-medium text-sm mb-4 flex items-center gap-2">
                  <span className="sentinel-dot bg-accent-green" /> Operating System
                </h3>
                <InfoRow label="Type" value={stats.os.type} />
                <InfoRow label="Release" value={stats.os.release} />
                <InfoRow label="Architecture" value={stats.os.arch} />
                <InfoRow label="Hostname" value={stats.os.hostname} />
              </div>

              {/* Node.js Process */}
              <div className="sentinel-card p-5 animate-fade-in">
                <h3 className="text-on-dark font-medium text-sm mb-4 flex items-center gap-2">
                  <span className="sentinel-dot bg-accent-red" /> Node.js Process
                </h3>
                <InfoRow label="PID" value={stats.process.pid} />
                <InfoRow label="Version" value={stats.process.nodeVersion} />
                <InfoRow label="Uptime" value={stats.process.uptime} />
                <InfoRow label="Heap Used" value={stats.process.memoryUsage.heapUsed} />
                <InfoRow label="RSS" value={stats.process.memoryUsage.rss} />
              </div>
            </div>

            {/* Network + Load */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Network Interfaces */}
              <div className="sentinel-card p-5 animate-fade-in">
                <h3 className="text-on-dark font-medium text-sm mb-4 flex items-center gap-2">
                  <span className="sentinel-dot bg-accent-blue" /> Network Interfaces
                </h3>
                {stats.network?.length > 0 ? stats.network.map((iface, i) => (
                  <InfoRow key={i} label={iface.name} value={iface.address} />
                )) : <p className="text-sm text-mute">No interfaces found</p>}
              </div>

              {/* Load Average */}
              <div className="sentinel-card p-5 animate-fade-in">
                <h3 className="text-on-dark font-medium text-sm mb-4 flex items-center gap-2">
                  <span className="sentinel-dot bg-accent-yellow" /> Load Average
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {['1 min', '5 min', '15 min'].map((label, i) => (
                    <div key={label} className="text-center">
                      <div className="text-xl font-semibold text-on-dark font-mono">{stats.loadAverage?.[i] || '0.00'}</div>
                      <div className="text-xs text-mute mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}