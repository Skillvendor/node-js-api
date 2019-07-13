const models = require('../models/index')
const User = models.User
const bcrypt = require('bcryptjs')
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

    const existingUser = await User.findOne({ where: {email: email} })
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
  }
}
