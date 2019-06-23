const { validationResult } = require("express-validator")
const models = require('../models/index')
const User = models.User

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: 'First post',
        content: 'My awesome text',
      }
    ]
  })
}

exports.createPosts = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation Failed',
      errors: errors.array(),
    })
  }
  const {
    title,
    content,
  } = req.body

  //Create in db later
  User.findByPk(1)
  .then( user => {
    console.log(user);
    user.createPost({
      title: title,
      content: content,
    })
    .then ( post => {console.log(post); res.status(201).json(post)})
    .catch ( err => console.log(err))
  })
  .catch ( err => console.log(err) )
  // createPosts([{
  //   title: title,
  //   content: content,
  // }])
  // .then ( post => {console.log(post); res.status(201).json(post)})
  // .catch ( err => console.log(err))
}
