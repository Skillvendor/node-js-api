const express = require('express');
const router = express.Router();

const { body } = require("express-validator")

const feedController = require('../controllers/feed');

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/posts
router.post('/post', [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
], feedController.createPosts)

module.exports = router
