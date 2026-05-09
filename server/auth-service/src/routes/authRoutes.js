import express from 'express'
import { register, login, logout, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { body } from 'express-validator'

const router = express.Router()

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

const loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
]

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)
router.post('/logout', logout)
router.get('/me', protect, getMe)  // 🔒 protected

export default router