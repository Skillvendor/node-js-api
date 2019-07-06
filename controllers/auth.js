const { validationResult } = require("express-validator")
const models = require('../models/index')
const User = models.User
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed')
    error.statusCode = 422
    error.errorArray = errors.array()
    throw error
  }

  const {
    email,
    password
  } = req.body

  bcrypt.hash(password, 12)
  .then( hashPass => {
    const user = new User({ email: email, password: hashPass})
    return user.save()
  })
  .then( user => {
    res.status(201).json(user)
  })
  .catch( err => {
    err.statusCode = 500
    err.errorArray = []
    next(err)
  })
}

exports.login = (req, res, next) => {
  const {
    email,
    password
  } = req.body
  let loadedUser

  User.findOne({ where: {email: email} })
  .then( user => {
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      next(error)
    }
    loadedUser = user
    return bcrypt.compare(password, user.password)
  })
  .then( correctPass => {
    if (!correctPass) {
      const error = new Error('Wrong pass')
      error.statusCode = 401
      next(error)
    }

    const token = jwt.sign(
      {
        id: loadedUser.id,
        email: loadedUser.email
      },
      'super-secret',
      { expiresIn: '1h' }
    )

    res.status(200).json({ token: token, user: loadedUser})
  })
  .catch( err => {
    err.statusCode = 500
    err.errorArray = []
    next(err)
  })
}
