const express = require("express");
const router = new express.Router();

const User = require("../models/User");

// User signup route
router.post("/signup", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		res.status(201).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
});

// User login route
router.post("/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		res.send(user);
	} catch (err) {
		res.status(400).send(err);
	}
});

module.exports = router;
