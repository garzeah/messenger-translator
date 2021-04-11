import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import {
	Button,
	TextField,
	Box,
	Snackbar,
	FormControl,
	InputLabel,
	NativeSelect
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import * as EmailValidator from "email-validator";
import { connect } from "react-redux";

import { checkUser } from "../components/actions";
import messengerIcon from "../assets/images/message.png";
import "./RegisterLogin.css";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Register = ({ isLoggedIn, checkUser }) => {
	// State management for input, languages, valid input and snackbars
	const [inputValues, setInputValues] = useState({});
	const [languageList, setLanguageList] = useState([]);
	const [validInput, setValidInput] = useState({});
	const [snackbar, setSnackbar] = useState({ open: false });

	// Will be used to redirect user
	const history = useHistory();

	// Creating a memoized version of checkUser
	const memoizedCheckUser = useCallback(() => {
		checkUser();
	}, [checkUser]);

	// Checks if user is logged in
	useEffect(() => {
		memoizedCheckUser();

		// If user is logged in, redirect them to messenger page
		if (isLoggedIn === 200) history.push("/messenger");
	}, [memoizedCheckUser, isLoggedIn, history]);

	// Retrieving languages to display in our form
	useEffect(() => {
		const fetchLanguages = async () => {
			// Checking to see if user is logged in
			let languages = await fetch("/api/users/languages");
			languages = await languages.json();
			setLanguageList(languages);
		};
		fetchLanguages();
	}, []);

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

		// Language selection validator
		if (!inputValues.language) {
			setSnackbar({
				open: true,
				severity: "error",
				message: "Please select a language"
			});
			return;
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

	// Lets users demo the app
	const handleDemoClick = async () => {
		try {
			// Our data to send to the server
			const res = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify({
					email: "johndoe@gmail.com",
					password: "password"
				}),
				headers: { "Content-Type": "application/json" }
			});

			// Redirect them to messenger page
			if (res.status === 200) {
				history.push("/messenger");
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

	// JSX for rendering a list of languages
	const languageListCard = Object.keys(languageList).map((key) => {
		return (
			<option key={languageList[key].code} value={languageList[key].code}>
				{languageList[key].name}
			</option>
		);
	});

	// JSX pertaining to our form
	const formContainer = (
		<div className="formContainer">
			<Box className="header" mt={2} mx={3}>
				<p style={{ marginRight: "15px" }}>Already have an account?</p>
				<Link to="/">
					<Button
						className="boxShadow registerLoginButton"
						color="primary"
						size="large"
					>
						Login
					</Button>
				</Link>
				<Box mx={2}>
					<Button
						className="boxShadow demoButton"
						onClick={handleDemoClick}
						variant="contained"
						color="primary"
						size="large"
					>
						Demo
					</Button>
				</Box>
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
				<Box mt={2}>
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
				<Box mt={2} mb={4}>
					<FormControl fullWidth>
						<InputLabel>Select primary language</InputLabel>
						<NativeSelect
							name="language"
							defaultValue=""
							onChange={(e) => handleChange(e)}
							onKeyPress={handleKeyPress}
						>
							<option value=""></option>
							{languageListCard}
						</NativeSelect>
					</FormControl>
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

const mapStateToProps = (state) => {
	return { isLoggedIn: state.user.isLoggedIn };
};

const mapDispatchToProps = (dispatch) => {
	return {
		checkUser: () => dispatch(checkUser())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
