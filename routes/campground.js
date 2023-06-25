const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn,isAuthor,ValidateCampground} = require('../middleware');
const catchAsync = require('../ExpressErrors/catchAsync');
const Campground = require('../models/campground');
const {storage} = require('../cloudinary');
const multer = require('multer');
const upload = multer({storage});

router.route('/')
 .get(catchAsync(campgrounds.index))
 .post(isLoggedIn,upload.array('image'), ValidateCampground,catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
 .get(isLoggedIn,catchAsync(campgrounds.showCampground))
 .put(isLoggedIn, isAuthor ,upload.array('image'),ValidateCampground,catchAsync(campgrounds.updateCampground))
 .delete(isLoggedIn, isAuthor ,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;