const sharp = require("sharp");
const User = require("../models/User");

// Fetching all profiles and your profile
module.exports.fetch_all_profiles_get = async (req, res) => {
	// Retrieves all user profiles and omits their id
	const users = await User.find({}, { _id: 0 });
	res.send(users);
};

module.exports.fetch_my_profile_get = async (req, res) => {
	const user = await User.findById({ _id: req.user._id });
	res.send(user);
};

// Uploading and fetching our avatar
module.exports.upload_avatar_post = async (req, res) => {
	try {
		// Using sharp to convert image to png, and resize it to 250x250
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();

		// Saving a user's avatar
		await User.findByIdAndUpdate({ _id: req.user._id }, { avatar: buffer });
		res.send();
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

module.exports.fetch_my_avatar_get = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		// If no user or avatar exists
		if (!user || !user.avatar) throw new Error();

		res.set("Content-Type", "image/png");
		res.send(user.avatar);
	} catch (err) {
		res.sendStatus(404);
	}
};
