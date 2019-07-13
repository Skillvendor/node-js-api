const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.get('Authorization')
  if(!token) {
    req.isAuth = false
    return next();
  }
  let decodedToken

  try {
    decodedToken = jwt.verify(token, 'super-secret')
  } catch (err) {
    req.isAuth = false
    next()
  }

  if(!decodedToken) {
    req.isAuth = false
    next()
  }

  req.userId = decodedToken.id
  req.isAuth = true
  next()
}
