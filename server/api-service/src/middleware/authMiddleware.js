import jwt from 'jsonwebtoken'

export const protect = (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // { id, iat, exp }
    next()
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
}