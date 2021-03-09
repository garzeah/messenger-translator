import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, TextField, Box, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import * as EmailValidator from "email-validator";

import messengerIcon from "../assets/images/message.png";
import "./RegisterLogin.css";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Register = () => {
	// State management for input, valid input and snackbars
	const [inputValues, setInputValues] = useState({});
	const [validInput, setValidInput] = useState({});
	const [snackbar, setSnackbar] = useState({ open: false });

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

	// Error handling
	useEffect(() => {
		// Checks for valid email
		if (inputValues.email) {
			setValidInput((validInput) => ({
				...validInput,
				email: !EmailValidator.validate(inputValues.email)
			}));
		}

		// Checks for valid password
		if (inputValues.password) {
			setValidInput((validInput) => ({
				...validInput,
				password:
					inputValues.password.length > 0 && inputValues.password.length < 6
			}));
		}
	}, [inputValues.email, inputValues.password]);

	// Stores data in our input state
	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputValues({ ...inputValues, [name]: value });
	};

	// Sends data to our back end server
	const handleSubmit = async () => {
		// Checks for invalid email
		if (!EmailValidator.validate(inputValues.email)) {
			setSnackbar({
				open: true,
				severity: "error",
				message: "Invalid email"
			});
			return;
		}

		// Password validator
		if (inputValues.password) {
			// Checks if they are at least 6 characters
			if (inputValues.password.length < 6) {
				setSnackbar({
					open: true,
					severity: "error",
					message: "Password must be at least 6 characters"
				});
				return;
			}
		}

		try {
			// Our data to send to the server
			const res = await fetch("api/register", {
				method: "POST",
				body: JSON.stringify(inputValues),
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
			<Box mt={10} mx={6}>
				<h2 id="registerHeader">Create an account</h2>
				<Box mt={2}>
					<TextField
						label="Display Name"
						name="displayName"
						onChange={(e) => handleChange(e)}
						onKeyPress={handleKeyPress}
						fullWidth
					/>
				</Box>
				<Box mt={2}>
					<TextField
						label="Email"
						name="email"
						onChange={(e) => handleChange(e)}
						onKeyPress={handleKeyPress}
						error={validInput.email}
						helperText={validInput.email ? "Enter a valid email address" : ""}
						fullWidth
					/>
				</Box>
				<Box mt={2} mb={4}>
					<TextField
						label="Password"
						name="password"
						type="password"
						onChange={(e) => handleChange(e)}
						onKeyPress={handleKeyPress}
						error={validInput.password}
						helperText={
							validInput.password
								? "Passwords must be at least 6 characters"
								: ""
						}
						fullWidth
					/>
				</Box>
				<div className="authButton">
					<Button
						className="messengerButton"
						onClick={handleSubmit}
						size="large"
						variant="contained"
						color="primary"
					>
						Register
					</Button>
				</div>
				{snackbars}
			</Box>
		</div>
	);

	return (
		<div className="pageContainer">
			<div className="sideContainer">
				<div>
					<img
						id="messengerIcon"
						src={messengerIcon}
						alt="Message Symbol"
					></img>
				</div>
				<p id="sideText">Converse with anyone in any language</p>
			</div>
			{formContainer}
		</div>
	);
};

export default Register;
