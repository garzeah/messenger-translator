const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Create a conversation
const newConversationPost = async (req, res) => {
	try {
		// Getting information regarding the sender and recipient
		const recipient = await User.findOne({ email: req.body.email });

		// If the user is trying to start a conversation with themselves
		if (req.user._id == recipient._id) {
			return res.json({
				error: "You cannot start a conversation with yourself!"
			});
		}

		// Checking to see if conversation already exists
		const conversation = await Conversation.findOne({
			// Saving Sender and Recipient's ID
			"participants.participant": req.user._id,
			"participants.participant": recipient._id
		});

		// If a conversation already exists, return that conversation
		if (conversation) return res.send(conversation._id);

		// Otherwise, lets create a new conversation and save it
		const newConversation = new Conversation({
			participants: [
				{
					participant: req.user._id
				},
				{
					participant: recipient._id
				}
			]
		});

		// Saving it to our database and sending the new convo
		await newConversation.save();
		res.send(newConversation._id);
	} catch (err) {
		res.status(500).send(err);
	}
};

// Get all conversations for a user
const fetchAllMyConversationsGet = async (req, res) => {
	// Finds all conversations the user is associated with
	const conversations = await Conversation.find({
		"participants.participant": req.user._id
	});
	res.send(conversations);
};

// Get a specific conversation and its messages
const fetchConversationGet = async (req, res) => {
	try {
		// Finding all messages associated with a specific conversation
		const conversation = await Message.find({ conversationID: req.params.id });
		res.send(conversation);
	} catch (err) {
		res.sendStatus(404);
	}
};

// Send message
const sendMessagePost = async (req, res) => {
	// Removing leading and ending whitespace
	const message = req.body.message.trim();

	try {
		// If our message is empty then
		if (!message) return res.sendStatus(406);

		// Otherwise, message is not empty to let's save it
		const newMessage = new Message({
			conversationID: req.params.id,
			sender: req.user._id,
			content: message,
			timeCreated: new Date()
		});

		await newMessage.save();
		res.sendStatus(202);
	} catch (err) {}
	res.sendStatus(406);
};

module.exports = {
	newConversationPost,
	fetchAllMyConversationsGet,
	fetchConversationGet,
	sendMessagePost
};
