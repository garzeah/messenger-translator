import React, { useState } from "react";
import { FormControl, OutlinedInput, withStyles } from "@material-ui/core";
import io from "socket.io-client";

import "../Convo.css";
import {
	connectionOptions,
	socketServerURL
} from "../../../utilities/socketConfiguration.js";

// Initializing our socket based on dev or prod server
let socket,
	SOCKET_SERVER_URL = socketServerURL();

const styles = {
	root: {
		"& $notchedOutline": {
			borderWidth: 0
		},
		"&:hover $notchedOutline": {
			borderWidth: 0
		},
		"&$focused $notchedOutline": {
			borderWidth: 0
		},
		"& .MuiOutlinedInput-input": {
			color: "black"
		}
	},
	focused: {},
	notchedOutline: {}
};

const StyledInput = withStyles(styles)(OutlinedInput);

const SendMessage = ({ currConvo }) => {
	const [message, setMessage] = useState("");

	// Sends the message to our server
	const handleSubmit = async () => {
		try {
			const res = await fetch(
				`/api/conversations/${currConvo.conversationID}`,
				{
					method: "POST",
					body: JSON.stringify({
						conversationID: currConvo.conversationID,
						message
					}),
					headers: { "Content-Type": "application/json" }
				}
			);

			// Clearing input and telling server it was successful
			if (res.status === 202) {
				console.log("yo");
				setMessage("");

				// Connecting to our SOCKET_SERVER_URL and creating an event
				socket = io(SOCKET_SERVER_URL, connectionOptions);
				socket.emit("messageToServer", true);
			}
		} catch (err) {
			console.log(err);
		}
	};

	// Pressing enter submits our message
	const handleKeyPress = (e) => {
		if (e.which === 13) {
			handleSubmit();
		}
	};

	return (
		<div className="messageContainer">
			<FormControl className="sendMessage" fullWidth>
				<StyledInput
					onChange={(e) => setMessage(e.target.value)}
					onKeyPress={(e) => handleKeyPress(e)}
					value={message}
					placeholder="Type something..."
				/>
			</FormControl>
		</div>
	);
};

export default SendMessage;
