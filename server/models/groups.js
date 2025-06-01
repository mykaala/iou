const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
	name: { type: String, required: true },
	members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	inviteCode: { type: String, unique: true },
	createdAt: { type: Date, default: Date.now }
});

function generateInviteCode(length = 6) {
	return Math.random()
		.toString(36)
		.substring(2, 2 + length)
		.toUpperCase();
}

module.exports = mongoose.model('Group', groupSchema);
