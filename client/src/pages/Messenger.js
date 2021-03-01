import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";

import Sidebar from "../components/sidebar/Sidebar";
import Convo from "../components/convo/Convo";
import "./Messenger.css";

// Connection options to bypass CORS warning
const connectionOptions = {
	"force new connection": true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"]
};

// Initializing our socket, put outside bc of rerender issues
let socket;

const Messenger = () => {
	// Your profile information
	const [user, setUser] = useState({});
	// Keeps track of your current conversation
	const [currConvo, setCurrConvo] = useState(null);
	// Keeps track of whether message was successfully sent
	const [isMessageSent, setIsMessageSent] = useState({ status: false });

	// Initializing our endpoint based on dev or prod server
	let ENDPOINT;
	if (process.env.NODE_ENV === "production") {
		ENDPOINT = "https://decipher-io.herokuapp.com/";
	} else {
		ENDPOINT = "localhost:5000";
	}

	// Will be used to redirect user
	const history = useHistory();

	// Checks if user is logged in and fetches their conversations
	useEffect(() => {
		const loginCheck = async () => {
			// Checking to see if user is logged in
			const isLoggedIn = await fetch("/api/checkUser");

			// If user is not logged in then redirect to login page
			if (isLoggedIn.status !== 200) {
				history.push("/login");
			}
		};

		loginCheck();
	}, [history]);

	// Handles all the socket.io related code
	useEffect(() => {
		// Connecting to our endpoint and creating an event
		socket = io(ENDPOINT, connectionOptions);

		// If message has been successfully sent...
		if (isMessageSent.status) {
			socket.emit("messageToServer", isMessageSent.status);
		}

		// Now that the server has acknowledged message has beent sent
		// we will set set it true for everyone
		socket.on("messageFromServer", (status) => {
			// Triggering a re-render since message was successful
			setIsMessageSent({ status: status });
		});

		// Setting it back to default in the event of a new message
		setIsMessageSent({ status: false });
	}, [ENDPOINT, isMessageSent.status]);

	return (
		<div className="messenger">
			<Sidebar
				currConvo={currConvo}
				setCurrConvo={setCurrConvo}
				user={user}
				setUser={setUser}
				isMessageSent={isMessageSent}
			/>
			{currConvo ? (
				<Convo
					currConvo={currConvo}
					user={user}
					isMessageSent={isMessageSent}
					setIsMessageSent={setIsMessageSent}
				/>
			) : null}
		</div>
	);
};

export default Messenger;
