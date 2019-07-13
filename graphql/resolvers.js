const models = require('../models/index')
const User = models.User
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

module.exports = {
  createUser: async function({ userInput }, req) {
    const {
      email,
      password
    } = userInput

    const errors = []
    if (!validator.isEmail(email)) {
      errors.push({
        field: 'email',
        message: 'E-mail is invalid',
        model: 'user'
      })
    }
    if(validator.isEmpty(password) || validator.isLength(password, { min: 4 })) {
      errors.push({
        field: 'password',
        message: 'Password should have more than 4 chars',
        model: 'user'
      })
    }
    if(errors.length > 0) {
      const error = new Error('Invalid input')
      error.statusCode = 422
      error.errorArray = errors
      throw error
    }

    const existingUser = await User.findOne({ where: { email: email }})
    if (existingUser) {
      const error = new Error('User already exists')
      error.statusCode = 422
      error.errorArray = []
      throw error
    }

    const hashedPw = await bcrypt.hash(password, 12)
    const user = new User({
      email: email,
      password: hashedPw
    })

    const createdUser = await user.save()
    return createdUser
  },
  logIn: async function( { logInInput }){
    const {
      email,
      password
    } = logInInput

    const user = await User.findOne({ where: { email: email }})
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 401
      error.errorArray = []
      throw error
    }

    const passIsEqual = await bcrypt.compare(password, user.password)
    if(!passIsEqual) {
      const error = new Error('Password is invalid')
      error.statusCode = 401
      error.errorArray = []
      throw error
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      'super-secret',
      { expiresIn: '1h' }
    )

    return {
      user: user,
      token: token
    }
  }
}
