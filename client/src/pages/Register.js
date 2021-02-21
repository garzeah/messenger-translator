import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Box } from "@material-ui/core";

import messengerIcon from "../assets/images/message.png";
import ProfileForm from "../components/ProfileForm";
import "./RegisterLogin.css";

const Register = () => {
	// Will be used to redirect user
	const history = useHistory();

	// Retrieves user information
	useEffect(() => {
		const loginCheck = async () => {
			// Checking to see if user is logged in
			const isLoggedIn = await fetch("/api/checkUser");

			// If user is logged in...then redirect to messenger
			if (isLoggedIn.status === 200) {
				history.push("/messenger");
			}
		};
		loginCheck();
	}, [history]);

	// JSX pertaining to our form
	const formContainer = (
		<div className="formContainer">
			<Box className="header" mt={2} mx={3}>
				<p style={{ marginRight: "15px" }}>Already have an account?</p>
				<Link to="/login">
					<Button
						className="boxShadow registerLoginButton"
						color="primary"
						size="large"
					>
						Login
					</Button>
				</Link>
			</Box>
			<Box mt={5} mx={6}>
				<h2>Create an account</h2>
				<ProfileForm type="Register" route="api/register" />
			</Box>
		</div>
	);

	return (
		<div className="pageContainer">
			<div className="sideContainer" style={{ marginBottom: "30px" }}>
				<div>
					<img
						id="messengerIcon"
						src={messengerIcon}
						alt="Message Symbol"
					></img>
				</div>
				<p id="sideText">Converse with anyone with any language</p>
			</div>
			{formContainer}
		</div>
	);
};

export default Register;
