const jwt = require("jsonwebtoken");

// Protecting routes w/ JWT
const verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	// If authHeader exists then we split
	const token = authHeader && authHeader.split(" ")[1];
	if (token === null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);

		req.user = user;
		next();
	});
};

module.exports = verifyToken;
