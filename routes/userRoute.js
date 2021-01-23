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
const verifyToken = require("../middlewares/verifyToken");

// Retrieve all profiles
router.get("/api/users", verifyToken, async (req, res) => {
	// Retrieves all user profiles and omits their id
	const users = await User.find({}, { _id: 0 });
	res.send(users);
});

// Retrieve your own profile
router.get("/api/users/me", verifyToken, async (req, res) => {
	const user = await User.findById({ _id: req.user._id });
	res.send(user);
});

// Upload Avatar
router.post(
	"/api/users/me/avatar",
	verifyToken,
	upload.single("avatar"),
	async (req, res) => {
		// Using sharp to convert image to png, and resize it to 250x250
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();

		// Saving a user's avatar
		await User.findByIdAndUpdate({ _id: req.user._id }, { avatar: buffer });
		res.send();
	},
	(err, req, res, next) => {
		res.status(400).send({ err: err.message });
	}
);

// Fetch Avatar
router.get("/api/users/:id/avatar", verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) throw new Error();

		res.set("Content-Type", "image/png");
		res.send(user.avatar);
	} catch (err) {
		res.sendStatus(404);
	}
});

module.exports = router;
