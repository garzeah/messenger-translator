const sharp = require("sharp");
const User = require("../models/User");

// Fetching all profiles and your profile
const fetchAllProfilesGet = async (req, res) => {
	// Retrieves all user profiles and omits their id
	const users = await User.find({}, { _id: 0 });
	res.send(users);
};

const fetchMyProfileGet = async (req, res) => {
	const user = await User.findById({ _id: req.user._id });
	res.send(user);
};

// Uploading and fetching our avatar
const uploadAvatarPost = async (req, res) => {
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

const fetchMyAvatarGet = async (req, res) => {
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

module.exports = {
	fetchAllProfilesGet,
	fetchMyProfileGet,
	uploadAvatarPost,
	fetchMyAvatarGet
};
