import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";

import Sidebar from "../components/sidebar/Sidebar";
import Convo from "../components/convo/Convo";
import "./Messenger.css";
import {
	connectionOptions,
	socketServerURL
} from "../utilities/socketConfiguration";

// Initializing our socket based on dev or prod server
let socket,
	SOCKET_SERVER_URL = socketServerURL();

const Messenger = () => {
	// Your profile information
	const [user, setUser] = useState({});
	// Keeps track of your current conversation
	const [currConvo, setCurrConvo] = useState(null);
	// Keeps track of whether message is sent and triggers re-render
	const [isMessageSent, setIsMessageSent] = useState({ status: false });

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
		// Connecting to our SOCKET_SERVER_URL and creating an event
		socket = io(SOCKET_SERVER_URL, connectionOptions);

		socket.on("messageFromServer", (status) => {
			setIsMessageSent((isMessageSent) => ({
				...isMessageSent,
				status: status
			}));

			// Setting it back to default in the event of new messages
			setIsMessageSent((isMessageSent) => ({
				...isMessageSent,
				status: false
			}));
		});
	}, []);

	return (
		<div className="messenger">
			<Sidebar
				currConvo={currConvo}
				setCurrConvo={setCurrConvo}
				user={user}
				setUser={setUser}
				isMessageSent={isMessageSent.status}
			/>
			{currConvo ? (
				<Convo
					currConvo={currConvo}
					user={user}
					isMessageSent={isMessageSent.status}
				/>
			) : null}
		</div>
	);
};

export default Messenger;
