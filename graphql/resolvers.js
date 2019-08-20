const models = require('../models/index')
const User = models.User
const Post = models.Post
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
    if(validator.isEmpty(password) || !validator.isLength(password, { min: 4 })) {
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
  },
  createPost: async function({ postInput }, req) {
    if(!req.isAuth) {
      const error = new Error('Not Authenticated')
      error.statusCode = 401
      error.errorArray = []
      throw error
    }
    const {
      title,
      content
    } = postInput

    const errors = []
    if(validator.isEmpty(title) || !validator.isLength(title, { min: 4 })) {
      errors.push({
        field: 'title',
        message: 'Title should have more than 4 chars',
        model: 'post'
      })
    }
    if(validator.isEmpty(content) || !validator.isLength(content, { min: 10 })) {
      errors.push({
        field: 'content',
        message: 'content should have more than 10 chars',
        model: 'post'
      })
    }
    console.log(validator.isLength(title, { min: 4 }))
    if(errors.length > 0) {
      const error = new Error('Invalid input')
      error.statusCode = 422
      error.errorArray = errors
      throw error
    }
    const userId = req.userId
    const user = await User.findByPk(userId)
    const post = await user.createPost({ title, content})

    return post
  },
  posts: async function(args, req) {
    if(!req.isAuth) {
      const error = new Error('Not Authenticated')
      error.statusCode = 401
      error.errorArray = []
      throw error
    }

    const userId = req.userId
    const user = await User.findByPk(userId)
    const posts = await user.getPosts()

    return {
      posts: posts,
      totalPosts: posts.length
    }
  }
}
