import express from 'express'
import { streamLogs, getLogHistory, simulateLog } from './streamer.controller.js'

const router = express.Router()

router.get('/stream',    streamLogs)      // GET  /api/logs/stream   (SSE)
router.get('/history',   getLogHistory)   // GET  /api/logs/history
router.post('/simulate', simulateLog)     // POST /api/logs/simulate

export default router