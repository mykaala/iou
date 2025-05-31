const router = require('express').Router();
const Group = require('../models/groups');

// middleware to protect routes
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).send('Unauthorized');
};

// POST /groups - create a group
router.post('/', isLoggedIn, async (req, res) => {
	try {
		const { name, members } = req.body;

		const group = await Group.create({
			name,
			members: members || [req.user._id],
			createdBy: req.user._id
		});

		res.status(201).json(group);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error creating group');
	}
});

// GET /groups - get all groups created by the user
router.get('/', isLoggedIn, async (req, res) => {
	const groups = await Group.find({ createdBy: req.user._id }).populate('members');
	res.json(groups);
});

module.exports = router;
