import React, { useState, useEffect } from "react";
import DisplayAvatar from "../DisplayAvatar";

import ConvoHeader from "./children/ConvoHeader";
import SendMessage from "./children/SendMessage";

const Conversation = ({ currConvo }) => {
	// Stores messages
	const [currConvoMessages, setCurrConvoMessages] = useState({});

	// Retrieves the conversation between sender and recipient
	useEffect(() => {
		// If it exists...
		if (currConvo.conversationID) {
			const retrieveMessages = async () => {
				// Fetching user data
				let data = await fetch(
					`/api/conversations/${currConvo.conversationID}`
				);
				data = await data.json();
				setCurrConvoMessages(data);
			};
			retrieveMessages();
		}
	}, [currConvo, currConvo.conversationID]);

	const messagesCard = Object.keys(currConvoMessages).map((key) => {
		let { sender, content, timeCreated, _id } = currConvoMessages[key];

		// Making our timeCreated variable more understandable
		// let date = new Date(timeCreated).toLocaleDateString();
		let time = new Date(timeCreated).toTimeString();

		// Converting the time into 24 hour time
		time = time.split(":");
		time.pop();
		time = time.join(":");

		// This is the person who sent the message (sender)
		if (sender === currConvo._id) {
			return (
				<div className="recipient" key={_id}>
					<DisplayAvatar user={currConvo} width={4} height={4} />
					<div className="recipientMessage">
						<div className="messageHeader">
							<p>{`${currConvo.firstName} ${currConvo.lastName}`}</p>
							<p id="recipientTime">{time}</p>
						</div>
						<div id="recipientContent">
							<p>{content}</p>
						</div>
					</div>
				</div>
			);
		} else {
			// This is the person who receives the message (recipient)
			return (
				<div className="sender" key={_id}>
					<div className="messageHeader">
						<p>{time}</p>
					</div>
					<div id="senderContent">
						<p>{content}</p>
					</div>
				</div>
			);
		}
	});

	return (
		<div className="convo">
			<ConvoHeader currConvo={currConvo} />
			<div className="convoBody">{messagesCard}</div>
			<SendMessage currConvo={currConvo} />
		</div>
	);
};

export default Conversation;
