import Snippet from './snippet.model.js'

// ── @desc    Get all snippets — search, filter, sort
// ── @route   GET /api/snippets
// ── @access  Public
export const getSnippets = async (req, res, next) => {
  try {
    const { search, category, difficulty, tag, sort } = req.query

    const filter = {}

    // Full-text search using MongoDB text index
    if (search) filter.$text = { $search: search }

    if (category)   filter.category   = category
    if (difficulty) filter.difficulty = difficulty
    if (tag)        filter.tags       = tag  // matches if tag is in tags array

    // Sort options
    const sortMap = {
      newest:     { createdAt: -1 },
      oldest:     { createdAt:  1 },
      popular:    { usageCount: -1 },  // most copied
      az:         { title:       1 },
    }
    const sortBy = sortMap[sort] || { createdAt: -1 }

    const snippets = await Snippet.find(filter).sort(sortBy)
    res.json(snippets)
  } catch (error) {
    next(error)
  }
}

// ── @desc    Get unique tags with count — MongoDB Aggregation
// ── @route   GET /api/snippets/tags
// ── @access  Public
export const getTagStats = async (req, res, next) => {
  try {
    const tags = await Snippet.aggregate([
      { $unwind: '$tags' },             // flatten tags array — one doc per tag
      { $group: {
          _id:   '$tags',               // group by tag name
          count: { $sum: 1 },           // count how many snippets have this tag
      }},
      { $sort: { count: -1 } },         // most used tags first
      { $project: {
          tag:   '$_id',
          count: 1,
          _id:   0,
      }},
    ])

    res.json(tags)
  } catch (error) {
    next(error)
  }
}

// ── @desc    Stats by category and difficulty — MongoDB Aggregation
// ── @route   GET /api/snippets/stats
// ── @access  Public
export const getStats = async (req, res, next) => {
  try {
    const [byCategory, byDifficulty, topSnippets] = await Promise.all([

      // Snippets grouped by category with count + total usage
      Snippet.aggregate([
        { $group: {
            _id:        '$category',
            count:      { $sum: 1 },
            totalUsage: { $sum: '$usageCount' },
        }},
        { $sort: { count: -1 } },
        { $project: { category: '$_id', count: 1, totalUsage: 1, _id: 0 } },
      ]),

      // Snippets grouped by difficulty
      Snippet.aggregate([
        { $group: {
            _id:   '$difficulty',
            count: { $sum: 1 },
        }},
        { $project: { difficulty: '$_id', count: 1, _id: 0 } },
      ]),

      // Top 5 most copied snippets
      Snippet.aggregate([
        { $sort:    { usageCount: -1 } },
        { $limit:   5 },
        { $project: { title: 1, category: 1, usageCount: 1, _id: 1 } },
      ]),
    ])

    res.json({ byCategory, byDifficulty, topSnippets })
  } catch (error) {
    next(error)
  }
}

// ── @desc    Get single snippet by ID
// ── @route   GET /api/snippets/:id
// ── @access  Public
export const getSnippetById = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    if (!snippet) return res.status(404).json({ message: 'Snippet not found' })
    res.json(snippet)
  } catch (error) {
    next(error)
  }
}

// ── @desc    Create snippet
// ── @route   POST /api/snippets
// ── @access  Protected
export const createSnippet = async (req, res, next) => {
  try {
    const { title, command, description, category, difficulty, tags } = req.body
    const snippet = await Snippet.create({
      title, command, description, category, difficulty,
      tags: tags || [],
    })
    res.status(201).json(snippet)
  } catch (error) {
    next(error)
  }
}

// ── @desc    Update snippet
// ── @route   PUT /api/snippets/:id
// ── @access  Protected
export const updateSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    if (!snippet) return res.status(404).json({ message: 'Snippet not found' })

    const fields = ['title', 'command', 'description', 'category', 'difficulty', 'tags', 'isFavorite']
    fields.forEach((f) => { if (req.body[f] !== undefined) snippet[f] = req.body[f] })

    const updated = await snippet.save()
    res.json(updated)
  } catch (error) {
    next(error)
  }
}

// ── @desc    Increment usageCount when user copies snippet
// ── @route   PUT /api/snippets/:id/copy
// ── @access  Public
export const incrementUsage = async (req, res, next) => {
  try {
    const snippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      { $inc: { usageCount: 1 } },  // atomic increment
      { new: true }
    )
    if (!snippet) return res.status(404).json({ message: 'Snippet not found' })
    res.json({ usageCount: snippet.usageCount })
  } catch (error) {
    next(error)
  }
}

// ── @desc    Delete snippet
// ── @route   DELETE /api/snippets/:id
// ── @access  Protected
export const deleteSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findByIdAndDelete(req.params.id)
    if (!snippet) return res.status(404).json({ message: 'Snippet not found' })
    res.json({ message: 'Snippet deleted' })
  } catch (error) {
    next(error)
  }
}