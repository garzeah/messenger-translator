const mongoose = require("mongoose");

// Stores message data a user sends
const messageSchema = new mongoose.Schema({
	conversationID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Conversation"
	},
	participants: [
		{
			// This will contain each participant's mongo objectID
			participant: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}
		}
	],
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	content: {
		type: String
	},
	timeCreated: {
		type: String,
		default: new Date()
	}
});

module.exports = mongoose.model("messages", messageSchema);
