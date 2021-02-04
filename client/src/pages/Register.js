import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextField, Box } from "@material-ui/core";
import * as EmailValidator from "email-validator";

import "./RegisterLogin.css";
import sidebarMessageImage from "../assets/images/message.png";

const Register = () => {
	const [inputValues, setInputValues] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: ""
	});

	const { password, confirmPassword } = inputValues;

	// Stores data in our input state
	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputValues({ ...inputValues, [name]: value });
	};

	// Sends data to our back end server
	const handleSubmit = async () => {
		// Removing confirmPassword before sending data
		let copyOfInputValues = inputValues;
		delete copyOfInputValues.confirmPassword;

		try {
			// Our data to send to the server
			const res = await fetch("/api/register", {
				method: "POST",
				body: JSON.stringify(copyOfInputValues),
				headers: { "Content-Type": "application/json" }
			});

			// Configure later for snackbars
			// In the event we get an error
			const data = await res.json();
			if (data.errors) {
				console.log(data);
			}

			// Redirect them to messenger page
			// history.js stuff
		} catch (err) {
			console.log(err);
		}
	};

	// Error handling for password (must match and 6 chars minimum) for material-ui
	let validPassword =
		password !== confirmPassword ||
		(password.length > 0 && password.length < 6) ||
		(confirmPassword.length > 0 && confirmPassword.length < 6);

	// Text explaining error
	let validPasswordHelperText = validPassword
		? "Passwords must match and be at least 6 characters"
		: "";

	// Styles
	const styles = {
		loginButton: {
			padding: "15px 60px",
			color: "#3A8DFF",
			textTransform: "none"
		},
		createButton: {
			padding: "15px 60px",
			background: "#3A8DFF",
			textTransform: "none",
			marginBottom: "30px"
		}
	};

	// JSX pertaining to our form
	const formContainer = (
		<div className="formContainer">
			<Box className="header" mt={3} mx={3}>
				<p style={{ marginRight: "15px" }}>Already have an account?</p>
				<Link to="/login">
					<Button
						className="boxShadow"
						style={styles.loginButton}
						color="primary"
						size="large"
					>
						Login
					</Button>
				</Link>
			</Box>
			<Box mt={7} mx={6}>
				<h2>Create an account</h2>
				<Box mt={2}>
					<TextField
						label="First Name"
						name="firstName"
						onChange={handleChange}
						fullWidth
					/>
				</Box>
				<Box mt={2}>
					<TextField
						label="Last Name"
						name="lastName"
						onChange={handleChange}
						fullWidth
					/>
				</Box>
				<Box mt={2}>
					<TextField
						label="Email"
						name="email"
						onChange={handleChange}
						error={
							!EmailValidator.validate(inputValues.email) &&
							inputValues.email !== ""
						}
						helperText={
							!EmailValidator.validate(inputValues.email) &&
							inputValues.email !== ""
								? "Enter a valid email address"
								: ""
						}
						fullWidth
					/>
				</Box>
				<Box mt={2}>
					<TextField
						label="Password"
						name="password"
						type="password"
						onChange={handleChange}
						fullWidth
						error={validPassword}
						helperText={validPasswordHelperText}
					/>
				</Box>
				<Box mt={2} mb={4}>
					<TextField
						label="Confirm Password"
						name="confirmPassword"
						type="password"
						onChange={handleChange}
						fullWidth
						error={validPassword}
					/>
				</Box>
				<div className="authButton">
					<Button
						onClick={handleSubmit}
						style={styles.createButton}
						size="large"
						variant="contained"
						color="primary"
					>
						Create
					</Button>
				</div>
			</Box>
		</div>
	);

	return (
		<div className="pageContainer">
			<div className="sideContainer">
				<div>
					<img
						id="message-img"
						src={sidebarMessageImage}
						alt="message symbol"
					></img>
				</div>
				<p id="sideText">Converse with anyone with any language</p>
			</div>
			{formContainer}
		</div>
	);
};

export default Register;
