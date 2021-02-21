const jwt = require("jsonwebtoken");

// Protecting routes w/ JWT
const verifyToken = (req, res, next) => {
	const token = req.cookies.jwt;

	// Check if JWT exists & is verified
	if (token) {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
			if (err) {
				res.status(404).send();
			} else {
				req.user = decodedToken;
				next();
			}
		});
	} else {
		res.status(404).send();
	}
};

module.exports = verifyToken;
