const express = require('express');
const router = express.Router();
const users = require('../controllers/user');
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../ExpressErrors/catchAsync');

router.route('/register')
 .get(users.renderRegistor)
 .post(catchAsync(users.registor))

router.route('/login')
 .get(users.renderlogin)
 .post(passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), users.login)

router.route('/logout')
.get(users.logout);


module.exports = router;