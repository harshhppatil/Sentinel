import express from 'express'
import {
  getSnippets,
  getTagStats,
  getStats,
  getSnippetById,
  createSnippet,
  updateSnippet,
  incrementUsage,
  deleteSnippet,
} from './snippet.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public
router.get('/',          getSnippets)      // GET  /api/snippets
router.get('/tags',      getTagStats)      // GET  /api/snippets/tags
router.get('/stats',     getStats)         // GET  /api/snippets/stats
router.get('/:id',       getSnippetById)   // GET  /api/snippets/:id
router.put('/:id/copy',  incrementUsage)   // PUT  /api/snippets/:id/copy

// Protected
router.post('/',         protect, createSnippet)   // POST   /api/snippets
router.put('/:id',       protect, updateSnippet)   // PUT    /api/snippets/:id
router.delete('/:id',    protect, deleteSnippet)   // DELETE /api/snippets/:id

export default router