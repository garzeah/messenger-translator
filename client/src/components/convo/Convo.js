import React, { useState, useEffect, useCallback } from "react";
import DisplayAvatar from "../DisplayAvatar";

import ConvoHeader from "./children/ConvoHeader";
import SendMessage from "./children/SendMessage";

const Conversation = ({ currConvo, isMessageSent, setIsMessageSent }) => {
	// Stores messages
	const [currConvoMessages, setCurrConvoMessages] = useState({});

	// Will scroll us to the bottom of a conversation
	const setRef = useCallback((node) => {
		if (node) node.scrollIntoView({ smooth: true });
	}, []);

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
	}, [currConvo, isMessageSent]);

	const messagesCard = Object.keys(currConvoMessages).map((key, idx) => {
		let {
			conversationID,
			sender,
			content,
			timeCreated,
			_id
		} = currConvoMessages[key];

		// Keeps track of last message to auto scroll
		let lastMessage = currConvoMessages.length - 1 === idx;

		// Making our timeCreated variable more understandable
		// let date = new Date(timeCreated).toLocaleDateString();
		let time = new Date(timeCreated).toTimeString();

		// Converting the time into 24 hour time
		time = time.split(":");
		time.pop();
		time = time.join(":");

		// Fixes issue of momentary gap in time where conversation ids don't match
		if (currConvo.conversationID !== conversationID) return null;

		// When you receive a message
		if (sender === currConvo._id) {
			return (
				<div className="recipient" key={_id}>
					<DisplayAvatar user={currConvo} width={4} height={4} />
					<div style={{ marginLeft: "10px" }}>
						<div className="messageHeader">
							<p>{currConvo.displayName}</p>
							<p style={{ marginLeft: "5px" }}>{time}</p>
						</div>
						<div id="recipientContent" ref={lastMessage ? setRef : null}>
							<p>{content}</p>
						</div>
					</div>
				</div>
			);
			// When you send a message
		} else if (sender !== currConvo._id) {
			return (
				<div className="sender" key={_id}>
					<div className="messageHeader">
						<p>{time}</p>
					</div>
					<div id="senderContent" ref={lastMessage ? setRef : null}>
						<p>{content}</p>
					</div>
				</div>
			);
		}
		return null;
	});

	return (
		<div className="convoContainer">
			<ConvoHeader currConvo={currConvo} />
			<div className="convoBody">{messagesCard}</div>
			<SendMessage currConvo={currConvo} setIsMessageSent={setIsMessageSent} />
		</div>
	);
};

export default Conversation;
