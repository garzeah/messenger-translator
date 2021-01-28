import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Button, TextField, Box } from "@material-ui/core";
import * as EmailValidator from "email-validator";
import axios from "axios";

import "./RegisterLogin.css";
import backgroundImage from "../assets/images/bg-img.png";

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
		try {
			await axios.post("/api/register", inputValues);
		} catch (err) {
			alert(err);
		}
	};

	// Responsive breakpoints
	const isMobile = useMediaQuery({
		query: "(max-device-width: 767px)"
	});
	const isTabletDesktop = useMediaQuery({
		query: "(min-device-width: 768px)"
	});

	// Error handling for password (must match and 6 chars minimum) for material-ui
	let validPassword =
		password !== confirmPassword ||
		(password.length > 0 && password.length < 6) ||
		(confirmPassword.length > 0 && confirmPassword.length < 6);

	// Text explaining error
	let validPasswordHelperText = validPassword
		? "Passwords must match and be greater than 6 characters"
		: "";

	// JSX pertaining to our form
	const formContainer = (
		<div className="formContainer">
			<Box className="header" mt={3} mx={3}>
				<p style={{ marginRight: "15px" }}>Already have an account?</p>
				<Link to="/login">
					<Button
						style={{
							padding: "15px 60px",
							color: "#3A8DFF",
							textTransform: "none"
						}}
						color="primary"
						size="large"
						className="boxShadow"
					>
						Login
					</Button>
				</Link>
			</Box>
			<Box mt={10} mx={6}>
				<h2>Create an account.</h2>
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
						style={{
							padding: "15px 60px",
							background: "#3A8DFF",
							textTransform: "none"
						}}
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

	// JSX for each respective view
	const registerMobile = <div className="pageContainer">{formContainer}</div>;
	const registerTabletDesktop = (
		<div className="pageContainer">
			<div className="advertisementContainer">
				<img src={backgroundImage} alt="background"></img>
				<p id="advertisementText">Converse with anyone with any language</p>
			</div>
			{formContainer}
		</div>
	);

	return (
		<div>
			{isMobile && registerMobile}
			{isTabletDesktop && registerTabletDesktop}
		</div>
	);
};

export default Register;
