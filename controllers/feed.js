const { validationResult } = require("express-validator")
const models = require('../models/index')
const User = models.User

exports.getPosts = (req, res, next) => {
  const userId = req.userId
  User.findByPk(userId)
  .then( user => {
    user.getPosts()
    .then( posts => {
      res.status(200).json(posts)
    })
    .catch ( err => {
      err.statusCode = 500
      err.errorArray = []
      next(err)
    })
  })
  .catch ( err => {
    err.statusCode = 500
    err.errorArray = []
    next(err)
  })
}

exports.getPost = (req, res, next) => {
  const postId = req.params.id
  const userId = req.userId
  //Create in db later
  User.findByPk(userId)
  .then( user => {
    user.getPosts({ where: { id: postId }})
    .then( post => {
      res.status(200).json(post)
    })
    .catch ( err => {
      err.statusCode = 500
      err.errorArray = []
      next(err)
    })
  })
  .catch ( err => {
    err.statusCode = 500
    err.errorArray = []
    next(err)
  })
}

exports.createPosts = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed')
    error.statusCode = 422
    error.errorArray = errors.array()
    throw error
  }
  const {
    title,
    content,
  } = req.body

  //Create in db later
  const userId = req.userId
  User.findByPk(userId)
  .then( user => {
    user.createPost({
      title: title,
      content: content,
    })
    .then ( post => { res.status(201).json(post)})
    .catch ( err => {
      err.statusCode = 500
      err.errorArray = []
      next(err)
    })
  })
  .catch ( err => {
    err.statusCode = 500
    err.errorArray = []
    next(err)
  } )
}
