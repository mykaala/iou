const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then((user) => done(null, user)));

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback'
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				let user = await User.findOne({ googleId: profile.id });

				if (!user) {
					user = await User.create({
						googleId: profile.id,
						displayName: profile.displayName,
						email: profile.emails[0].value
					});
					console.log('✅ New user saved to DB:', user);
				} else {
					console.log('🔁 Existing user logged in:', user);
				}

				done(null, user);
			} catch (err) {
				console.error('❌ Error in Google strategy:', err);
				done(err, null);
			}
		}
	)
);
