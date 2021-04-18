import React, { useState, useEffect } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import {
	TextField,
	Box,
	FormControl,
	InputLabel,
	NativeSelect,
	Button,
	Snackbar
} from "@material-ui/core";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditProfile = ({ user }) => {
	const [inputValues, setInputValues] = useState({
		displayName: user.displayName,
		language: user.language
	});

	const [languageList, setLanguageList] = useState([]);
	const [snackbar, setSnackbar] = useState({ open: false });

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

	// Stores data in our input state
	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputValues({ ...inputValues, [name]: value });
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

	// Sends data to our back end server
	const handleSubmit = async () => {
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
			const res = await fetch("api/users/me", {
				method: "POST",
				body: JSON.stringify(inputValues),
				headers: { "Content-Type": "application/json" }
			});

			// Redirect them to messenger page
			if (res.status === 201) {
				window.location.reload();
			}
		} catch (err) {
			console.log(err);
		}
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

	return (
		<div>
			<Box mt={2} mx={6}>
				<h2 id="registerHeader">Update Profile</h2>
				<Box mt={2}>
					<TextField
						label="Display Name"
						name="displayName"
						value={inputValues.displayName}
						onChange={(e) => handleChange(e)}
						onKeyPress={handleKeyPress}
						fullWidth
					/>
				</Box>
				<Box mt={2} mb={4}>
					<FormControl fullWidth>
						<InputLabel shrink>Select Primary Language</InputLabel>
						<NativeSelect
							name="language"
							defaultValue={inputValues.language}
							value={inputValues.language}
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
						Update
					</Button>
				</div>
				{snackbars}
			</Box>
		</div>
	);
};

export default EditProfile;
