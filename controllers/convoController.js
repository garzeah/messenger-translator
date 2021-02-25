const cryptoRandomString = require("crypto-random-string");

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
			return res.status(403).json({
				error: "You cannot start a conversation with yourself!"
			});
		}

		// Checking to see if conversation already exists
		const conversation = await Conversation.findOne({
			// Searching by Sender and Recipient's ID
			$and: [
				{ "participants.participant": req.user._id },
				{ "participants.participant": recipient._id }
			]
		});

		// If a conversation already exists return it
		if (conversation) {
			return res.status(200).send(conversation);
		}

		// Otherwise, lets create a new conversation and save it
		const newConversation = new Conversation({
			id: cryptoRandomString({ length: 24, type: "alphanumeric" }),
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
		res.status(200).send(newConversation);
	} catch (err) {
		res.status(500).send(err);
	}
};

// Get all conversations for a user
const fetchAllMyConversationsGet = async (req, res) => {
	// List to store everyone's name
	let conversationList = [];

	// Finds all conversations the user is associated with
	const conversations = await Conversation.find({
		"participants.participant": req.user._id
	});

	// Find every participant that does not equal user's _id
	// and store in conversationList
	for (let i = 0; i < conversations.length; i++) {
		// Making sure we do not store our user ID when fetching conversations
		// Fix this later, it's really inefficient but its fine since we
		// have 2 users max, although if we were to have more than 2 participants
		// it would be better to optimize this
		conversations[i].participants[0].participant == req.user._id
			? null
			: conversationList.push({
					conversationID: conversations[i].id,
					userID: conversations[i].participants[0].participant
			  });

		conversations[i].participants[1].participant == req.user._id
			? null
			: conversationList.push({
					conversationID: conversations[i].id,
					userID: conversations[i].participants[1].participant
			  });
	}

	// Going to append the user's data to the conversationList
	for (let i = 0; i < conversationList.length; i++) {
		let userData = await User.findById({ _id: conversationList[i].userID });
		// If user data exists, update conversationList information
		if (userData) {
			conversationList[i] = {
				...conversationList[i],
				_id: userData._id,
				displayName: userData.displayName,
				email: userData.email,
				avatar: userData.avatar,
				userID: undefined
			};
		}
	}
	res.send(conversationList);
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
	try {
		// If our message is empty then
		if (!req.body.message.trim()) return res.sendStatus(406);

		// Otherwise, message is not empty to let's save it
		const newMessage = new Message({
			conversationID: req.body.conversationID,
			sender: req.user._id,
			content: req.body.message.trim(),
			timeCreated: new Date()
		});

		await newMessage.save();

		/* 
			Making a copy of the convo, deleting it, then saving
			the copy so we can push it to the top of a user's list
		*/

		// Creating a copy
		const copyOfConvo = await Conversation.findOne({
			id: req.body.conversationID
		});

		// Initializing our model to save to our DB
		const copyToSave = new Conversation({
			id: req.body.conversationID,
			participants: [
				{
					participant: copyOfConvo.participants[0].participant
				},
				{
					participant: copyOfConvo.participants[1].participant
				}
			]
		});

		// Deleting the old conversation and saving it
		await Conversation.deleteOne({ id: req.body.conversationID });
		await copyToSave.save();
		res.sendStatus(202);
	} catch (err) {
		res.sendStatus(406);
	}
};

module.exports = {
	newConversationPost,
	fetchAllMyConversationsGet,
	fetchConversationGet,
	sendMessagePost
};
