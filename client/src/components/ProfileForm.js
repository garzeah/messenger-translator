import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, TextField, Box, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import * as EmailValidator from "email-validator";

import "../pages/RegisterLogin.css";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ProfileInput = ({ type, route }) => {
	// State management for input and snackbars
	const [inputValues, setInputValues] = useState({});
	const [snackbar, setSnackbar] = useState({ open: false });

	// Will be used to redirect user
	const history = useHistory();

	// Stores data in our input state
	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputValues({ ...inputValues, [name]: value });
	};

	// Sends data to our back end server
	const handleSubmit = async () => {
		// Password validator
		if (inputValues.password || inputValues.confirmPassword) {
			// Checks if password matches
			if (inputValues.password !== inputValues.confirmPassword) {
				setSnackbar({
					open: true,
					severity: "error",
					message: "Passwords do not match"
				});
				return;
			}

			// Checks if they are at least 6 characters
			if (
				inputValues.password.length < 6 ||
				inputValues.confirmPassword.length < 6
			) {
				setSnackbar({
					open: true,
					severity: "error",
					message: "Password must be at least 6 characters"
				});
				return;
			}
		}

		// Removing confirmPassword before sending data
		let copyOfInputValues = inputValues;
		delete copyOfInputValues.confirmPassword;

		if (type === "Register") {
			// Checks for invalid email
			if (!EmailValidator.validate(inputValues.email)) {
				setSnackbar({
					open: true,
					severity: "error",
					message: "Invalid email"
				});
				return;
			}

			try {
				// Our data to send to the server
				const res = await fetch(route, {
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
		} else {
			try {
				// Our data to send to the server
				const res = await fetch(route, {
					method: "POST",
					body: JSON.stringify(copyOfInputValues),
					headers: { "Content-Type": "application/json" }
				});

				// Redirect them to messenger page
				if (res.status === 201) {
					window.location.reload();
				}
			} catch (err) {
				console.log(err);
			}
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

	// Error handling for password (must match and 6 chars minimum) for material-ui
	let validPassword;
	if (inputValues.password || inputValues.confirmPassword) {
		validPassword =
			inputValues.password !== inputValues.confirmPassword ||
			(inputValues.password.length > 0 && inputValues.password.length < 6) ||
			(inputValues.confirmPassword.length > 0 &&
				inputValues.confirmPassword.length < 6);
	}

	let validEmail;
	if (inputValues.email) {
		validEmail = !EmailValidator.validate(inputValues.email);
	}

	return (
		<React.Fragment>
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
					error={validEmail}
					helperText={validEmail ? "Enter a valid email address" : ""}
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
					helperText={
						validPassword
							? "Passwords must match and be at least 6 characters"
							: ""
					}
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
					className="messengerButton"
					style={{ marginBottom: "30px" }}
					onClick={handleSubmit}
					size="large"
					variant="contained"
					color="primary"
				>
					{type}
				</Button>
			</div>
			{snackbars}
		</React.Fragment>
	);
};

export default ProfileInput;
