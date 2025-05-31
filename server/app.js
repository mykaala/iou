const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

require('./config/passport'); // Google OAuth config

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
	res.send('👋 Welcome to IOU! Try logging in at /auth/google');
});
app.get('/dashboard', (req, res) => {
	if (req.isAuthenticated()) {
		res.send(`👋 Welcome to your dashboard, ${req.user.displayName}`);
	} else {
		res.redirect('/auth/google');
	}
});

app.use('/auth', require('./routes/authroutes'));
app.use('/groups', require('./routes/grouproutes'));

// TODO: add /api/expenses and /api/groups later

module.exports = app;
