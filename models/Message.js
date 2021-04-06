const mongoose = require("mongoose");

// Stores message data a user sends
const messageSchema = new mongoose.Schema({
	conversationID: {
		type: String
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	languages: [
		{
			type: String
		}
	],
	contents: [
		{
			language: String,
			content: String
		}
	],
	timeCreated: {
		type: String,
		default: new Date()
	}
});

module.exports = mongoose.model("messages", messageSchema);
