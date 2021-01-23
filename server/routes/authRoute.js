const express = require("express");
const router = new express.Router();

const User = require("../models/User");

// User register
router.post("/api/register", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (err) {
		res.sendStatus(400);
	}
});

// User login
router.post("/api/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.status(200).send({ user, token });
	} catch (err) {
		res.sendStatus(400);
	}
});

module.exports = router;
