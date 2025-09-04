const jwt = require('jsonwebtoken')

module.exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Please login first' })
  }

  const token = authHeader.split(' ')[1] // ✅ ambil token setelah "Bearer"

  console.log('Authorization Header:', authHeader)
  console.log('Extracted Token:', token)

  const decoded = jwt.decode(token)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}
