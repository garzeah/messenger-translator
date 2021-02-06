const User = require("../models/User");

// Age of cookie (7 days)
const maxAge = 7 * 24 * 60 * 60;

// Handle errors
const handleErrors = (err) => {
	let errors = {
		firstName: "",
		lastName: "",
		email: "",
		password: ""
	};

	// Incorrect email and password validation
	if (err.message === "Invalid information")
		errors.email = "Invalid information";

	// In the event we get a duplicate email
	if (err.code === 11000) {
		errors.email = "Email is already registered";
		return errors;
	}

	// Validation errors
	if (err.message.includes("user validation failed")) {
		Object.values(err.errors).forEach((error) => {
			errors[error.properties.path] = error.properties.message;
		});
	}

	return errors;
};

module.exports.register_post = async (req, res) => {
	const user = new User(req.body);

	// Saving user and giving them a JWT
	try {
		await user.save();
		const token = await user.generateAuthToken();
		// const token = createToken(user._id);
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(201).send({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).send({ errors });
	}
};

module.exports.login_post = async (req, res) => {
	try {
		const user = await User.login(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(200).json({ user: user._id });
	} catch (err) {
		res.send(err);
		// const errors = handleErrors(err);
		// res.status(400).send({ errors });
	}
};

module.exports.logout_get = (req, res) => {
	res.cookie("jwt", "", { maxAge: 1 });
	res.status(200).json({ success: true, redirectURL: "/login" });
};
