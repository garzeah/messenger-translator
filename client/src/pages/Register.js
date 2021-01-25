import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Button, TextField, Box } from "@material-ui/core";
import axios from "axios";

import "./RegisterLogin.css";
import backgroundImage from "../assets/images/bg-img.png";

const Register = () => {
	const [inputValues, setInputValues] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputValues({ ...inputValues, [name]: value });
	};

	const handleSubmit = () => {};

	useEffect(() => {
		console.log(inputValues);
	}, [inputValues]);

	// Responsive breakpoints
	const isMobile = useMediaQuery({
		query: "(max-device-width: 767px)"
	});
	const isTabletDesktop = useMediaQuery({
		query: "(min-device-width: 768px)"
	});

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
						onChange={handleChange}
						required
						name="username"
						label="Username"
						fullWidth
					/>
				</Box>
				<Box mt={2}>
					<TextField
						onChange={handleChange}
						required
						type="email"
						name="email"
						label="E-mail address"
						fullWidth
					/>
				</Box>
				<Box mt={2}>
					<TextField
						onChange={handleChange}
						error={inputValues.password !== inputValues.confirmPassword}
						helperText={
							inputValues.password !== inputValues.confirmPassword
								? "Passwords do not match!"
								: ""
						}
						required
						type="password"
						name="password"
						label="Password"
						fullWidth
					/>
				</Box>
				<Box mt={2} mb={4}>
					<TextField
						onChange={handleChange}
						error={inputValues.password !== inputValues.confirmPassword}
						helperText={
							inputValues.password !== inputValues.confirmPassword
								? "Passwords do not match!"
								: ""
						}
						required
						type="password"
						name="confirmPassword"
						label="Confirm Password"
						fullWidth
					/>
				</Box>
				<div className="authButton">
					<Button
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
