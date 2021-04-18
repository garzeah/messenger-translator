import { CHECK_USER, USER_LOGIN } from "../actions/types";

const authReducer = (state = {}, action) => {
	switch (action.type) {
		case CHECK_USER:
			return { ...state, isLoggedIn: action.payload };
		case USER_LOGIN:
			return { ...state, snackbarMessage: action.payload };
		default:
			return state;
	}
};

export default authReducer;
