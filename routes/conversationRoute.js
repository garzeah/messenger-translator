const express = require("express");
const router = new express.Router();

const User = require("../models/User");
const Conversation = require("../models/Conversation");
const verifyToken = require("../middlewares/verifyToken");

// Create a conversation
router.post("/api/conversations/new/", verifyToken, async (req, res) => {
	try {
		// Retrieving the ._ids of the person initiating and receiving the conversation
		const sender = await User.findById({ _id: req.user._id });
		const receiver = await User.findOne({ email: req.body.email });

		// Checking to see if conversation already exists
		const conversation = await Conversation.findOne({
			"participants.participant": sender._id,
			"participants.participant": receiver._id
		});

		if (conversation) return res.send(conversation);

		// Otherwise, lets create a new conversation and save it
		const newConversation = new Conversation({
			participants: [
				{
					participant: sender._id
				},
				{
					participant: receiver._id
				}
			]
		});

		await newConversation.save();
		res.send(newConversation);
	} catch (err) {
		res.status(500).send(err);
	}
});

// Get all conversations for a user
router.get("/api/conversations/", verifyToken, async (req, res) => {
	// Finds all conversations the user is associated with
	const conversations = await Conversation.find({
		"participants.participant": req.user._id
	});
	res.send(conversations);
});

// Get a specific conversation
router.get("/api/conversations/:id", (req, res) => {});

// Send message
router.post("/api/conversations/:id", (req, res) => {});

module.exports = router;
