const express = require("express");
const router = new express.Router();

const User = require("../models/User");
const auth = require("../middlewares/auth");

// User register
router.post("/register", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send(err);
	}
});

// User login
router.post("/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.status(200).send({ user, token });
	} catch (err) {
		res.status(400).send(err);
	}
});

// User logout
router.post("/logout", auth, async (req, res) => {
	try {
		// Only removing a specific token in case a user is signed into multiple devices
		req.user.tokens = req.user.tokens.filter(
			(token) => token.token !== req.token
		);
		await req.user.save();

		res.send();
	} catch (err) {
		res.status(500).send();
	}
});

module.exports = router;
