const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) =>
	res.redirect('/dashboard')
);

router.get('/logout', (req, res) => {
	req.logout(() => res.redirect('/'));
});

router.get('/whoami', (req, res) => {
	if (!req.isAuthenticated()) return res.status(401).send('Not logged in');
	res.json(req.user);
});

module.exports = router;
