const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const { Translate } = require("@google-cloud/translate").v2;
const GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(
	process.env.GOOGLE_APPLICATION_CREDENTIALS
);

const User = require("../models/User");

// Fetching all profiles and your profile
const fetchAllProfilesGet = async (req, res) => {
	try {
		// Retrieves all user profiles and omits their id
		const users = await User.find({
			_id: { $nin: req.user._id }
		});
		res.status(200).send(users);
	} catch (err) {
		res.status(500).send(err);
	}
};

const fetchMyProfileGet = async (req, res) => {
	try {
		const user = await User.findById({ _id: req.user._id });
		res.status(200).send(user);
	} catch (err) {
		res.status(500).send(err);
	}
};

// Update my profile
const updateMyProfile = async (req, res) => {
	try {
		// Prevents users entering whitespace
		Object.values(req.body).forEach((value) => {
			if (value.trim() === "") res.status(406).send();
		});

		// Hashing our updated password
		if (req.body.password)
			req.body.password = await bcrypt.hash(req.body.password, 8);

		await User.findOneAndUpdate({ _id: req.user._id }, req.body);

		res.status(201).send();
	} catch (err) {
		res.status(500).send(err);
	}
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
		res.status(201).send();
	} catch (err) {
		console.log(err);
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

// Fetches possible languages that can be used for translating
const fetchLanguages = async (req, res) => {
	try {
		// Creates a client
		const translate = new Translate({
			credentials: GOOGLE_APPLICATION_CREDENTIALS,
			projectId: GOOGLE_APPLICATION_CREDENTIALS.project_id
		});
		// Lists available translation language with their names in English (the default).
		const [languages] = await translate.getLanguages();
		console.log(languages);

		res.status(200).send(languages);
	} catch (error) {
		res.sendStatus(404);
	}
};

module.exports = {
	fetchAllProfilesGet,
	fetchMyProfileGet,
	updateMyProfile,
	uploadAvatarPost,
	fetchMyAvatarGet,
	fetchLanguages
};
