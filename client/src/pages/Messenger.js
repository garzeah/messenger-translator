import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import Convo from "../components/convo/Convo";
import "./Messenger.css";

const Messenger = () => {
	// Your profile information
	const [user, setUser] = useState({});
	// Keeps track of your current conversation
	const [currConvo, setCurrConvo] = useState({});

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

	return (
		<div className="messenger">
			<Sidebar setCurrConvo={setCurrConvo} user={user} setUser={setUser} />
			{currConvo ? (
				<Convo currConvo={currConvo} user={user} />
			) : (
				<h2 id="noConvos">
					Click the search bar to start connecting with people!
				</h2>
			)}
		</div>
	);
};

export default Messenger;
