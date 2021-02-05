import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextField, Box, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import * as EmailValidator from "email-validator";

import history from "../history";
import messengerIcon from "../assets/images/message.png";
import "./RegisterLogin.css";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Register = () => {
	// State management for input and snackbars
	const [inputValues, setInputValues] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [snackbar, setSnackbar] = useState({
		open: false,
		severity: "",
		message: ""
	});

	// Destructuring for nicer code
	const { password, confirmPassword } = inputValues;

	// Stores data in our input state
	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputValues({ ...inputValues, [name]: value });
	};

	// Sends data to our back end server
	const handleSubmit = async () => {
		// Checks for missing input
		if (emptyInput()) {
			setSnackbar({
				open: true,
				severity: "error",
				message: "Missing input"
			});
			return;
		}

		// Checks for invalid email
		if (!EmailValidator.validate(inputValues.email)) {
			setSnackbar({
				open: true,
				severity: "error",
				message: "Invalid email"
			});
			return;
		}

		// Checks if password matches
		if (password !== confirmPassword) {
			setSnackbar({
				open: true,
				severity: "error",
				message: "Passwords do not match"
			});
			return;
		}

		// Checks if password is at least 6 characters
		if (password.length < 6 || confirmPassword.length < 6) {
			setSnackbar({
				open: true,
				severity: "error",
				message: "Password must be at least 6 characters"
			});
			return;
		}

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

			// Redirect them to messenger page
			if (res.status === 201) {
				history.push("/messenger");
			}

			// In the event we get an error
			const data = await res.json();
			if (data.errors) {
				if (data.errors.email) {
					setSnackbar({
						open: true,
						severity: "error",
						message: data.errors.email
					});
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	// Pressing enter submits our form
	const handleKeyPress = (e) => {
		if (e.which === 13) {
			handleSubmit();
		}
	};

	// Closes our snackbar
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setSnackbar({ ...snackbar, open: false });
	};

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

	// Error handling for password (must match and 6 chars minimum) for material-ui
	let validPassword =
		password !== confirmPassword ||
		(password.length > 0 && password.length < 6) ||
		(confirmPassword.length > 0 && confirmPassword.length < 6);

	// Text explaining error
	let validPasswordHelperText = validPassword
		? "Passwords must match and be at least 6 characters"
		: "";

	const emptyInput = () => {
		for (let key in inputValues) {
			if (inputValues[key] === "") {
				return true;
			}
		}
		return false;
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
						onKeyPress={handleKeyPress}
						fullWidth
					/>
				</Box>
				<Box mt={2}>
					<TextField
						label="Last Name"
						name="lastName"
						onChange={handleChange}
						onKeyPress={handleKeyPress}
						fullWidth
					/>
				</Box>
				<Box mt={2}>
					<TextField
						label="Email"
						name="email"
						onChange={handleChange}
						onKeyPress={handleKeyPress}
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
						onKeyPress={handleKeyPress}
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
						onKeyPress={handleKeyPress}
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

	const snackbars = (
		<div>
			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "center"
				}}
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity={snackbar.severity}>
					{snackbar.message}
				</Alert>
			</Snackbar>
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
			{snackbars}
		</div>
	);
};

export default Register;
