const router = require('express').Router();
const Group = require('../models/groups');

// Middleware to check if user is authenticated
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).send('Unauthorized');
};

// Helper function to generate a random invite code
const generateInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Route to create a new group
router.post('/', isLoggedIn, async (req, res) => {
	try {
		const { name } = req.body;

		const group = await Group.create({
			name,
			members: [req.user._id],
			createdBy: req.user._id,
			inviteCode: generateInviteCode()
		});

		res.status(201).json(group); // includes inviteCode
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error creating group');
	}
});

// Route for a non-admin to join a group
router.post('/join/:code', isLoggedIn, async (req, res) => {
	try {
		const group = await Group.findOne({ inviteCode: req.params.code });
		if (!group) return res.status(404).send('Invalid invite code');

		if (!group.members.includes(req.user._id)) {
			group.members.push(req.user._id);
			await group.save();
		}

		res.json({ success: true, groupId: group._id });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error joining group');
	}
});

// Route to join a group using invite code
router.post('/join/:code', isLoggedIn, async (req, res) => {
	try {
		const group = await Group.findOne({ inviteCode: req.params.code });
		if (!group) return res.status(404).send('Invalid invite code');

		const alreadyMember = group.members.includes(req.user._id);
		if (!alreadyMember) {
			group.members.push(req.user._id);
			await group.save();
		}

		res.json({ success: true, groupId: group._id });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error joining group');
	}
});

// Middleware to check if user is the group admin
const isAdmin = async (req, res, next) => {
	const group = await Group.findById(req.params.id);
	if (!group) return res.status(404).send('Group not found');
	if (!group.createdBy.equals(req.user._id)) return res.status(403).send('Not admin');
	req.group = group;
	next();
};

// Route to delete a group (admin only)
router.delete('/:id', isLoggedIn, isAdmin, async (req, res) => {
	await Group.findByIdAndDelete(req.params.id);
	res.send('Group deleted');
});

// Route to remove a member from a group (admin only)
router.post('/:id/remove-member', isLoggedIn, isAdmin, async (req, res) => {
	const { memberId } = req.body;
	req.group.members = req.group.members.filter((m) => m.toString() !== memberId);
	await req.group.save();
	res.send('Member removed');
});

// Route to get all groups created by the logged-in user
router.get('/', isLoggedIn, async (req, res) => {
	const groups = await Group.find({ createdBy: req.user._id }).populate('members');
	res.json(groups);
});

// Route to get a group by ID and include full member details if authenticated

router.get('/:id', isLoggedIn, async (req, res) => {
	const group = await Group.findById(req.params.id).populate('members');
	if (!group) return res.status(404).send('Group not found');
	res.json(group);
});

module.exports = router;
