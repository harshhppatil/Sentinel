// 404 handler — when no route matched
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Global error handler — catches everything passed to next(error)
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    message: err.message,
    // only show stack trace in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}