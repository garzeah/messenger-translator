const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
	participants: [
		{
			participant: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}
		}
	]
});

module.exports = mongoose.model("conversations", conversationSchema);
