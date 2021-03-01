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
	const [isMessageSent, setIsMessageSent] = useState(false);

	// Initializing our endpoint to send socket.io data to
	// const ENDPOINT_dev = "localhost:5000";
	const ENDPOINT_prod = "https://decipher-io.herokuapp.com/";

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

		// Connecting to our endpoint and creating an event
		socket = io(ENDPOINT_prod, connectionOptions);

		// If message has been successfully sent...
		if (isMessageSent === true) {
			socket.emit("messageToServer", { isMessageSent });
		}

		// Now that the server has acknowledged message has beent sent
		// we will set it back to false and reredner everything
		socket.on("messageFromServer", ({ isMessageSent }) => {
			if (isMessageSent === false) setIsMessageSent(false);
		});

		console.log(process.env.NODE_ENV);

		// Clean up function, disconnect event
		return () => {
			socket.disconnect();
		};
	}, [history, ENDPOINT_prod, isMessageSent]);

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
					setIsMessageSent={setIsMessageSent}
					isMessageSent={isMessageSent}
				/>
			) : null}
		</div>
	);
};

export default Messenger;
