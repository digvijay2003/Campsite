const {campgroundSchema,reviewSchema} = require('./schemas.js');
const ExpressError = require('./ExpressErrors/ExpressError.js');
const Campground = require('./models/campground');
const Review = require('./models/reviews');

module.exports.isLoggedIn = (req,res,next) =>{
    if (!req.isAuthenticated()){
        req.flash('error', 'You must login first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.ValidateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg);
    } else {
        next();
    }
}

module.exports.isAuthor = async(req,res,next) =>{
    const {id} = req.params;
    const campground= await Campground.findById(id).populate('author');
    if(!campground.author.equals(req.user._id)){
        req.flash('error','Sorry, you dont have permission to do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next) =>{
    const {id,reviewId} = req.params;
    const review =  await Review.findById(reviewId).populate('author');
    if(!review.author.equals(req.user._id)){
        req.flash('error','Sorry, you dont have permission to do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.ValidateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}
