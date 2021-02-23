import React from "react";

import DisplayAvatar from "../../DisplayAvatar";
import "../Sidebar.css";

const PreviewConvo = ({ type, user, setSearchInput, setCurrConvo }) => {
	const clickHandler = async () => {
		// Will send a post request to initiate a conversation
		try {
			// Our data to send to the server
			await fetch("/api/conversations/new", {
				method: "POST",
				body: JSON.stringify({ email: user.email }),
				headers: { "Content-Type": "application/json" }
			});

			// Clear user input
			setSearchInput("");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div
			className="previewConvo"
			onClick={type === "user" ? clickHandler : () => setCurrConvo(user)}
		>
			<DisplayAvatar user={user} width="6" height="6" />
			<p
				style={{ marginLeft: "15px" }}
			>{`${user.firstName} ${user.lastName}`}</p>
		</div>
	);
};

export default PreviewConvo;
