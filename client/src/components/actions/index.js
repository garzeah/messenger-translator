import { CHECK_USER, USER_LOGIN } from "./types";

// Authentication Actions
// Checks if a user is signed in
export const checkUser = () => async (dispatch) => {
	const res = await fetch("/api/checkUser");

	dispatch({ type: CHECK_USER, payload: res.status });
};

// Attempts to log a user in
export const userLogin = (formValues) => async (dispatch) => {
	const res = await fetch("/api/login", {
		method: "POST",
		body: JSON.stringify(formValues),
		headers: { "Content-Type": "application/json" }
	});

	// Checking to see if we get any errors
	if (res.status !== 200) {
		const snackbarMessage = await res.json();

		dispatch({
			type: USER_LOGIN,
			payload: snackbarMessage.errors.email || snackbarMessage.errors.password
		});
	}

	// Send our success status and clean snackbar messages
	dispatch({ type: CHECK_USER, payload: res.status });
	dispatch({ type: USER_LOGIN, payload: "" });
};
