const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
	participants: [
		{
			participant: {
				type: String
				// ref: "User"
			}
		}
	]
});

module.exports = mongoose.model("conversations", conversationSchema);
