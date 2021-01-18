const express = require("express");
const sharp = require("sharp");
const router = new express.Router();

// File upload setup
const multer = require("multer");
const upload = multer({
	limits: {
		fileSize: 8000000
	},
	fileFilter(req, file, callback) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return callback(new Error("Please upload an image"));
		}
		// Means everything went well
		callback(undefined, true);
	}
});

const User = require("../models/User");
const auth = require("../middlewares/auth");

// Retrieve all profiles
router.get("/users", auth, async (req, res) => {
	// Retrieves all user profiles and omits their id
	const users = await User.find({}, { _id: 0 });
	res.send(users);
});

// Retrieve your own profile
router.get("/users/me", auth, async (req, res) => {
	res.send(req.user);
});

// Upload Avatar
router.post(
	"/users/me/avatar",
	auth,
	upload.single("avatar"),
	async (req, res) => {
		// Using sharp to convert image to png, and resize it to 250x250
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();

		// Saving a user's avatar
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	(err, req, res, next) => {
		res.status(400).send({ err: err.message });
	}
);

// Delete Avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
	// Deleting a user's avatar
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});

// Fetch Avatar
router.get("/users/:id/avatar", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) throw new Error();

		res.set("Content-Type", "image/png");
		res.send(user.avatar);
	} catch (err) {
		res.status(404).send();
	}
});

module.exports = router;
