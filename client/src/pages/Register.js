import React from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Button, TextField, Box } from "@material-ui/core";

import "./RegisterLogin.css";
import backgroundImage from "../assets/images/bg-img.png";

const Register = () => {
	// Responsive design
	const TabletDesktop = ({ children }) => {
		const isTablet = useMediaQuery({ minWidth: 768 });
		return isTablet ? children : null;
	};
	const Mobile = ({ children }) => {
		const isMobile = useMediaQuery({ maxWidth: 767 });
		return isMobile ? children : null;
	};

	// Responsive JSX for each respective view
	const registerTabletDesktop = (
		<div className="pageContainer">
			<div className="advertisementContainer">
				<img src={backgroundImage} alt="background"></img>
				<p id="advertisementText">Converse with anyone with any language</p>
			</div>

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
				<Box mt={20} mx={14}>
					<h2>Create an account.</h2>
					<Box mt={2}>
						<TextField label="Username" fullWidth />
					</Box>
					<Box mt={2}>
						<TextField label="E-mail address" fullWidth />
					</Box>
					<Box mt={2}>
						<TextField label="Password" fullWidth />
					</Box>
					<Box mt={2} mb={4}>
						<TextField label="Confirm Password" fullWidth />
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
		</div>
	);

	const registerMobile = (
		<div className="pageContainer">
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
				<Box mt={10} mx={14}>
					<h2>Create an account.</h2>
					<Box mt={2}>
						<TextField label="Username" fullWidth />
					</Box>
					<Box mt={2}>
						<TextField label="E-mail address" fullWidth />
					</Box>
					<Box mt={2}>
						<TextField label="Password" fullWidth />
					</Box>
					<Box mt={2} mb={4}>
						<TextField label="Confirm Password" fullWidth />
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
		</div>
	);

	return (
		<div>
			<TabletDesktop>{registerTabletDesktop}</TabletDesktop>
			<Mobile>{registerMobile}</Mobile>
		</div>
	);
};

export default Register;
