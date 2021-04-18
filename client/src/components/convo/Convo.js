import React, { useState, useEffect, useCallback } from "react";
import DisplayAvatar from "../DisplayAvatar";

import ConvoHeader from "./children/ConvoHeader";
import SendMessage from "./children/SendMessage";

const Conversation = ({ user, currConvo, isMessageSent }) => {
	// States for retrieving messages and whether to translate or not
	const [currConvoMessages, setCurrConvoMessages] = useState({});
	const [isTranslated, setIsTranslated] = useState(true);

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
					`/api/conversations/?id=${currConvo.conversationID}&translate=${isTranslated}`
				);
				data = await data.json();
				setCurrConvoMessages(data);
			};
			retrieveMessages();
		}
	}, [currConvo, isMessageSent, isTranslated, user]);

	const messagesCard = Object.keys(currConvoMessages).map((key, idx) => {
		let {
			conversationID,
			sender,
			contents,
			timeCreated,
			_id
		} = currConvoMessages[key];

		// Fixes issue of momentary gap in time where conversation ids don't match
		if (currConvo.conversationID !== conversationID) return null;

		// Keeps track of last message to auto scroll
		let message,
			lastMessage = currConvoMessages.length - 1 === idx;

		// Making our timeCreated variable more understandable
		// let date = new Date(timeCreated).toLocaleDateString();
		let time = new Date(timeCreated).toTimeString();

		// Converting the time into 24 hour time
		time = time.split(":");
		time.pop();
		time = time.join(":");

		// Fixes issue of momentary gap in time where conversation ids don't match
		if (currConvo.conversationID !== conversationID) return null;

		// Strips messages from our database
		for (let i = 0; i < contents.length; i++) {
			// Only wanted translated messages
			if (isTranslated && contents[i].language === user.language) {
				message = contents[i].content;
				// Only want non-translated messages
			} else message = contents[0].content;
		}

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
							<p>{message}</p>
						</div>
					</div>
				</div>
			);
			// When you send a message
		} else {
			return (
				<div className="sender" key={_id}>
					<div className="messageHeader">
						<p>{time}</p>
					</div>
					<div id="senderContent" ref={lastMessage ? setRef : null}>
						<p>{message}</p>
					</div>
				</div>
			);
		}
	});

	return (
		<div className="convoContainer">
			<ConvoHeader currConvo={currConvo} setIsTranslated={setIsTranslated} />
			<div className="convoBody">{messagesCard}</div>
			<SendMessage currConvo={currConvo} />
		</div>
	);
};

export default Conversation;
