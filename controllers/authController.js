const User = require("../models/User");

// Handle errors
const handleErrors = (err) => {
	let errors = {
		firstName: "",
		lastName: "",
		email: "",
		password: ""
	};

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
		res.status(201).send({ user, token });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.login_post = async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.status(200).send({ user, token });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};
