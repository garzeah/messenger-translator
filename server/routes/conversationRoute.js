const express = require("express");
const router = new express.Router();

const User = require("../models/User");
const Conversation = require("../models/Conversation");
const verifyToken = require("../middlewares/verifyToken");

// Create a conversation
router.post("/conversations/new/", verifyToken, async (req, res) => {
	// Retrieving the ._ids of the person initiating and receiving the conversation
	const sender = await User.findById({ _id: req.user._id });
	const receiver = await User.findOne({ email: req.body.email });

	// Checking to see if conversation already exists
	const conversation = await Conversation.findOne({
		"participants.participant": sender._id,
		"participants.participant": receiver._id
	});

	if (conversation) return res.send("Conversation already exists!");

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
	res.send(conversation);
});

// Send message
router.post("/conversations/:id", (req, res) => {});

// Get all conversations for a user
router.get("/conversations/", (req, res) => {});

module.exports = router;
