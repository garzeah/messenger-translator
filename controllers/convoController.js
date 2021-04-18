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

	// Find every participant that does not equal user's _id and store in conversationList
	// Optimize this code in the event of group chats
	for (key1 in conversations) {
		for (key2 in conversations[key1].participants) {
			if (
				String(conversations[key1].participants[key2].participant) !==
				String(req.user._id)
			) {
				conversationList.push({
					conversationID: conversations[key1].id,
					userID: conversations[key1].participants[key2].participant
				});
			}
		}
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
	// Pulling out our conversation id and whether to translate or not
	const { id, translate } = req.query;

	try {
		// Finding all messages associated with a specific conversation
		let messages = await Message.find({ conversationID: id });

		if (translate === "true") {
			// Contains recipient's messages and recipient's messages that need to be translated
			let recipientMessages = [],
				filteredRecipientMessages = [];

			// Storing the recipient's messages to be translated
			for (key in messages) {
				if (String(req.user._id) !== String(messages[key].sender)) {
					recipientMessages = [...recipientMessages, messages[key]];
				}
			}

			// Filters in messages that need to be translated
			recipientMessages.forEach((message) => {
				if (!message.languages.includes(req.user.language)) {
					filteredRecipientMessages = [...filteredRecipientMessages, message];
				} else {
					filteredRecipientMessages = [...filteredRecipientMessages, message];
				}
			});

			// If the messages have been translated already return messages
			if (filteredRecipientMessages.length === 0) return res.send(messages);

			// Otherwise, we translate remaining messages
			const googleTranslate = new Translate({
				credentials: GOOGLE_APPLICATION_CREDENTIALS,
				projectId: GOOGLE_APPLICATION_CREDENTIALS.project_id
			});

			for (key in filteredRecipientMessages) {
				// Translating the original message
				let [translations] = await googleTranslate.translate(
					filteredRecipientMessages[key].contents[0].content,
					req.user.language
				);

				// Adding the translated message to our database
				await Message.updateOne(
					{ _id: filteredRecipientMessages[key]._id },
					{
						$push: {
							languages: req.user.language,
							contents: { language: req.user.language, content: translations }
						}
					}
				);
			}

			// Getting updated version of our messages
			const updatedMessages = await Message.find({ conversationID: id });

			return res.send(updatedMessages);
		}

		res.send(messages);
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
			languages: [req.user.language],
			contents: { language: req.user.language, content: messageText },
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
