import React from "react";

import DisplayAvatar from "../../DisplayAvatar";
import "../Sidebar.css";

const PreviewConvo = ({
	type,
	user,
	setSearchInput,
	currConvo,
	setCurrConvo
}) => {
	const clickHandler = async () => {
		// Will send a post request to initiate a conversation
		try {
			// Our data to send to the server
			let data = await fetch("/api/conversations/new", {
				method: "POST",
				body: JSON.stringify({ email: user.email }),
				headers: { "Content-Type": "application/json" }
			});
			data = await data.json();

			// Clear user input
			setSearchInput("");

			// Reformatting our data to avoid storing nested objects
			const { _id, displayName, email, avatar } = user;

			// Sets the current conversation when clicking a user in search
			setCurrConvo({
				conversationID: data,
				_id,
				displayName,
				email,
				avatar
			});
		} catch (err) {
			console.log(err);
		}
	};

	// Highlights the active conversation
	const activeConvo = () => {
		if (currConvo) {
			if (currConvo._id === user._id) return "activeConvo";
		}
		return "previewConvo";
	};

	// Creating 2 separate cards to avoid too many terneray operators
	const userItemCard = (
		<div className="previewConvo" onClick={clickHandler}>
			<DisplayAvatar id={user._id} user={user} width={6} height={6} />
			<p id="convoItemOwner">{user.displayName}</p>
		</div>
	);

	const convoItemCard = (
		<div className={activeConvo()} onClick={() => setCurrConvo(user)}>
			<DisplayAvatar id={user._id} user={user} width={6} height={6} />
			<p id="convoItemOwner">{user.displayName}</p>
		</div>
	);

	return <div>{type === "user" ? userItemCard : convoItemCard}</div>;
};

export default PreviewConvo;
