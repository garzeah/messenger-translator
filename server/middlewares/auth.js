const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Prevents users from accessing protected routes unless they have a JWT
const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, "myToken");

		// Finding a user w/ their decoded id and token
		const user = await User.findOne({
			_id: decoded._id,
			"tokens.token": token
		});

		if (!user) throw new Error();

		// Giving route handlers access to user model and token
		req.token = token;
		req.user = user;
		next();
	} catch (err) {
		res.status(401).send({ error: "Please authenticate" });
	}
};

module.exports = auth;
