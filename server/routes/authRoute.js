const express = require("express");
const router = new express.Router();

const User = require("../models/User");
const auth = require("../middlewares/auth");

// User signup route
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

// User login route
router.post("/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send(err);
	}
});

// Route to test auth middleware
router.get("/lol", auth, async (req, res) => {
	res.send("hahahahahahaha");
});

module.exports = router;
