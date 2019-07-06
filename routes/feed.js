const express = require('express');
const router = express.Router();

const { body } = require("express-validator")

const feedController = require('../controllers/feed');
const auth = require('../middleware/auth')

// GET /feed/posts
router.get('/posts', auth, feedController.getPosts);

// POST /feed/posts
router.post('/post', [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
], auth, feedController.createPosts)

router.get('/post/:id', auth, feedController.getPost)

module.exports = router
