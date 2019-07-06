const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
const models = require('../models/index')
const User = models.User

const authController = require('../controllers/auth');

router.post('/signup', [
  body('email')
    .trim()
    .isLength({ min: 5 })
    .isEmail()
    .custom((value, { req }) => {
      return User.findOne({ where: {email: value} }).then( user => {
        if (user) {
          return Promise.reject('The e-mail is already taken, please use a new one')
        }
      })
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 })
], authController.signUp)

router.post('/login' , authController.login)

module.exports = router
