const jwt = require("jsonwebtoken");

// Protecting routes w/ JWT
const verifyToken = (req, res, next) => {
	const token = req.cookies.jwt;

	// Check if JWT exists & is verified
	if (token) {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
			if (err) {
				res.status(200).json({ success: true, redirectURL: "/login" });
			} else {
				console.log(decodedToken);
				next();
			}
		});
	} else {
		res.status(200).json({ success: true, redirectURL: "/login" });
	}

	// Old way of verifying, in case I need in the future
	// const authHeader = req.headers["authorization"];
	// // If authHeader exists then we split
	// const token = authHeader && authHeader.split(" ")[1];
	// if (token === null) return res.sendStatus(401);

	// jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
	// 	if (err) return res.sendStatus(403);

	// 	req.user = user;
	// 	next();
	// });
};

module.exports = verifyToken;
