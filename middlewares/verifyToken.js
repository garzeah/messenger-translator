const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Protecting routes w/ JWT
const verifyToken = (req, res, next) => {
	const token = req.cookies.jwt;

	// Check if JWT exists & is verified
	if (token) {
		jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET,
			async (err, decodedToken) => {
				if (err) {
					res.status(404).send();
				} else {
					const user = await User.findById({ _id: decodedToken._id });
					req.user = user;
					next();
				}
			}
		);
	} else {
		res.status(404).send();
	}
};

module.exports = verifyToken;
