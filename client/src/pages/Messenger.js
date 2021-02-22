import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import Convo from "../components/convo/Convo";
import "./Messenger.css";

const Messenger = () => {
	// Will be used to redirect user
	const history = useHistory();

	// Retrieves user information
	useEffect(() => {
		const loginCheck = async () => {
			// Checking to see if user is logged in
			const isLoggedIn = await fetch("/api/checkUser");

			// If user is logged in...then redirect to messenger
			if (isLoggedIn.status !== 200) {
				history.push("/login");
			}
		};
		loginCheck();
	}, [history]);

	return (
		<div className="messenger">
			<Sidebar />
			<Convo />
		</div>
	);
};

export default Messenger;
