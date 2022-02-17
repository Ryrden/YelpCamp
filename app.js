if(process.env.NODE_ENV !== "production")
	require('dotenv').config()

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require("method-override");
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

//Security
const mongoSanitize = require('express-mongo-sanitize')

//Routes
const UsersRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')

const MongoDBStore = require('connect-mongo')

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp"

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true})); //to send forms
app.use(methodOverride("_method")); //to do "fakes" PUT,DELETE, etc
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.SECRET || 'ThisShouldBeaBetterSecret!'

const store = MongoDBStore.create ({
	mongoUrl: dbUrl,
	secret,
	touchAfter: 24 * 60 * 60
})

store.on("error", function (e){
	console.log("SESSION STORE ERROR",e)
})

const WeekMiliSecond = 1000 * 60 * 60 * 24 * 7
const sessionConfig = {
	store,
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + WeekMiliSecond,
		maxAge: WeekMiliSecond
	}
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
	res.locals.currentUser = req.user
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error')
	next();
})

app.use('/', UsersRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get("/", (req, res) => {
	res.render("home");
});

app.all('*', (req,res,next) => {
	next(new ExpressError('Page not Found', 404))
})

app.use((err, req, res, next) => {
	const {statusCode = 500} = err;
	if(!err.message) err.message = 'Oh no, Something Went Wrong'
	res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Server is Online on port ${port}`);
});
