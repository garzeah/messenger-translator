const cryptoRandomString = require("crypto-random-string");
const { Translate } = require("@google-cloud/translate").v2;
const GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(
	process.env.GOOGLE_APPLICATION_CREDENTIALS
);

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
					userID: conversations[i].participants[0].participant,
					lastMessage: conversations[i].lastMessage
			  });

		conversations[i].participants[1].participant == req.user._id
			? null
			: conversationList.push({
					conversationID: conversations[i].id,
					userID: conversations[i].participants[1].participant,
					lastMessage: conversations[i].lastMessage
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
				userID: null
			};
		}
	}

	res.status(200).send(conversationList);
};

// Get a specific conversation and its messages
const fetchConversationGet = async (req, res) => {
	const { id, lang } = req.query;

	try {
		// Finding all messages associated with a specific conversation
		let conversation = await Message.find({ conversationID: id });
		// If the user wants to see the original language
		if (!lang) {
			res.send(conversation);
		} else {
			// If the user wants the translated version
			const translate = new Translate({
				credentials: GOOGLE_APPLICATION_CREDENTIALS,
				projectId: GOOGLE_APPLICATION_CREDENTIALS.project_id
			});

			// Translation
			for (let i = 0; i < conversation.length; i++) {
				// Translating each message that is not ours
				if (req.user._id === conversation[i].sender) break;
				let [translations] = await translate.translate(
					conversation[i].content,
					lang
				);

				// Replacing text with translations
				conversation[i].content = translations;
			}

			res.send(conversation);
		}
	} catch (err) {
		res.sendStatus(404);
	}
};

// Send message
const sendMessagePost = async (req, res) => {
	let messageText = req.body.message.trim();

	try {
		// If our message is empty then
		if (!messageText) return res.sendStatus(406);

		// Otherwise, message is not empty to let's save it
		const newMessage = new Message({
			conversationID: req.body.conversationID,
			sender: req.user._id,
			content: messageText,
			timeCreated: new Date()
		});

		// Finding conversation to save as last message
		await Conversation.findOneAndUpdate(
			{
				id: req.body.conversationID
			},
			{ $set: { lastMessage: newMessage.timeCreated } },
			{ new: true }
		);

		await newMessage.save();

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
