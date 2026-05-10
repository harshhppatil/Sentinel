import mongoose from 'mongoose'

const snippetSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },

    // The actual command/snippet
    command: {
      type:     String,
      required: [true, 'Command is required'],
      trim:     true,
    },

    description: {
      type:    String,
      default: '',
      trim:    true,
    },

    category: {
      type:     String,
      required: [true, 'Category is required'],
      enum:     ['linux', 'docker', 'kubernetes', 'networking', 'security', 'monitoring'],
    },

    difficulty: {
      type:    String,
      enum:    ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },

    // e.g. ['#networking', '#optimization', '#security']
    tags: {
      type:    [String],
      default: [],
    },

    // incremented when user copies the snippet
    usageCount: {
      type:    Number,
      default: 0,
    },

    isFavorite: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Text index for full-text search across title, description, command
snippetSchema.index({ title: 'text', description: 'text', command: 'text' })

// Regular index on category and tags for fast filtering
snippetSchema.index({ category: 1 })
snippetSchema.index({ tags: 1 })

const Snippet = mongoose.model('Snippet', snippetSchema)
export default Snippet