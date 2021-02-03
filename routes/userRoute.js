const express = require("express");
const router = new express.Router();
const multer = require("multer");
const upload = multer({
	// File upload setup
	limits: {
		fileSize: 8000000
	},
	fileFilter(req, file, callback) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return callback("Please upload an image");
		}
		// Means everything went well
		callback(undefined, true);
	}
});

const verifyToken = require("../middlewares/verifyToken");
const userController = require("../controllers/userController");

// Retrieve all profiles
router.get("/api/users", verifyToken, userController.fetch_all_profiles_get);

// Retrieve your own profile
router.get("/api/users/me", verifyToken, userController.fetch_my_profile_get);

// Upload Avatar
router.post(
	"/api/users/me/avatar",
	verifyToken,
	upload.single("avatar"),
	userController.upload_avatar_post
);

// Fetch Avatar
router.get(
	"/api/users/:id/avatar",
	verifyToken,
	userController.fetch_my_avatar_get
);

module.exports = router;
