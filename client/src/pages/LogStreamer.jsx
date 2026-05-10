import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../api/axios'

const LEVELS = ['all', 'error', 'warn', 'info', 'debug']
const LEVEL_COLORS = { error: 'text-accent-red', warn: 'text-accent-yellow', info: 'text-accent-blue', debug: 'text-mute' }
const LEVEL_BG = { error: 'bg-accent-red-soft', warn: 'bg-accent-yellow-soft', info: 'bg-accent-blue-soft', debug: 'bg-surface-elevated' }
const LEVEL_BADGE = { error: 'ERR ', warn: 'WARN', info: 'INFO', debug: 'DBG ' }

export default function LogStreamer() {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('all')
  const [autoScroll, setAutoScroll] = useState(true)
  const [connected, setConnected] = useState(false)
  const [simulating, setSimulating] = useState(false)
  const containerRef = useRef(null)
  const eventSourceRef = useRef(null)

  const connect = useCallback(() => {
    if (eventSourceRef.current) eventSourceRef.current.close()
    const baseUrl = '/api'
    const es = new EventSource(`${baseUrl}/logs/stream`, { withCredentials: true })
    eventSourceRef.current = es
    es.onopen = () => setConnected(true)
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLogs(prev => [...prev.slice(-500), { ...data, id: Date.now() + Math.random() }])
      } catch {}
    }
    es.onerror = () => { setConnected(false); es.close(); setTimeout(connect, 3000) }
    return es
  }, [])

  useEffect(() => {
    const es = connect()
    return () => es.close()
  }, [connect])

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs, autoScroll])

  const simulateLog = async () => {
    setSimulating(true)
    try { await api.post('/api/logs/simulate') } catch {}
    finally { setTimeout(() => setSimulating(false), 300) }
  }

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.level === filter)

  const clearLogs = () => setLogs([])

  return (
    <div className="min-h-screen bg-canvas pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-slide-up">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-surface-card rounded-md flex items-center justify-center border border-hairline"><span className="text-lg">📜</span></div>
              <h1 className="text-ink text-2xl md:text-3xl font-semibold tracking-tight">Log Streamer</h1>
            </div>
            <p className="text-mute text-sm ml-11">Live server logs via Node.js <span className="sentinel-keycap">Streams</span> + SSE</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`sentinel-dot ${connected ? 'bg-accent-green animate-glow-pulse' : 'bg-accent-red'}`} style={{ color: connected ? '#59d499' : '#ff6161' }} />
            <span className="text-xs text-mute">{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-4 animate-fade-in">
          {LEVELS.map(level => (
            <button key={level} onClick={() => setFilter(level)} className={`sentinel-pill ${filter === level ? 'sentinel-pill-active' : 'sentinel-pill-inactive'}`}>
              {level === 'all' ? 'All' : (
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${level === 'error' ? 'bg-accent-red' : level === 'warn' ? 'bg-accent-yellow' : level === 'info' ? 'bg-accent-blue' : 'bg-mute'}`} />
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </span>
              )}
            </button>
          ))}
          <div className="w-px h-5 bg-hairline mx-1" />
          <button onClick={() => setAutoScroll(!autoScroll)} className={`sentinel-pill ${autoScroll ? 'sentinel-pill-active' : 'sentinel-pill-inactive'}`}>
            {autoScroll ? '⇊ Auto-scroll ON' : '⇊ Auto-scroll OFF'}
          </button>
          <button onClick={clearLogs} className="sentinel-pill sentinel-pill-inactive">⌫ Clear</button>
          <button onClick={simulateLog} disabled={simulating} className="sentinel-btn-primary text-xs h-7 px-3 disabled:opacity-50">
            {simulating ? '⏳' : '⚡'} Simulate
          </button>
          <span className="text-xs text-stone ml-auto">{filteredLogs.length} entries</span>
        </div>

        {/* Terminal */}
        <div className="sentinel-terminal animate-fade-in">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface-elevated">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-red" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent-yellow" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent-green" />
            <span className="text-xs text-mute ml-3 font-mono">server.log — sentinel-api-service</span>
          </div>

          {/* Log lines */}
          <div ref={containerRef} className="h-[500px] overflow-y-auto p-4 font-mono text-xs leading-6">
            {filteredLogs.length === 0 && (
              <div className="flex items-center justify-center h-full text-stone">
                {connected ? 'Waiting for log entries…' : 'Connecting to log stream…'}
              </div>
            )}
            {filteredLogs.map((log, i) => {
              const levelClass = LEVEL_COLORS[log.level] || 'text-mute'
              const bgClass = LEVEL_BG[log.level] || ''
              const badge = LEVEL_BADGE[log.level] || 'LOG '
              return (
                <div key={log.id || i} className={`flex gap-3 py-0.5 px-2 rounded-sm hover:bg-surface-elevated/50 transition-colors group ${i === filteredLogs.length - 1 ? 'animate-slide-in-right' : ''}`}>
                  <span className="text-stone select-none w-8 text-right flex-shrink-0">{i + 1}</span>
                  <span className={`${bgClass} ${levelClass} px-1.5 py-0 rounded-xs font-semibold flex-shrink-0 text-center w-11`}>{badge}</span>
                  <span className="text-body break-all">{log.line}</span>
                  {log.timestamp && <span className="text-stone ml-auto flex-shrink-0 hidden group-hover:block">{new Date(log.timestamp).toLocaleTimeString()}</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-center gap-2 mt-4 text-stone text-xs">
          <span>Logs stream via</span>
          <span className="sentinel-keycap">SSE</span>
          <span>using</span>
          <span className="sentinel-keycap">fs.createReadStream</span>
          <span>+</span>
          <span className="sentinel-keycap">fs.watch</span>
        </div>
      </div>
    </div>
  )
}