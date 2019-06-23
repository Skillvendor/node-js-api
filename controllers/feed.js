const { validationResult } = require("express-validator")

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

  res.status(201).json({
    post: {
      id: '1',
      title: title,
      content: content,
    },
    metadata: {
      message: 'Post was created',
    },
  })
}
