import express      from 'express'
import cors         from 'cors'
import cookieParser from 'cookie-parser'
import helmet       from 'helmet'
import morgan       from 'morgan'
import dotenv       from 'dotenv'
import { connectDB } from './src/config/db.js'
import snippetRoutes  from './src/kernelvault/snippet.routes.js'
import pulseRoutes    from './src/systempulse/pulse.routes.js'
import streamerRoutes from './src/logstreamer/streamer.routes.js'
import { errorHandler, notFound } from './src/middleware/errorHandler.js'
import fs     from 'fs'
import path   from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5001
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// Write logs to file AND console
const logStream = fs.createWriteStream(
  path.join(__dirname, 'src/logstreamer/logs/server.log'),
  { flags: 'a' }  // append mode — don't overwrite on restart
)

// Connect to MongoDB
connectDB()

// ── Middleware ────────────────────────────────────────────────────
app.use(helmet())
app.use(morgan('dev'))
app.use(morgan('combined', { stream: logStream }))
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/snippets', snippetRoutes)   // Kernel Vault
app.use('/api/pulse',    pulseRoutes)     // System Pulse
app.use('/api/logs',     streamerRoutes)  // Log Streamer

// ── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    service: 'sentinel-api-service',
    status:  'running ✅',
    port:    PORT,
    env:     process.env.NODE_ENV,
  })
})

// ── Error Handling ────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`⚡ API Service running on http://localhost:${PORT}`)
})