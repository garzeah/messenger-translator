import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { Button, TextField, Box, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import { checkUser, userLogin } from "../components/actions/";
import messengerIcon from "../assets/images/message.png";
import "./RegisterLogin.css";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const Login = ({ isLoggedIn, snackbarMessage, checkUser, userLogin }) => {
	// State management for form and snackbar
	const [formValues, setFormValues] = useState({});
	const [snackbar, setSnackbar] = useState({});

	// Will be used to redirect user
	const history = useHistory();

	// Creating a memoized version of checkUser
	const memoizedCheckUser = useCallback(() => {
		checkUser();
	}, [checkUser]);

	// Checks if user is logged in
	useEffect(() => {
		let unmounted = false;

		if (!unmounted) {
			memoizedCheckUser();

			// If user is logged in, redirect them to messenger page
			if (isLoggedIn === 200) history.push("/messenger");

			// If we have an error to display, show snackbar
			if (snackbarMessage) {
				setSnackbar({
					open: true,
					severity: "error",
					message: snackbarMessage
				});
			}
		}

		return () => (unmounted = true);
	}, [memoizedCheckUser, isLoggedIn, history, snackbarMessage]);

	// Stores data in our form state
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	// Pressing enter submits our form
	const handleKeyPress = (e) => {
		if (e.which === 13) userLogin(formValues);
	};

	// Closes our snackbar
	const handleClose = (event, reason) => {
		if (reason === "clickaway") return;
		setSnackbar({ ...snackbar, open: false, severity: "error" });
	};

	// JSX pertaining to our form
	const formContainer = (
		<div className="formContainer">
			<Box className="header" mt={2} mx={3}>
				<p style={{ marginRight: "15px" }}>Don't have an account?</p>
				<Link to="/register">
					<Button
						className="boxShadow registerLoginButton"
						color="primary"
						size="large"
					>
						Register
					</Button>
				</Link>
				<Box mx={2}>
					<Button
						className="boxShadow demoButton"
						onClick={() =>
							userLogin({ email: "johndoe@gmail.com", password: "password" })
						}
						variant="contained"
						color="primary"
						size="large"
					>
						Demo
					</Button>
				</Box>
			</Box>
			<Box mt={10} mx={6}>
				<h2 id="loginHeader">Welcome back!</h2>
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
						className="messengerButton"
						onClick={() => userLogin(formValues)}
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
				<img id="messengerIcon" src={messengerIcon} alt="Decipher Logo"></img>
				<p id="sideText">Converse with anyone in any language</p>
			</div>
			{formContainer}
			{snackbars}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.user.isLoggedIn,
		snackbarMessage: state.user.snackbarMessage
	};
};

export default connect(mapStateToProps, { checkUser, userLogin })(Login);
