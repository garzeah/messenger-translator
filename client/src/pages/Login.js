import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextField, Box } from "@material-ui/core";

import messengerIcon from "../assets/images/message.png";
import "./RegisterLogin.css";

const Login = () => {
	const [inputValues, setInputValues] = useState({});

	// Stores data in out input state
	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputValues({ ...inputValues, [name]: value });
	};

	// Sends data to our back end server
	const handleSubmit = async () => {};

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
						Create Account
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

	return (
		<div className="pageContainer">
			<div className="sideContainer">
				<img id="messengerIcon" src={messengerIcon} alt="Message Symbol"></img>
				<p id="sideText">Converse with anyone with any language</p>
			</div>
			{formContainer}
		</div>
	);
};

export default Login;
