const User = require("../models/User");
const Conversation = require("../models/Conversation");

// Create a conversation
const newConversationPost = async (req, res) => {
	try {
		const receiver = await User.findOne({ email: req.body.email });

		// Checking to see if conversation already exists
		const conversation = await Conversation.findOne({
			// Saving Sender and Reciver's ID
			"participants.participant": req.user._id,
			"participants.participant": receiver._id
		});

		// If a conversation already exists, return that conversation
		if (conversation) return res.send(conversation);

		// Otherwise, lets create a new conversation and save it
		const newConversation = new Conversation({
			participants: [
				{
					participant: req.user._id
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
};

// Get all conversations for a user
const fetchAllConversationsGet = async (req, res) => {
	// Finds all conversations the user is associated with
	const conversations = await Conversation.find({
		"participants.participant": req.user._id
	});
	res.send(conversations);
};

// Get a specific conversation
const fetchConversationGet = async (req, res) => {
	try {
		const conversation = await conversation.findById(req.params.id);

		res.send(conversation);
	} catch (err) {
		res.sendStatus(404);
	}
};

// Send message
const sendMessagePost = async (req, res) => {};

module.exports = {
	newConversationPost,
	fetchAllConversationsGet,
	fetchConversationGet,
	sendMessagePost
};
