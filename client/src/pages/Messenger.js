import React, { useState, useRef, useEffect } from "react";
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

// Initializing our socket based on dev or prod server
let SOCKET_SERVER_URL;
if (process.env.NODE_ENV === "production") {
	SOCKET_SERVER_URL = "https://decipher-io.herokuapp.com/";
} else {
	SOCKET_SERVER_URL = "http://localhost:5000/";
}

const Messenger = () => {
	// Your profile information
	const [user, setUser] = useState({});
	// Keeps track of your current conversation
	const [currConvo, setCurrConvo] = useState(null);
	const socketRef = useRef();

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
		socketRef.current = io(SOCKET_SERVER_URL, connectionOptions);

		socketRef.current.emit("messageToServer", "Hello from client!");
		socketRef.current.on("messageFromServer", (msg) => {
			console.log(msg);
		});
	}, []);

	return (
		<div className="messenger">
			<Sidebar
				currConvo={currConvo}
				setCurrConvo={setCurrConvo}
				user={user}
				setUser={setUser}
			/>
			{currConvo ? <Convo currConvo={currConvo} user={user} /> : null}
		</div>
	);
};

export default Messenger;
