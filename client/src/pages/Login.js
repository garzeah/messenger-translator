import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextField, Box, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import history from "../history";
import messengerIcon from "../assets/images/message.png";
import "./RegisterLogin.css";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = () => {
	// State management for input and snackbar
	const [inputValues, setInputValues] = useState({
		email: "",
		password: ""
	});
	const [snackbar, setSnackbar] = useState({
		open: false,
		severity: "",
		message: ""
	});

	// Stores data in out input state
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

		try {
			// Our data to send to the server
			const res = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify(inputValues),
				headers: { "Content-Type": "application/json" }
			});

			// Redirect them to messenger page
			if (res.status === 200) {
				history.push("/messenger");
			}

			// In the event we get an error
			const data = await res.json();
			if (data.errors) {
				if (data.errors.email || data.errors.password) {
					setSnackbar({
						open: true,
						severity: "error",
						message: data.errors.email || data.errors.password
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

	// Error validation
	const emptyInput = () => {
		for (let key in inputValues) {
			if (inputValues[key] === "") {
				return true;
			}
		}
		return false;
	};

	// Styles
	const styles = {
		createAccountButton: {
			padding: "15px 60px",
			color: "#3A8DFF",
			textTransform: "none"
		},
		loginButton: {
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
				<p style={{ marginRight: "15px" }}>Don't have an account?</p>
				<Link to="/">
					<Button
						className="boxShadow"
						style={styles.createAccountButton}
						color="primary"
						size="large"
					>
						Register
					</Button>
				</Link>
			</Box>
			<Box mt={7} mx={6}>
				<h2>Welcome back!</h2>
				<Box mt={2}>
					<TextField
						label="Email"
						name="email"
						onChange={handleChange}
						onKeyPress={handleKeyPress}
						fullWidth
					/>
				</Box>
				<Box mt={2} mb={4}>
					<TextField
						label="Password"
						name="password"
						type="password"
						onChange={handleChange}
						onKeyPress={handleKeyPress}
						fullWidth
					/>
				</Box>
				<div className="authButton">
					<Button
						onClick={handleSubmit}
						style={styles.loginButton}
						size="large"
						variant="contained"
						color="primary"
					>
						Login
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
			<div className="sideContainer">
				<img id="messengerIcon" src={messengerIcon} alt="Message Symbol"></img>
				<p id="sideText">Converse with anyone with any language</p>
			</div>
			{formContainer}
			{snackbars}
		</div>
	);
};

export default Login;
