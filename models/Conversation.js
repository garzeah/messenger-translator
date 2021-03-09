const mongoose = require("mongoose");

// Our schema to keep track of conversation between users
const conversationSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true
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
	lastMessage: {
		type: Object
	}
});

module.exports = mongoose.model("conversations", conversationSchema);
