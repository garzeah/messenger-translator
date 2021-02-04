import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Button, TextField, Box } from "@material-ui/core";
import axios from "axios";

import "./RegisterLogin.css";
import backgroundImage from "../assets/images/bg-img.png";

const Login = () => {
	const [inputValues, setInputValues] = useState({});

	// Stores data in out input state
	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputValues({ ...inputValues, [name]: value });
	};

	// Sends data to our back end server
	const handleSubmit = async () => {
		try {
			await axios.post("/api/login", inputValues);
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

	// JSX pertaining to our form
	const formContainer = (
		<div className="formContainer">
			<Box className="header" mt={3} mx={3}>
				<p style={{ marginRight: "15px" }}>Don't have an account?</p>
				<Link to="/">
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
						Create Account
					</Button>
				</Link>
			</Box>
			<Box mt={10} mx={6} px={10}>
				<h2>Welcome back!</h2>
				<Box mt={2}>
					<TextField
						label="Email"
						name="email"
						onChange={handleChange}
						fullWidth
					/>
				</Box>
				<Box mt={2} mb={4}>
					<TextField
						label="Password"
						name="password"
						type="password"
						onChange={handleChange}
						fullWidth
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
						Login
					</Button>
				</div>
			</Box>
		</div>
	);

	// JSX for each respective view
	const registerMobile = <div className="pageContainer">{formContainer}</div>;
	const registerTabletDesktop = (
		<div className="pageContainer">
			<div className="sideContainer">
				<img src={backgroundImage} alt="background"></img>
				<p id="sideText">Converse with anyone with any language</p>
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

export default Login;
