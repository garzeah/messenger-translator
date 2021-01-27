const mongoose = require("mongoose");

// Our schema to keep track of conversation between users
const conversationSchema = new mongoose.Schema({
	participants: [
		{
			// This will contain each participant's mongo objectID
			participant: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}
		}
	]
});

module.exports = mongoose.model("conversations", conversationSchema);
