if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL;

console.log(process.env.SECRET);
console.log(process.env.API_KEY);

// const moment = require('moment');
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const ExpressError = require('./ExpressErrors/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campground');
const reviewsRoutes = require('./routes/reviews');
// const { isLoggedIn } = require('./middleware');

mongoose.connect(dbUrl || 'mongodb://127.0.0.1:27017/yelp-camp',{
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
    // useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs',engine);
app.use(express.static(path.join(__dirname,('public'))));

const secret = process.env.SECRET;
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60,
    crypto: {
        secret
    }
})

store.on("error",function(e){
    console.log("Session Store Errors!",e)
})

const sessionConfig = {
    store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // time for one week = 1000*60*60*24*7 //
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,('views')));
app.use(flash());

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith:'_'
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(helmet());
const scriptSrcUrls = [
    'https://stackpath.bootstrapcdn.com/',
    'https://api.tiles.mapbox.com/',
    'https://api.mapbox.com/',
    'https://kit.fontawesome.com/',
    'https://cdnjs.cloudflare.com/',
    'https://cdn.jsdelivr.net/'
  ];
  const styleSrcUrls = [
    "https://img.freepik.com/",
    'https://kit-free.fontawesome.com/',
    'https://stackpath.bootstrapcdn.com/',
    'https://api.mapbox.com/',
    'https://api.tiles.mapbox.com/',
    'https://fonts.googleapis.com/',
    'https://use.fontawesome.com/',
    'https://cdn.jsdelivr.net/'
  ];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com/",
    "https://ka-f.fontawesome.com/rel"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://img.freepik.com/",
                "https://res.cloudinary.com/dnbm7yq9w/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://encrypted-tbn0.gstatic.com/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use((req,res,next) =>{
    console.log(req.query)
    if(!['/login','/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewsRoutes)

app.get('/',(req,res) =>{
    res.render('home.ejs');
})

app.all('*',(req,res,next) =>{
    next(new ExpressError("Page Not Found !",404));
})

app.use((err,req,res,next) =>{
    const {Statuscode = 500} = err;
    if(!err.message) err.message = 'Something went Wrong !';
    res.status(Statuscode).render('errors',{err});
})

app.listen(5000,() =>{
    console.log("listening on Port 5000");
})