const mongoose = require("mongoose");

// Stores message data a user sends
const messageSchema = new mongoose.Schema({
	conversationID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Conversation"
	},
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
