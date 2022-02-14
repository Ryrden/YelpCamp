const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const users = require('../controllers/users')
const { requireLogIn } = require('../utils/middleware')

router.route('/register')
    .get(users.renderRegister)
    .post(users.register)

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), users.login)

router.get('/logout', users.logout)

router.get('/mycampgrounds', requireLogIn, users.userCampgrounds)

module.exports = router