import express from 'express'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import User from '../models/User.js'

const router = express.Router()

// @desc  Get all users (admin only example)
// @route GET /api/users
// @access Admin
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    next(error)
  }
})

// Friends can add their own user-related routes here 👇
// e.g. update profile, upload avatar, etc.

export default router