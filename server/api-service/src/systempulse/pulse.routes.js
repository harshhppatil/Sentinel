import express from 'express'
import { getSystemStats, getQuickStatus } from './pulse.controller.js'

const router = express.Router()

router.get('/',       getSystemStats)   // GET /api/pulse
router.get('/quick',  getQuickStatus)   // GET /api/pulse/quick

export default router