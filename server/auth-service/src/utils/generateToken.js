import jwt from 'jsonwebtoken'

export const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

  // Send as httpOnly cookie — JS in browser can't read this (more secure)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  })

  return token
}

export const clearToken = (res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // expire immediately
  })
}