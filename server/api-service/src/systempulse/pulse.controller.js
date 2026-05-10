import os from 'os'

// ── Helper — format bytes to human readable ───────────────────────
const formatBytes = (bytes) => {
  const gb = bytes / (1024 ** 3)
  const mb = bytes / (1024 ** 2)
  if (gb >= 1) return `${gb.toFixed(2)} GB`
  return `${mb.toFixed(2)} MB`
}

// ── Helper — format uptime seconds to readable string ────────────
const formatUptime = (seconds) => {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${d}d ${h}h ${m}m ${s}s`
}

// ── Helper — calculate CPU usage percentage ───────────────────────
const getCpuUsage = () => {
  const cpus = os.cpus()

  const totals = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0)
    acc.total += total
    acc.idle  += cpu.times.idle
    return acc
  }, { total: 0, idle: 0 })

  const usedPercent = ((1 - totals.idle / totals.total) * 100).toFixed(1)

  return {
    model:   cpus[0]?.model || 'Unknown',
    cores:   cpus.length,
    usage:   `${usedPercent}%`,
    speedMHz: cpus[0]?.speed || 0,
  }
}

// ── @desc    Full system stats
// ── @route   GET /api/pulse
// ── @access  Public
export const getSystemStats = (req, res, next) => {
  try {
    const totalMem = os.totalmem()
    const freeMem  = os.freemem()
    const usedMem  = totalMem - freeMem

    const stats = {
      // OS info
      os: {
        platform: os.platform(),   // linux, win32, darwin
        type:     os.type(),       // Linux, Windows_NT
        release:  os.release(),    // kernel version
        arch:     os.arch(),       // x64, arm64
        hostname: os.hostname(),
      },

      // CPU
      cpu: getCpuUsage(),

      // Memory
      memory: {
        total:       formatBytes(totalMem),
        used:        formatBytes(usedMem),
        free:        formatBytes(freeMem),
        usedPercent: `${((usedMem / totalMem) * 100).toFixed(1)}%`,
      },

      // Load average (1, 5, 15 min) — Linux/Mac only
      loadAverage: os.loadavg().map((l) => l.toFixed(2)),

      // Network interfaces
      network: Object.entries(os.networkInterfaces())
        .map(([name, interfaces]) => ({
          name,
          address: interfaces?.find((i) => i.family === 'IPv4')?.address || 'N/A',
        }))
        .filter((n) => n.address !== 'N/A'),

      // Uptime
      uptime: {
        raw:       os.uptime(),
        formatted: formatUptime(os.uptime()),
      },

      // Node.js process info
      process: {
        pid:        process.pid,
        nodeVersion: process.version,
        uptime:     formatUptime(process.uptime()),
        memoryUsage: {
          heapUsed:  formatBytes(process.memoryUsage().heapUsed),
          heapTotal: formatBytes(process.memoryUsage().heapTotal),
          rss:       formatBytes(process.memoryUsage().rss),
        },
      },

      timestamp: new Date().toISOString(),
    }

    res.json(stats)
  } catch (error) {
    next(error)
  }
}

// ── @desc    Quick status check
// ── @route   GET /api/pulse/quick
// ── @access  Public
export const getQuickStatus = (req, res, next) => {
  try {
    const totalMem = os.totalmem()
    const freeMem  = os.freemem()
    const usedMem  = totalMem - freeMem

    res.json({
      status:    'online',
      platform:  os.platform(),
      uptime:    formatUptime(os.uptime()),
      memory:    `${((usedMem / totalMem) * 100).toFixed(1)}% used`,
      cpu:       `${os.cpus().length} cores`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
}