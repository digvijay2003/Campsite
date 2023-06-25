const express = require('express');
const reviews = require('../controllers/reviews');
const router = express.Router({mergeParams: true});
const {ValidateReview,isLoggedIn,isReviewAuthor} = require('../middleware');
const catchAsync = require('../ExpressErrors/catchAsync');
const ExpressError = require('../ExpressErrors/ExpressError.js');
const Campground = require('../models/campground');
const Review = require('../models/reviews');


router.post('/',isLoggedIn,ValidateReview ,catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports = router;