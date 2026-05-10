import fs   from 'fs'
import path  from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const LOG_FILE   = path.join(__dirname, 'logs', 'server.log')

// ── Log level helper ──────────────────────────────────────────────
const getLevel = (line) => {
  if (line.includes('ERROR')) return 'error'
  if (line.includes('WARN'))  return 'warn'
  if (line.includes('INFO'))  return 'info'
  return 'debug'
}

// ── @desc    Stream logs via Server-Sent Events (SSE)
// ── @route   GET /api/logs/stream
// ── @access  Public
export const streamLogs = (req, res, next) => {
  try {
    // SSE headers — keeps connection alive
    res.setHeader('Content-Type',  'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection',    'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.flushHeaders()

    // Send existing log file line by line using fs ReadStream (Streams — Unit 2)
    const readStream = fs.createReadStream(LOG_FILE, { encoding: 'utf8' })
    let   buffer     = ''

    readStream.on('data', (chunk) => {
      buffer += chunk
      const lines = buffer.split('\n')
      buffer = lines.pop() // keep incomplete last line in buffer

      lines.forEach((line) => {
        if (line.trim()) {
          const payload = JSON.stringify({ line, level: getLevel(line), timestamp: new Date().toISOString() })
          res.write(`data: ${payload}\n\n`)
        }
      })
    })

    readStream.on('end', () => {
      // After existing logs — watch file for new entries (fs.watch — Unit 2)
      res.write(`data: ${JSON.stringify({ line: '--- Live mode: watching for new logs ---', level: 'info', timestamp: new Date().toISOString() })}\n\n`)

      const watcher = fs.watch(LOG_FILE, (eventType) => {
        if (eventType === 'change') {
          // Read only the newly appended line
          const stats   = fs.statSync(LOG_FILE)
          const fileSize = stats.size

          // Read last 200 bytes to get the new line
          const readStream2 = fs.createReadStream(LOG_FILE, {
            encoding: 'utf8',
            start:    Math.max(0, fileSize - 500),
          })

          let newContent = ''
          readStream2.on('data', (chunk) => { newContent += chunk })
          readStream2.on('end', () => {
            const lines = newContent.split('\n').filter((l) => l.trim())
            const lastLine = lines[lines.length - 1]
            if (lastLine) {
              const payload = JSON.stringify({ line: lastLine, level: getLevel(lastLine), timestamp: new Date().toISOString() })
              res.write(`data: ${payload}\n\n`)
            }
          })
        }
      })

      // Cleanup when client disconnects
      req.on('close', () => {
        watcher.close()
        res.end()
      })
    })

    readStream.on('error', (err) => {
      res.write(`data: ${JSON.stringify({ line: `Error reading log file: ${err.message}`, level: 'error' })}\n\n`)
      res.end()
    })

  } catch (error) {
    next(error)
  }
}

// ── @desc    Get last N lines from log file
// ── @route   GET /api/logs/history?lines=50
// ── @access  Public
export const getLogHistory = (req, res, next) => {
  try {
    const limit = parseInt(req.query.lines) || 50

    // Read entire file using fs (Unit 2)
    const content = fs.readFileSync(LOG_FILE, 'utf8')
    const lines   = content
      .split('\n')
      .filter((l) => l.trim())
      .slice(-limit)  // last N lines
      .map((line) => ({ line, level: getLevel(line) }))

    res.json({ total: lines.length, logs: lines })
  } catch (error) {
    next(error)
  }
}

// ── @desc    Simulate a new log entry — appends to log file
// ── @route   POST /api/logs/simulate
// ── @access  Public (for demo purposes)
export const simulateLog = (req, res, next) => {
  try {
    const levels   = ['INFO', 'WARN', 'ERROR']
    const messages = [
      'GET /api/snippets 200 45ms',
      'POST /api/snippets 201 120ms',
      'High memory usage detected: 82%',
      'MongoDB slow query: 890ms',
      'CPU load average: 1.87',
      'Unhandled exception in worker thread',
      'Cache miss — fetching from DB',
      'Rate limit exceeded for IP 192.168.1.1',
      'Scheduled backup completed successfully',
      'New connection established from 10.0.0.5',
    ]

    const level   = req.body.level   || levels[Math.floor(Math.random() * levels.length)]
    const message = req.body.message || messages[Math.floor(Math.random() * messages.length)]

    const now     = new Date()
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
    const logLine = `[${timestamp}] ${level.padEnd(5)} ${message}\n`

    // Append to log file using fs (Unit 2)
    fs.appendFileSync(LOG_FILE, logLine, 'utf8')

    res.json({ message: 'Log entry added', line: logLine.trim() })
  } catch (error) {
    next(error)
  }
}