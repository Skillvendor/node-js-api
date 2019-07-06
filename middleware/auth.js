const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.get('Authorization')
  let decodedToken

  try {
    decodedToken = jwt.verify(token, 'super-secret')
  } catch (err) {
    err.statusCode = 500
    err.errorArray = []
    throw err
  }

  if(!decodedToken) {
    const error = new Error('Not authenticated')
    error.statusCode = 401
    throw error
  }

  req.userId = decodedToken.id
  next()
}
